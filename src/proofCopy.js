// Lower bounds and the constructed route are counted independently.
export const proofCopy = {
  "zh": {
    "visualHelp": "需要图示？展开对照",
    "visualCaptions": [
      "最大碟移动前：小塔在 B 柱，C 柱空着。",
      "最大碟移动后：小塔还在 B 柱。",
      "最后还要把小塔搬到 C 柱，叠在最大碟上。"
    ],
    "reveal": "想好后，展开解释",
    "hide": "收起推理，自己讲一遍",
    "show": "再看推理",
    "back": "返回",
    "restart": "重新体验",
    "lower": {
      "eyebrow": "不能更少 · 确实做得到",
      "title": "这套走法为什么最省步数？",
      "intro": "要证明步数最少，得回答两件事：为什么不能更少？有没有走法恰好达到这个下界？",
      "bridgeTitle": "为什么换一种走法也省不掉这些次数？",
      "bridge": "这里看的是最大盘第一次移动前和最后一次到达目标柱后，不要求它中途怎样走。这两段完整的小塔搬运始终存在。只看小盘的移动，仍是一道把完整小塔搬到另一根柱上的汉诺塔问题；柱子的名字和底下的大盘都没有改变规则。",
      "start": "一个碟子要换到另一根柱上，至少得移动一步。这是我们已经确定的起点。",
      "connect": "为什么不能更少？",
      "let": "设 n 是一个正整数。",
      "assumeLead": "假设",
      "assumeColon": "：",
      "assumption": "搬完 n 个盘时，从大到小，每个盘分别至少要移动 [[counts]] 次。",
      "innerConclusion": "这样，搬完 n+1 个盘时，每个盘从大到小分别至少要移动 [[nextCounts]] 次。",
      "scopeConclusion": "所以，对于这个 n，如果搬完 n 个盘时，每个盘从大到小分别至少要移动 [[counts]] 次，那么搬完 n+1 个盘时，每个盘从大到小分别至少要移动 [[nextCounts]] 次。",
      "general": "结合一个盘的起点，由数学归纳法，对于每个正整数 n，每个盘从大到小分别至少要移动 [[counts]] 次。因此，总步数至少是：",
      "teacher": "先按每个圆盘的移动次数证明下界，再用 Tₙ 给得到的和式命名。独立计算构造走法的步数 Gₙ，证明 Gₙ = Tₙ，才把不能更少与确实做得到接在一起。",
      "attainTitle": "怎样恰好达到这个下界？",
      "attainBase": "先看一个盘：[[G1]] = [[T1]] = 1。",
      "attainLet": "设 n 是一个正整数。",
      "attainAssumption": "[[Gn]] = [[Tn]]。",
      "attainStep": "这样，[[Gnext]] = 2[[Gn]] + 1 = 2[[Tn]] + 1 = [[Tnext]]。",
      "attainResult": "所以，对于这个 n，如果 [[Gn]] = [[Tn]]，那么 [[Gnext]] = [[Tnext]]。",
      "attainGeneral": "由数学归纳法，对于每个正整数 n，[[Gn]] = [[Tn]]。因此，确实有一条走法恰好用 [[Tn]] 步搬完。",
      "doneTitle": "这就是最少步数",
      "done": "每条走法至少需要 [[Tn]] 步，这套走法恰好用了 [[Gn]] = [[Tn]] 步。因此，最少步数就是 [[Tn]]。展开递推关系，可写成：",
      "lowerBase": "只有一个盘时，要从一根柱搬到另一根柱，至少得移动一次。",
      "lowerSteps": [
        "现在考虑 n+1 个盘。最大盘第一次移动前，它上面的小盘必须全部移开，接收最大盘的柱子也必须空着。因此，这 n 个小盘已经从起始柱完整搬到了另一根柱上。",
        "再看最大盘最后一次到达目标柱的那一步：小盘不能在最大盘上，也不能在目标柱上，只能完整叠在第三根柱上。接下来，它们还必须完整搬到目标柱，任务才算完成。",
        "同一座 n 盘小塔前后各搬一次，因此每个小盘至少要移动的次数都翻倍。最大盘本身至少移动一次。"
      ],
      "attainDefinition": "设 [[Gn]] 是按这套搬法搬完 n 个盘所用的步数。一个盘直接搬到目标柱；更多盘则先把小塔搬到临时柱，再移动最大盘，最后把小塔搬到目标柱，两次都沿用这套搬法。",
      "attainRecurrence": "因此，[[G1]] = 1，[[Gnext]] = 2[[Gn]] + 1。两次数的是同一座小塔的搬运步数，柱子换名字不会改变步数。",
      "boundName": "把这个步数下界记作 [[Tn]]。由这个和式可得 [[T1]] = 1，[[Tnext]] = 2[[Tn]] + 1。"
    }
  },
  "en": {
    "visualHelp": "Need a diagram? Open a reference",
    "visualCaptions": [
      "Before the largest disc moves: the smaller tower is on B and C is empty.",
      "After the largest disc moves: the smaller tower is still on B.",
      "The smaller tower must still reach C, on top of the largest disc."
    ],
    "reveal": "Explain it first, then compare",
    "hide": "Hide the reasoning and explain it yourself",
    "show": "Show the reasoning again",
    "back": "Back",
    "restart": "Restart experience",
    "lower": {
      "eyebrow": "LOWER BOUND · ACHIEVING IT",
      "title": "Why is this method shortest?",
      "intro": "To prove a move count is minimal, we need both parts: why fewer moves are impossible, and whether a route achieves that bound.",
      "bridgeTitle": "Why can a different route not avoid these counts?",
      "bridge": "The argument uses the largest disc’s first move and its final arrival at the target, whatever happens between them. Both complete smaller-tower transfers remain necessary. Looking only at the smaller discs gives the same Tower of Hanoi problem; renaming pegs and leaving a larger disc underneath do not change its rules.",
      "start": "One disc needs at least one move to reach a different peg. This is our established starting point.",
      "connect": "Why can no route use fewer moves?",
      "let": "Let n be a positive integer.",
      "assumeLead": "Assume",
      "assumeColon": ":",
      "assumption": "Completing an n-disc transfer requires at least [[counts]] moves respectively for the discs from largest to smallest.",
      "innerConclusion": "Thus, completing an (n + 1)-disc transfer requires at least [[nextCounts]] moves respectively for the discs from largest to smallest.",
      "scopeConclusion": "So for this n, if completing an n-disc transfer requires at least [[counts]] moves respectively from largest disc to smallest, then completing an (n + 1)-disc transfer requires at least [[nextCounts]] moves respectively in the same order.",
      "general": "Together with the one-disc case, mathematical induction shows that, for every positive integer n, the discs from largest to smallest require at least [[counts]] moves respectively. The total is therefore at least:",
      "teacher": "First establish the lower bound by considering each disc, then name the resulting sum Tₙ. Independently count the constructed route using Gₙ. Proving Gₙ = Tₙ connects the lower bound to an achievable route.",
      "attainTitle": "How can a route achieve this bound?",
      "attainBase": "For one disc, [[G1]] = [[T1]] = 1.",
      "attainLet": "Let n be a positive integer.",
      "attainAssumption": "[[Gn]] = [[Tn]].",
      "attainStep": "Thus, [[Gnext]] = 2[[Gn]] + 1 = 2[[Tn]] + 1 = [[Tnext]].",
      "attainResult": "So for this n, if [[Gn]] = [[Tn]], then [[Gnext]] = [[Tnext]].",
      "attainGeneral": "By mathematical induction, [[Gn]] = [[Tn]] for every positive integer n. This method therefore completes the transfer in exactly [[Tn]] moves.",
      "doneTitle": "This is the minimum",
      "done": "Every route requires at least [[Tn]] moves, and this method uses exactly [[Gn]] = [[Tn]] moves. Hence [[Tn]] is the minimum. Expanding the recurrence gives:",
      "lowerBase": "One disc needs at least one move to reach another peg.",
      "lowerSteps": [
        "Consider n + 1 discs. Before the largest disc first moves, every smaller disc must leave it, and the receiving peg must be empty. The n smaller discs have therefore already been transferred as a complete tower to another peg.",
        "Now consider the largest disc’s final arrival at the target. The smaller discs can be neither on it nor on the target peg. They must be stacked on the third peg, and must still be transferred completely to the target to finish.",
        "The same n-disc tower is transferred once before and once after, so each smaller disc’s lower bound doubles. The largest disc itself moves at least once."
      ],
      "attainDefinition": "Let [[Gn]] be the number of moves used by this method for n discs. Move one disc directly to the target. For a larger tower, transfer the smaller tower to the spare peg, move the largest disc, and transfer the smaller tower to the target, using the same method for both smaller transfers.",
      "attainRecurrence": "Therefore, [[G1]] = 1 and [[Gnext]] = 2[[Gn]] + 1. Both transfers involve the same smaller tower; renaming the pegs does not change the move count.",
      "boundName": "Denote this lower bound by [[Tn]]. The sum gives [[T1]] = 1 and [[Tnext]] = 2[[Tn]] + 1."
    }
  }
}
