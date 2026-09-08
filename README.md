# Induction Lab

Induction Lab supports a 15-minute EDUC7604 PD Byte about teaching mathematical induction. Teachers experience a Tower of Hanoi activity, then examine how a timed pause and a focused question can reveal students' reasoning.

## Open the activity

- [Standalone activity with Teacher lens](https://yurifrusin.github.io/induction-lab-pd-byte-hao/)
- [Classroom entrance](https://yurifrusin.github.io/induction-lab-pd-byte-hao/?classroom=1)
- [Teacher dashboard](https://yurifrusin.github.io/induction-lab-pd-byte-hao/?teacher=1)

Classroom mode uses Supabase for pseudonymous progress and class approvals. Apply the database updates described in [CLASSROOM_SETUP.md](CLASSROOM_SETUP.md) before using the guided classroom sequence. Publishing the website does not apply those updates.

## The five-stage sequence

| Screen | Learner task | Classroom progression |
|---|---|---|
| PLAY | Explore two and three discs. Aim for the fewest moves without seeing a target. | Continue to NOTICE. |
| NOTICE | Answer a short question about what a completed route establishes. The page shows choices and answer status without explanatory hints. | A correct answer **and** the teacher's **Approve class: SHORTEST?** action unlock SHORTEST?. |
| SHORTEST? | Explain the smaller-tower transfers, apply the reasoning to two and three discs, then prove that a route exists for every positive disc count. Explanations are folded. | A correct answer **and** the teacher's **Approve class: STEPS** action unlock STEPS. |
| STEPS | Play through the constructed method with one to four discs. Explain each disc's move count and check it against the walkthrough. | Continue to PROVE without another approval. |
| PROVE | Connect the per-disc lower bounds with the counts achieved by the construction to establish the minimum. | Restart or revisit an earlier page. |

Student and teacher activity views share these five pages in both languages. Teacher lens adds facilitation cues and presenter controls. The standalone site has no class approval gates, so a presenter can move between pages during the PD. The existence proof is now inside SHORTEST?, before the four-disc walkthrough; there is no separate WHY CAN? page.

### Teacher approval in a live class

Create a new class in the teacher dashboard and share its student link or six-character code. New classes created by this version use the guided sequence.

The dashboard has two class-wide approval buttons. Approval may be given before every learner has answered correctly; each learner still needs their own correct answer to enter the next stage. The second approval follows the first. There is no third approval for PROVE. Each checkpoint also shows how many participants have not yet answered correctly, including those who have not submitted an answer.

For an existing class, select **Use guided sequence**. On its first upgrade, learners beyond NOTICE return to NOTICE and their saved answers are kept. Earlier game counts outside two or three discs are reset to a three-disc starting record. Selecting this action again does not reset an already upgraded class. Other classes remain on their earlier workflow until enabled separately.

Approvals are stored for the class in Supabase. Late joiners receive the same class approval state but must answer their own questions. Saved answers are restored after rejoining on the same authenticated browser. The moving tower itself starts again after a reload; a stored move count does not reconstruct its positions. During a connection problem, progression waits until the approval state can be checked again.

## Facilitation for the PD

Everyone participates on their own device or with a partner. There are no volunteer demonstrations. Use a short learner experience to model strategies that participants can use as teachers. Rehearse the activity within the group's 15-minute allocation.

1. **Frame the learning problem.** Students may reproduce the format of an induction proof without understanding how the smaller case supports the next one. Teachers practise using a short response to guide pacing and a paused representation to elicit an explanation.
2. **Join together.** Share a classroom QR code or student link on Blackboard. Participants use a nickname; no student sign-in is required. Ask everyone to select two discs, then try three. Keep the minimum hidden during exploration.
3. **Ask before explaining.** Open NOTICE and allow independent answers. Neither side of the page supplies the reasoning, including after an answer. Discuss reasons orally after responses. Show the teacher dashboard, check who needs support, and use the first class approval when ready.
4. **Reason from the rules.** On SHORTEST?, ask why the smaller discs must be together before the largest can move. Let participants explain before unfolding the diagrams. Use the two-disc argument in the three-disc case.
5. **Establish existence by induction.** At the bottom of SHORTEST?, explain the one-disc starting case and how an existing smaller-tower method can be used twice to build the next route. Identify those two uses before naming mathematical induction. Use the second class approval after this discussion.
6. **Explain, then check individual counts.** On STEPS, use four discs. Pause after moves seven and eight. Connect the two transfers of the same smaller tower to each disc's doubled count, then to the sum. Do not introduce the expression through a table of totals followed by a guess.
7. **Establish the minimum and practise teaching.** On PROVE, connect each disc's lower bound with the count achieved by the construction. Ask participants to write a pause point, a student question and the reasoning they would listen for. Keep the diagrams available when needed.

### Presenter controls

- Standalone PLAY starts with two discs and retains the two, three, four and five-disc choices. Student PLAY in a joined class has only two and three.
- Student PLAY shows the move count without a TARGET or MINIMUM field. Completion does not announce whether the result is shortest.
- Turn on **Teacher lens** for **Reveal minimum** and **Show shortest route from start**. The latter resets the tower; **Next demonstration move** then advances one move at a time.
- Switching Teacher lens off hides the revealed minimum and stops that demonstration. Resetting or changing the disc count also hides the minimum.
- STEPS has one to four discs in both modes. Use **Next move** for single steps or **Play** for a walkthrough that pauses around the largest-disc move. With four discs, those pauses occur after the first smaller transfer and immediately after moving the largest disc.
- A manual move away from the demonstrated route stops the walkthrough. **Restart walkthrough** returns to its starting position.

## The mathematical thread

Keep the move count in sum form:

    S(n) = 1 + 2 + 2² + … + 2^(n − 1)
    S(1) = 1
    S(n) = 1 + 2S(n − 1), for n > 1

The one-disc sum contains only its first term. In the four-disc walkthrough, the visual connection is:

    1 + 2(1 + 2 + 2²) = 1 + 2 + 2² + 2³

**PROVE establishes a lower bound.** Let n be an integer greater than 1. Assume the smaller-case lower bound holds for transfers between distinct pegs. Before the largest disc's first move, its smaller tower must have been transferred to another peg, costing at least S(n − 1). After the largest disc's final move onto the target, the smaller tower must be transferred onto it, again costing at least S(n − 1). The largest disc moves at least once. These portions of the route do not overlap, so each completed route costs at least S(n − 1) + 1 + S(n − 1) = S(n). This reasoning includes routes with detours.

**Existence comes first, on SHORTEST?.** The one-disc case is a legal single move. For the next case, apply the smaller-case construction to transfer the smaller tower to the temporary peg, move the largest disc onto the empty target, then apply the smaller-case construction again to rebuild the tower there. Renaming the pegs preserves the puzzle rules. This proves that a route exists for every positive disc count. STEPS then connects the construction to individual counts, and PROVE explains why these counts are achieved together. The construction uses S(n) moves for every positive integer n.

Only after both arguments is S(n) established as the minimum. A working route or a numerical pattern alone does not establish either general inference. Ask students to point to the two places where the smaller-case assumption does work.

### Teacher preparation

Create and test the class before presenting. Keep the dashboard and the standalone activity open in separate tabs. Use Teacher lens while preparing; switch it off when projecting a question whose reasoning students should supply. Share the link copied from the active class, and check that the QR code and Blackboard link point to that class. The dashboard displays the current attempt and current responses, not a complete archive of a learner's earlier attempts.

## Interaction and data

Click or tap a top disc, then choose a destination peg. Desktop dragging and keyboard activation with Enter or Space are supported. PLAY includes undo and reset; only the standalone activity offers a hint. STEPS includes controlled playback; reduced-motion preferences disable automatic playback while retaining manual steps.

The standalone activity runs in the browser without submitting learner progress. Classroom mode records stage, disc count, move count, hint count, completion and the two conceptual responses in Supabase. Students join with an alias or seat number. The game sends no prompts to an LLM service. AI supports the teacher's authoring process; the teaching strategies are the pause, the question and the explanation elicited from students.

## Development and deployment

    pnpm install
    pnpm dev
    pnpm build
    node --test src/flow.test.js src/classroomProgress.test.js

The production build is written to dist. Pushing to main runs .github/workflows/deploy-pages.yml to publish GitHub Pages. Supabase migrations must be applied separately; see [CLASSROOM_SETUP.md](CLASSROOM_SETUP.md).
