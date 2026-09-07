# Induction Lab

Induction Lab supports a 15-minute EDUC7604 PD Byte about teaching mathematical induction. Teachers experience a Tower of Hanoi activity, then examine how a timed pause and a focused question can reveal students' reasoning.

## Open the activity

- [Standalone activity with Teacher lens](https://yurifrusin.github.io/induction-lab-pd-byte-hao/)
- [Classroom entrance](https://yurifrusin.github.io/induction-lab-pd-byte-hao/?classroom=1)
- [Teacher dashboard](https://yurifrusin.github.io/induction-lab-pd-byte-hao/?teacher=1)

Classroom mode uses Supabase for pseudonymous progress and class approvals. Apply the database updates described in [CLASSROOM_SETUP.md](CLASSROOM_SETUP.md) before using the guided classroom sequence. Publishing the website does not apply those updates.

## The six-stage sequence

| Screen | Learner task | Classroom progression |
|---|---|---|
| PLAY | Explore two and three discs. Aim for the fewest moves without seeing a target. | Continue to NOTICE. |
| NOTICE | Decide what one completed route establishes: it can be done in that many moves. | A correct answer **and** the teacher's **Approve class: SHORTEST?** action unlock SHORTEST?. |
| SHORTEST? | Explain why the smaller discs must be together before the largest disc moves. | A correct answer **and** the teacher's **Approve class: STEPS** action unlock STEPS. |
| STEPS | Explore one, two, three or four discs. Pause a construction before and after the largest-disc move. | Continue to PROVE without another approval. |
| PROVE | Use the smaller-case lower bound to show that fewer moves cannot work. | Continue to WHY CAN? without another approval. |
| WHY CAN? | Explain why the smaller-case construction produces a legal route with the stated sum. | Combine existence and the lower bound to establish the minimum. |

The last navigation label is **WHY CAN?**; its page heading is **Why believe “CAN”?**. The standalone site has no class approval gates, so a presenter can move between pages during the PD.

### Teacher approval in a live class

Create a new class in the teacher dashboard and share its student link or six-character code. New classes created by this version use the guided sequence.

The dashboard has two class-wide approval buttons. Approval may be given before every learner has answered correctly; each learner still needs their own correct answer to enter the next stage. The second approval follows the first. There is no third approval for PROVE or WHY CAN?.

For an existing class, select **Use guided sequence**. On its first upgrade, learners beyond NOTICE return to NOTICE and their saved answers are kept. Earlier game counts outside two or three discs are reset to a three-disc starting record. Selecting this action again does not reset an already upgraded class. Other classes remain on their earlier workflow until enabled separately.

Approvals are stored for the class in Supabase. Late joiners receive the same class approval state but must answer their own questions. Saved answers are restored after rejoining on the same authenticated browser. The moving tower itself starts again after a reload; a stored move count does not reconstruct its positions. During a connection problem, progression waits until the approval state can be checked again.

## Facilitation for the PD

Rehearse the two volunteer attempts, demonstrations and pauses within the presentation's time allocation. The six screens support the explanation; they are not six separate lectures.

1. **Frame the teacher learning.** Say: “We will practise pausing for prediction and explanation, then questioning whether a successful route proves a minimum.”
2. **Invite the two volunteers.** A non-Science teacher tries two discs, then a mathematics teacher tries three. Keep the answer hidden at the start of each attempt. If a completed attempt used extra moves, demonstrate the shortest route afterwards.
3. **Set the audience problem.** After a seven-move route, ask: “Could six moves or fewer work? Give a reason beyond ‘I tried it’.” Allow about 20 seconds of quiet thinking and keep the explanation open.
4. **Switch to the teacher role.** Ask participants to write one question they would ask a student who says, “I tried lots of times, so seven is the minimum.” Hear a response before modelling your own prompt.
5. **Use SHORTEST? and STEPS.** Establish why the smaller tower must move. Use four discs in STEPS to pause before and after the largest-disc move, and connect the two smaller tasks to the displayed sum.
6. **Separate the two proof obligations.** PROVE explains why fewer moves cannot work. WHY CAN? supplies the construction for each larger case. Ask where the smaller-case assumption is used.
7. **Check the teaching strategy.** Ask: “Where would you pause this tool, what would you ask, and what student explanation would you listen for?”

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

**WHY CAN? establishes achievability.** The one-disc case is a legal single move. For the next case, apply the smaller-case construction to transfer the smaller tower to the temporary peg, move the largest disc onto the empty target, then apply the smaller-case construction again to rebuild the tower there. Renaming the pegs preserves the puzzle rules. For n > 1, this uses 1 + 2S(n − 1) moves. Together with the initial case, the construction gives a legal route using S(n) moves for every integer n ≥ 1.

Only after both arguments is S(n) established as the minimum. A working route or a numerical pattern alone does not establish either general inference. Ask students to point to the two places where the smaller-case assumption does work.

### 中文主持提示

“我们先以学习者身份体验，然后分析怎样教学生。今天练习两种策略：在关键状态暂停，请学生预测并解释；完成路线后，继续追问为什么不能更少。”

“我们找到三个碟子的七步路线。六步或更少是否可能？请给出超出‘我试过了’的理由。先静思二十秒，暂时保留你的解释。”

“现在切换到教师角色。学生说：‘我试了很多次，所以七步最少。’请写一句你会问他的追问。”

“到了步骤页面，我们用四个碟子观察。最大碟移动前，小塔在哪里？目标柱为什么必须清空？移动最大碟后，哪个较小任务再次出现？画面中的两段小塔任务，对应 1 + 2(1 + 2 + 2²)。”

“设 n 是大于 1 的整数。对于每个完整解，最大碟第一次移动前，以及最后一次移到目标柱后，都有一个较小的转移任务。这两个阶段加上最大碟至少一步，给出不能更少的理由。”

“但我们还没有证明这个和式一定能达到。最后一页要说明：如何用较小情形的可行路线，构造下一情形的路线？初始情形为什么能启动这个推理？”

“如果你明天使用这个工具，你会在哪里暂停、问什么、期待学生说出什么？学生只给出步数，还不能说明他理解了推理。”

## Interaction and data

Click or tap a top disc, then choose a destination peg. Desktop dragging and keyboard activation with Enter or Space are supported. PLAY includes undo, reset and a hint for the current position. STEPS includes controlled playback; reduced-motion preferences disable automatic playback while retaining manual steps.

The standalone activity runs in the browser without submitting learner progress. Classroom mode records stage, disc count, move count, hint count, completion and the two conceptual responses in Supabase. Students join with an alias or seat number. The game sends no prompts to an LLM service. AI supports the teacher's authoring process; the teaching strategies are the pause, the question and the explanation elicited from students.

## Development and deployment

    pnpm install
    pnpm dev
    pnpm build
    node --test src/flow.test.js src/classroomProgress.test.js

The production build is written to dist. Pushing to main runs .github/workflows/deploy-pages.yml to publish GitHub Pages. Supabase migrations must be applied separately; see [CLASSROOM_SETUP.md](CLASSROOM_SETUP.md).
