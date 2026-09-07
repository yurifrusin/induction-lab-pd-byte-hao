# Guided classroom setup

The website uses the Supabase project at uuuilhircydoqswkyzvr.supabase.co. GitHub deployment and Supabase configuration are separate operations. The migration files in this repository describe the required changes; their presence does not confirm that they have been run on the hosted project.

## 1. Apply the database migrations in order

A Supabase project owner or an account with database administration access must run the SQL. GitHub editing rights alone do not provide that access.

In the project's **SQL Editor**, run these complete files in this order:

1. [20260903000000_classroom_tracking.sql](supabase/migrations/20260903000000_classroom_tracking.sql)
2. [20260907000000_guided_sequence.sql](supabase/migrations/20260907000000_guided_sequence.sql)

For a project where the first migration is already installed, apply the second migration next. Run each complete file and check that it finishes successfully. The second migration uses a transaction so its changes are applied together.

The first migration creates class sessions, pseudonymous participant records, teacher progress tracking and Row Level Security. The second adds the two class approvals, the expanded stage and disc-count constraints, and server-side progression checks.

The guided migration adds:

- class_sessions.workflow_version, defaulting to 1 for existing classes.
- shortest_released_at and steps_released_at, initially empty.
- get_induction_class_state(p_participant_id), which returns the current browser's own progress and its class approval state.
- enable_induction_guided_sequence(p_session_id), restricted to the active class's teacher.
- release_induction_class_gate(p_session_id, p_gate), restricted to that teacher, with p_gate equal to shortest or steps.
- A participant trigger that checks the correct answers and class approvals when guided progress is saved.

Students cannot approve a class. Their state RPC checks their participant identity and does not expose another learner's progress. The existing teacher dashboard retains its own-class progress access.

## 2. Enable anonymous student sessions

In **Authentication → Sign In / Providers → Anonymous Sign-Ins**, enable anonymous access and save. Each browser receives an authentication identifier; the student interface requests only an alias or seat number and the class code.

## 3. Configure teacher sign-in

The teacher dashboard uses an email sign-in link. In **Authentication → URL Configuration**, allow this exact redirect URL:

    https://yurifrusin.github.io/induction-lab-pd-byte-hao/?teacher=1

Keep valid return URLs used by other deployments sharing the project. The original induction-lab-pd-byte path and this induction-lab-pd-byte-hao path are different URLs.

Set **Site URL** to the project's agreed production destination. This is the fallback destination, so account for other active deployments before changing it. For local teacher sign-in testing, also allow:

    http://127.0.0.1:5173/?teacher=1

If a new email link returns to localhost, check the exact allowed redirect, Site URL and any customised email template. The app supplies its current path plus ?teacher=1 as emailRedirectTo; a custom template should preserve the requested destination. Request a fresh email after configuration changes. See [Supabase redirect URL documentation](https://supabase.com/docs/guides/auth/redirect-urls).

## 4. Create or upgrade a class

Open the [teacher dashboard](https://yurifrusin.github.io/induction-lab-pd-byte-hao/?teacher=1), sign in, and create a class. Classes created by the updated Hao site use workflow version 2, with both approval points closed.

Existing classes remain on version 1 until their teacher selects **Use guided sequence**. This keeps other classes on their earlier flow. On the first upgrade:

- Learners beyond NOTICE return to NOTICE.
- Saved NOTICE and SHORTEST? responses are retained.
- Existing game counts outside two or three discs are changed to three; their move, hint and completion values are reset.
- Both class approvals remain closed unless already set.

The upgrade and progress adjustment occur together. Repeating the enable action on a version 2 class does not reset its progress. Share the generated student link or six-character code after checking the selected class.

## 5. Use the two approval points

| Stage | Student requirement | Teacher action |
|---|---|---|
| PLAY → NOTICE | Explore the initial two or three-disc task. | No approval required. |
| NOTICE → SHORTEST? | Correctly identify that one route establishes possibility. | **Approve class: SHORTEST?** |
| SHORTEST? → STEPS | Correctly identify that the smaller discs must be together. | **Approve class: STEPS** |
| STEPS → PROVE | Explore one to four discs and the two smaller tasks. | No further approval. |
| PROVE → WHY CAN? | Follow the lower-bound argument, then examine achievability. | No further approval. |

Approval applies to the class and may be given before every student is ready. Each student still needs their own correct response. The second class approval is available after the first. PROVE has no third approval button.

The visible sequence is **PLAY → NOTICE → SHORTEST? → STEPS → PROVE → WHY CAN?**. For compatibility, stored stage keys are play, notice, prove, steps, debrief and can. The existing prove_answer column stores the SHORTEST? response.

PLAY in a joined class offers two and three discs. STEPS offers one through four. The standalone Teacher lens site retains two through five in PLAY and has no class approval requirement.

PROVE uses the sum 1 + 2 + 2² + … + 2^(n − 1) to establish a lower bound. WHY CAN? then builds a route with the same sum. The minimum is established when both arguments are combined.

## 6. Verify the classroom flow

Use a teacher browser and a separate student browser to check the actual hosted setup:

1. Create a fresh guided class and join it as a student. Confirm PLAY has two and three discs and shows no target count.
2. Answer NOTICE incorrectly and then correctly. SHORTEST? should stay locked before teacher approval.
3. Approve SHORTEST? from the teacher dashboard. A learner with the correct answer can continue; a learner without it remains locked.
4. Answer SHORTEST? correctly. STEPS should remain locked until its separate class approval.
5. Approve STEPS. Check the one, two, three and four-disc choices, then continue to PROVE and WHY CAN? without a further approval.
6. Refresh and rejoin using the same browser after progress reports a successful sync. Saved responses and class approval state should return. Tower positions themselves restart.
7. Join another student after approval. Class approval should already be available, while that student's questions still need correct answers.
8. Interrupt the student connection. Navigation should wait for a fresh approval check and recover after reconnection.

The student page checks class state about every 2.5 seconds and on focus or reconnection. Progress writes are serial, and failed writes are retried. The teacher dashboard receives progress updates and also refreshes periodically.

If the app reports that the guided database update is missing, verify that the second migration completed on the configured project. Do not treat a website build or a working email login as evidence that the migration has been applied.

## Entry URLs

- [Standalone activity](https://yurifrusin.github.io/induction-lab-pd-byte-hao/)
- [Classroom entrance](https://yurifrusin.github.io/induction-lab-pd-byte-hao/?classroom=1)
- [Teacher dashboard](https://yurifrusin.github.io/induction-lab-pd-byte-hao/?teacher=1)

Student links are generated by the dashboard in the form ?join=ABC234.

