// Explanations connect a constructed route with individual move bounds.
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
      "general": "所以总步数至少是：",
      "teacher": "第三页已经完整证明了有解。这里把逐盘计数与移动规则联系起来：同一个盘的次数为什么要在小塔搬运中用两次？学生应同时说明构造达到这些次数，以及别的走法不能少于这些次数。两处都接上一个盘的起点，体现同一种归纳结构。",
      "attainTitle": "怎样恰好达到这个下界？",
      "attainBase": "一个盘直接移到目标柱，恰好移动一次。",
      "attainLet": "设 n 是正整数，考察 n+1 个盘的构造走法。",
      "attainAssumption": "按已构造的方法搬 n 个盘时，每个盘恰好达到自己的次数下界。",
      "attainStep": "在下面加一个最大盘后，按原方法前后各搬一次小塔，中间移动新最大盘。原有各盘的次数因此翻倍，新最大盘恰好移动一次。",
      "attainResult": "因此，n+1 个盘的这条走法也让每个盘恰好达到自己的次数下界。",
      "attainGeneral": "从一个盘的一步走法出发，以上构造可以逐次用于更多盘。因此，对于每个正整数 n，都存在一条走法，恰好达到各盘的次数下界。",
      "doneTitle": "这就是最少步数",
      "done": "别的走法不能低于这个下界；这套走法恰好达到它。因此，最少步数是：",
      "lowerBase": "只有一个盘时，要从一根柱搬到另一根柱，至少得移动一次。",
      "lowerSteps": [
        "现在考虑 n+1 个盘。最大盘第一次移动前，它上面的小盘必须全部移开，接收最大盘的柱子也必须空着。因此，这 n 个小盘已经从起始柱完整搬到了另一根柱上。",
        "再看最大盘最后一次到达目标柱的那一步：小盘不能在最大盘上，也不能在目标柱上，只能完整叠在第三根柱上。接下来，它们还必须完整搬到目标柱，任务才算完成。",
        "同一座 n 盘小塔前后各搬一次，因此每个小盘至少要移动的次数都翻倍。最大盘本身至少移动一次。"
      ]
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
      "general": "So the total number of moves is at least:",
      "teacher": "The third page has established existence. Connect individual counts to the movement rules: why does the same disc’s count apply twice in the smaller transfers? Students should explain both that the construction achieves these counts and that other routes cannot use fewer. Connect both arguments to one disc to expose their shared inductive structure.",
      "attainTitle": "How can a route achieve this bound?",
      "attainBase": "One disc moves directly to the target, exactly once.",
      "attainLet": "Let n be a positive integer and consider the constructed route for n + 1 discs.",
      "attainAssumption": "By the construction for n discs, each disc reaches its own move lower bound exactly.",
      "attainStep": "Add a new largest disc underneath. Use the existing method to transfer the smaller tower twice, moving the new largest disc between the transfers. Each existing disc's count doubles; the new largest disc moves exactly once.",
      "attainResult": "Therefore the constructed n + 1-disc route also achieves each disc's move lower bound exactly.",
      "attainGeneral": "Start with the one-move route for one disc and extend this construction. For every positive integer n, a route achieves every disc's lower bound exactly.",
      "doneTitle": "This is the minimum",
      "done": "No route can go below the bound; this route achieves it. The minimum is therefore:",
      "lowerBase": "One disc needs at least one move to reach another peg.",
      "lowerSteps": [
        "Consider n + 1 discs. Before the largest disc first moves, every smaller disc must leave it, and the receiving peg must be empty. The n smaller discs have therefore already been transferred as a complete tower to another peg.",
        "Now consider the largest disc’s final arrival at the target. The smaller discs can be neither on it nor on the target peg. They must be stacked on the third peg, and must still be transferred completely to the target to finish.",
        "The same n-disc tower is transferred once before and once after, so each smaller disc’s lower bound doubles. The largest disc itself moves at least once."
      ]
    }
  }
}
