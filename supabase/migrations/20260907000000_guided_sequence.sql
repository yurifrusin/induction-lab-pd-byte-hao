-- Guided classroom sequence. Existing classes remain on their original workflow.
begin;

alter table public.class_sessions
  add column if not exists workflow_version smallint not null default 1,
  add column if not exists shortest_released_at timestamptz,
  add column if not exists steps_released_at timestamptz;

alter table public.class_sessions
  drop constraint if exists class_sessions_workflow_version_valid,
  add constraint class_sessions_workflow_version_valid check (workflow_version in (1, 2)),
  drop constraint if exists class_sessions_release_order_valid,
  add constraint class_sessions_release_order_valid check (
    steps_released_at is null or shortest_released_at is not null
  );

alter table public.participants
  drop constraint if exists participants_stage_valid,
  add constraint participants_stage_valid check (stage in ('play', 'notice', 'prove', 'steps', 'debrief', 'can')),
  drop constraint if exists participants_disc_count_valid,
  add constraint participants_disc_count_valid check (disc_count between 1 and 5);

-- Return only the caller's progress and the release state of their own class.
-- This avoids adding a circular class_sessions/participants SELECT policy.
create or replace function public.get_induction_class_state(p_participant_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'An authenticated browser session is required.';
  end if;

  select jsonb_build_object(
    'workflow_version', s.workflow_version,
    'is_active', s.is_active and s.expires_at > now(),
    'expires_at', s.expires_at,
    'shortest_released_at', s.shortest_released_at,
    'steps_released_at', s.steps_released_at,
    'progress', jsonb_build_object(
      'stage', p.stage, 'disc_count', p.disc_count,
      'move_count', p.move_count, 'hint_count', p.hint_count,
      'completed', p.completed,
      'notice_answer', p.notice_answer, 'prove_answer', p.prove_answer
    )
  ) into v_result
  from public.participants as p
  join public.class_sessions as s on s.id = p.session_id
  where p.id = p_participant_id and p.user_id = auth.uid();

  if v_result is null then
    raise exception 'This class participant is not available to the current browser.';
  end if;
  return v_result;
end;
$$;

create or replace function public.enable_induction_guided_sequence(p_session_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.class_sessions%rowtype;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Teacher sign-in is required.';
  end if;
  select * into v_session from public.class_sessions
  where id = p_session_id and teacher_id = auth.uid()
    and is_active = true and expires_at > now()
  for update;
  if not found then
    raise exception 'Only the owner of an active class can enable this sequence.';
  end if;
  if v_session.workflow_version = 2 then
    return;
  end if;

  update public.class_sessions
  set workflow_version = 2
  where id = p_session_id;

  -- Upgrade and clamp existing progress in one transaction. Keep saved answers.
  -- The safe stage also permits the existing join RPC's display-name upsert.
  update public.participants
  set stage = case when stage in ('play', 'notice') then stage else 'notice' end,
      disc_count = case when disc_count in (2, 3) then disc_count else 3 end,
      move_count = case when disc_count in (2, 3) then move_count else 0 end,
      hint_count = case when disc_count in (2, 3) then hint_count else 0 end,
      completed = case when disc_count in (2, 3) then completed else false end
  where session_id = p_session_id;
end;
$$;

create or replace function public.release_induction_class_gate(p_session_id bigint, p_gate text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.class_sessions%rowtype;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Teacher sign-in is required.';
  end if;
  select * into v_session from public.class_sessions
  where id = p_session_id and teacher_id = auth.uid()
    and is_active = true and expires_at > now()
  for update;
  if not found then
    raise exception 'Only the owner of an active class can approve progression.';
  end if;
  if v_session.workflow_version <> 2 then
    raise exception 'Enable the guided sequence before approving progression.';
  end if;

  if p_gate = 'shortest' then
    update public.class_sessions
    set shortest_released_at = coalesce(shortest_released_at, now())
    where id = p_session_id;
  elsif p_gate = 'steps' then
    if v_session.shortest_released_at is null then
      raise exception 'Approve SHORTEST? before approving STEPS.';
    end if;
    update public.class_sessions
    set steps_released_at = coalesce(steps_released_at, now())
    where id = p_session_id;
  else
    raise exception 'The class gate must be shortest or steps.';
  end if;
end;
$$;

-- Apply the same gates to database writes, including requests outside the UI.
create or replace function public.validate_induction_guided_progress()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.class_sessions%rowtype;
begin
  select * into v_session from public.class_sessions where id = new.session_id;
  if v_session.workflow_version <> 2 then
    return new;
  end if;
  if not v_session.is_active or v_session.expires_at <= now() then
    raise exception 'This class has ended.';
  end if;
  if new.stage in ('play', 'notice', 'prove') and new.disc_count not in (2, 3) then
    raise exception 'Use two or three discs before the STEPS activity.';
  end if;
  if new.stage in ('steps', 'debrief', 'can') and new.disc_count not between 1 and 4 then
    raise exception 'Use one to four discs in the STEPS activity.';
  end if;
  if new.stage in ('prove', 'steps', 'debrief', 'can') and (
    new.notice_answer is distinct from 'possible' or v_session.shortest_released_at is null
  ) then
    raise exception 'Answer NOTICE correctly and wait for teacher approval of SHORTEST?.';
  end if;
  if new.stage in ('steps', 'debrief', 'can') and (
    new.prove_answer is distinct from 'all' or v_session.steps_released_at is null
  ) then
    raise exception 'Answer SHORTEST? correctly and wait for teacher approval of STEPS.';
  end if;
  return new;
end;
$$;

drop trigger if exists participants_validate_guided_progress on public.participants;
create trigger participants_validate_guided_progress
before insert or update on public.participants
for each row execute function public.validate_induction_guided_progress();

revoke all on function public.get_induction_class_state(bigint) from public, anon;
revoke all on function public.enable_induction_guided_sequence(bigint) from public, anon;
revoke all on function public.release_induction_class_gate(bigint, text) from public, anon;
revoke all on function public.validate_induction_guided_progress() from public, anon, authenticated;
grant execute on function public.get_induction_class_state(bigint) to authenticated;
grant execute on function public.enable_induction_guided_sequence(bigint) to authenticated;
grant execute on function public.release_induction_class_gate(bigint, text) to authenticated;

commit;
