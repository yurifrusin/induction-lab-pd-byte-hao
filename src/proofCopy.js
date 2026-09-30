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
      "bridgeTitle": "补充理由：换了柱子，为什么还能用原来的结论？",
      "bridge": "前后两段都要把完整的小塔从一根柱搬到另一根柱。柱子换了名字，移动规则没有变；底下的大盘也不会妨碍小盘移动，所以较小塔的下界在两段中都适用。",
      "start": "一个碟子要换到另一根柱上，至少得移动一步。这是我们已经确定的起点。",
      "barTitle": "用横线概括这些条件句",
      "barHelp": "每条红线对应旁边一整句“只要……那么……”。次数按圆盘从大到小排列。",
      "bars": [
        "只要一个圆盘至少要移动 1 次，那么两个圆盘就至少分别要移动 1、2 次。",
        "只要两个圆盘至少分别要移动 1、2 次，那么三个圆盘就至少分别要移动 1、2、4 次。",
        "只要三个圆盘至少分别要移动 1、2、4 次，那么四个圆盘就至少分别要移动 1、2、4、8 次。"
      ],
      "connect": "为什么不能更少？",
      "let": "设 n 是大于 1 的整数。",
      "assumeLead": "假设",
      "assumeColon": "：",
      "assumption": "搬完 n − 1 个盘时，每个盘的移动次数下界已经成立。",
      "consequence": "最大盘第一次移动前，小塔必须完整搬开；最大盘最后一次到达目标柱后，小塔还必须完整搬到目标柱。即使最大盘中途绕路，这两段也不能省。它们不重叠，所以小塔中每个盘的次数下界要分别算两次。最大盘自己至少移动一次。",
      "scopeConclusion": "所以，对这个 n 盘的塔，最大盘至少动一次，其余各盘的次数下界都是原来的两倍。",
      "general": "一个盘至少要移动一次。依照上面的推理增加盘数，对于每个正整数 n，各盘的次数下界依次确定。每一步只移动一个盘，所以总步数至少是：",
      "teacher": "第三页已经完整证明了有解。这里把逐盘计数与移动规则联系起来：同一个盘的次数为什么要在小塔搬运中用两次？学生应同时说明构造达到这些次数，以及别的走法不能少于这些次数。两处都接上一个盘的起点，体现同一种归纳结构。",
      "attainTitle": "怎样恰好达到这个下界？",
      "attainBase": "一个盘直接移到目标柱，恰好移动一次。",
      "attainLet": "设 n 是正整数，考察 n+1 个盘的构造走法。",
      "attainAssumption": "按已构造的方法搬 n 个盘时，每个盘恰好达到自己的次数下界。",
      "attainStep": "在下面加一个最大盘后，按原方法前后各搬一次小塔，中间移动新最大盘。原有各盘的次数因此翻倍，新最大盘恰好移动一次。",
      "attainResult": "因此，n+1 个盘的这条走法也让每个盘恰好达到自己的次数下界。",
      "attainGeneral": "从一个盘的一步走法出发，以上构造可以逐次用于更多盘。因此，对于每个正整数 n，都存在一条走法，恰好达到各盘的次数下界。",
      "doneTitle": "这就是最少步数",
      "done": "别的走法不能低于这个下界；这套走法恰好达到它。因此，最少步数是："
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
      "bridgeTitle": "More detail: why does the result still apply when the pegs change?",
      "bridge": "Each interval transfers the complete smaller tower between two pegs. Renaming the pegs does not change the rules, and the larger disc underneath does not obstruct the smaller discs. The smaller-tower bound therefore applies to both intervals.",
      "start": "One disc needs at least one move to reach a different peg. This is our established starting point.",
      "barTitle": "Represent the conditional statements with lines",
      "barHelp": "Each red line represents the entire “if … then …” statement beside it. Counts run from largest disc to smallest.",
      "bars": [
        "If one disc must move at least 1 time, then two discs must move at least 1 and 2 times respectively.",
        "If two discs must move at least 1 and 2 times respectively, then three discs must move at least 1, 2 and 4 times respectively.",
        "If three discs must move at least 1, 2 and 4 times respectively, then four discs must move at least 1, 2, 4 and 8 times respectively."
      ],
      "connect": "Why can no route use fewer moves?",
      "let": "Let n be an integer greater than 1.",
      "assumeLead": "Assume",
      "assumeColon": ":",
      "assumption": "The move lower bound for each disc of an n − 1-disc tower has been established.",
      "consequence": "Before the largest disc first moves, the smaller tower must be transferred completely away. After the largest disc finally reaches the target, the smaller tower must be transferred onto it. Detours by the largest disc cannot remove these two intervals. They do not overlap, so each smaller disc's bound applies twice. The largest disc moves at least once.",
      "scopeConclusion": "So for this n-disc tower, the largest disc moves at least once and each smaller disc's lower bound is doubled.",
      "general": "One disc needs at least one move. Repeating the reasoning as discs are added establishes each disc's bound for every positive integer n. Each move shifts one disc, so the total is at least:",
      "teacher": "The third page has established existence. Connect individual counts to the movement rules: why does the same disc’s count apply twice in the smaller transfers? Students should explain both that the construction achieves these counts and that other routes cannot use fewer. Connect both arguments to one disc to expose their shared inductive structure.",
      "attainTitle": "How can a route achieve this bound?",
      "attainBase": "One disc moves directly to the target, exactly once.",
      "attainLet": "Let n be a positive integer and consider the constructed route for n + 1 discs.",
      "attainAssumption": "By the construction for n discs, each disc reaches its own move lower bound exactly.",
      "attainStep": "Add a new largest disc underneath. Use the existing method to transfer the smaller tower twice, moving the new largest disc between the transfers. Each existing disc's count doubles; the new largest disc moves exactly once.",
      "attainResult": "Therefore the constructed n + 1-disc route also achieves each disc's move lower bound exactly.",
      "attainGeneral": "Start with the one-move route for one disc and extend this construction. For every positive integer n, a route achieves every disc's lower bound exactly.",
      "doneTitle": "This is the minimum",
      "done": "No route can go below the bound; this route achieves it. The minimum is therefore:"
    }
  }
}
