# Induction Lab

Induction Lab is a five-minute interactive segment for a 15-minute EDUC7604 PD Byte. It lets preservice teachers experience a Year 12 Tower of Hanoi task before revealing the mathematical induction underneath it.

## Live website

The published activity is available at:

**https://yurifrusin.github.io/induction-lab-pd-byte-hao/**

Classroom tracking is also available as an optional mode. Teachers can create short join codes and watch pseudonymous learner progress update in real time. See `CLASSROOM_SETUP.md` for the one-time Supabase configuration.

## Use it immediately

Use the live website above, or start the local development server:

```powershell
pnpm install
pnpm dev
```

Then open the local URL printed in the terminal and use browser full-screen mode.

## Five-minute facilitation run

| Time | Screen | Facilitation move |
|---|---|---|
| 0:00-2:00 | Play | Invite a non-Science teacher to try two discs, then a mathematics teacher to try three. Both aim for the fewest moves. After each completed attempt, show the shortest route immediately if the attempt used extra moves. |
| 2:00-3:00 | Notice | Ask: “We have found a seven-move route for three discs. Could six or fewer moves work? How could we decide?” Give 20 seconds of quiet thinking, then park the question. Ask what one completed route establishes: it can be done in that many moves. |
| 3:00-4:30 | Prove | Explain the general case for n > 1. Separate the three-stage construction from the lower bound using the largest disc's first and last moves. Select “all” and then reveal the equality. |
| 4:30-5:00 | Debrief | Return to three discs: 3 + 1 + 3 = 7, and the lower bound rules out six. Switch explicitly from experiencing the task as learners to planning its use as teachers. Ask what student explanation would show understanding. |

The header steps are directly selectable. Teacher lens adds facilitation cues and reveal controls. Rehearse the two attempts and demonstrations to fit the available time.

### Presenter controls

- The standalone activity starts with two discs. The minimum stays hidden during an attempt, including after completion.
- Student play shows only the actual move count, with no TARGET or MINIMUM field. Teacher lens contains the minimum field and reveal controls; switching it off hides the answer and stops the demonstration.
- Turn on **Teacher lens** for **Reveal minimum** and **Show shortest route from start**.
- **Show shortest route from start** resets the current tower and reveals its minimum. Use **Next demonstration move** to advance one move at a time. Pause at the cue before moving the largest disc, then ask which smaller problem remains afterwards.
- Selecting a disc count or resetting the game hides the minimum again. After the two-disc attempt and any demonstration, use **Next volunteer: three discs**, or select **3**. Move to **NOTICE** after the three-disc activity.
- The playable disc counts are two and three. A shortest-route demonstration reveals the three-disc number. Keep the audience task on **why six or fewer moves cannot work**; return to that reasoning after the general argument.

### Two strategies teachers can reuse

Introduce the activity with: “Today we will practise two teaching strategies: pause the tool for prediction and explanation, then question whether a successful route proves a minimum.” After setting the three-disc thinking task, say: “Now switch to your teacher role. A student says, ‘I tried lots of times, so seven is the minimum.’ Write one question you would ask next.” Invite one response, model the pause with that question, and revisit the strategy at the debrief.

1. **Pause and predict.** Stop before the largest-disc move. Ask students where the smaller tower must be and why the target peg must be empty. Advance one move, then ask which smaller problem appears again. The controlled replay gives students time to explain the change.
2. **Compare a successful route with a reason it is shortest.** Keep the seven-move route visible and ask whether six moves could work. Use the move record as evidence of achievability, then ask students to justify the unavoidable smaller transfers. Assess that explanation, not just the answer seven.

## Mathematical and pedagogical through-line

- Put the problem before the method: exploration creates a need for proof.
- A found strategy establishes an upper bound (CAN); it does not prove a minimum.
- For n > 1, a route using two smaller transfers with move counts a and b takes `a + 1 + b` moves. Using shortest smaller transfers establishes `M(n) ≤ 2M(n − 1) + 1` (CAN).
- Every complete legal transfer needs at least `M(n − 1)` moves before the largest disc's first move and at least `M(n − 1)` moves after its last move to the target. The largest disc moves at least once, so `M(n) ≥ 2M(n − 1) + 1` (MUST). This argument also covers routes that move the largest disc more than once.
- Together these bounds give `M(n) = 2M(n − 1) + 1`, with `M(1) = 1`. A shortest route moves the largest disc once, directly to the target.
- The proposition must be strong enough to contain both achievability and minimality.
- Induction can explain recursive structure, not merely verify a supplied formula.
- A few checked examples are not the same as a universal claim.

Here `M(n)` means the minimum number of moves for a complete tower transfer. To connect the activity to induction, make the inference explicit: if `M(n − 1) = 2^(n − 1) − 1`, the recurrence gives `M(n) = 2^n − 1`. The initial case and this step establish the formula for every positive integer n. Playing successfully or watching a shortest route does not by itself demonstrate understanding of that inference.

These ideas were synthesised from the supplied deficient-chessboard/ordinary-induction chapters, the induction revision document, and the three-lesson Year 12 sequence. The EDUC7604 task description shaped the short timing, participant engagement, APST alignment, and safe/ethical ICT debrief.

### 中文主持提示

“我们先以学习者的身份体验，随后再以教师的身份分析怎样使用这个工具。先请一位非 Science 教师尝试两个碟子，再请一位数学教师尝试三个碟子，目标都是尽量少走。如果完成后的路线还能缩短，我会马上展示最短路线。”

“我们已经找到三个碟子的七步路线。有没有六步或更少的路线？怎样判断？先静思二十秒。我们暂时保留理由，先看一般情形。”

“设 n 是大于 1 的整数，M(n) 表示最少步数。先把上面的 n−1 个碟子搬到临时柱，清空目标柱；把最大碟搬到目标柱；最后把小塔叠回去。这给出一条可行路线。两段都采用最短路线，就能用 M(n−1)+1+M(n−1) 步完成。”

“为什么不能更少？对于每个完整解，最大碟第一次移动前，小塔至少需要 M(n−1) 步完成转移；最大碟最后一次移到目标柱后，小塔还至少需要 M(n−1) 步。最大碟本身至少移动一次。因此，这个步数既能达到，也不能再少。”

“回到三个碟子：3+1+3=7。前后的两个小塔任务都不能省，所以六步不够。现在请切换到教师视角：你会怎样用这个工具，让学生自己说出这个理由？”

“第一种做法是在最大碟移动前暂停，请学生预测小塔的位置并解释目标柱为什么必须清空。第二种做法是展示七步路线后，追问六步是否可能。学生只答七还不够；请他们解释两个较小任务为何必需。”

“这里还要连接回 mathematical induction。递推关系本身没有完成公式的归纳证明：需要说明 n−1 情形的已知结论怎样用于 n 情形，再结合初始情形。请学生指出推理中哪一步用了较小情形的结论，而不只是套入公式。”

## Interaction and access

- Click or tap a top disc, then choose a destination peg.
- Dragging is also supported on desktop.
- Keyboard users can activate discs and pegs with Enter or Space.
- Undo, reset, disc-count selection, live legal-move feedback and a shortest-route hint for the current position are included. Teacher lens also supports a controlled demonstration from the starting position.
- Optional classroom mode records stage, move count, hint count and conceptual responses for a live teacher dashboard.
- Motion respects `prefers-reduced-motion`, and all core controls have visible focus states and accessible names.

## Safe, responsible and ethical LLM use

The site models an LLM as a teacher's design collaborator, not an assessor or mathematical authority. The standalone game runs in the browser without submitting learner progress; optional classroom mode records the progress listed above through the configured Supabase service. The game sends no prompts to an LLM service. Teachers should still verify the mathematics, test edge cases, review accessibility and keep a non-digital alternative available.

## Editable source

This repository contains the React + Vite project. Useful commands:

```powershell
pnpm install
pnpm dev
pnpm build
```

The production build is written to `dist`.

## GitHub Pages deployment

Pushing to `main` automatically builds and publishes the site through the workflow in `.github/workflows/deploy-pages.yml`. The workflow deploys the generated `dist` directory and does not publish `node_modules` or local development files.
