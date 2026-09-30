// Explanations connect a constructed route with individual move bounds.
export const proofCopy = {
  "zh": {
    "visualHelp": "需要图示？展开对照",
    "visualNote": "图示展示最大盘从 A 柱移到 C 柱的前后。小塔的具体移动步骤没有画出。",
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
      "eyebrow": "已有走法，再说明为什么最省步数",
      "title": "这套走法为什么最省步数？",
      "intro": "前面已经证明每种盘数都有走法。现在看这套方法：每个盘实际动了几次？换一种走法，能不能让它动得更少？把这两个问题接起来，就能确定最少步数。",
      "focusCue": "总步数只是一个合计。若把注意力从整条路线移到每个圆盘上，怎样重新数，才能得到同一个总数？",
      "bridgeTitle": "补充理由：换了柱子，为什么还能用原来的结论？",
      "bridge": "只看小碟子：每一段都从一座完整的小塔开始，到另一根柱上的完整小塔结束，每一步仍遵守原来的规则。底下的大碟子比它们都大，不会给小碟子提供新的移动方式。柱子的名字也不会改变规则。因此，每一段本身就是一次完整的小塔搬运。",
      "detoursTitle": "补充理由：最大盘中途来回移动，也能这样算",
      "detours": [
        "先看最大盘第一次移动前：上面的小盘已经从起始柱完整地搬到另一根柱上，否则最大盘动不了。",
        "再看最大盘最后一次移到目标柱之后：小盘还叠在第三根柱上，必须再完整地搬到目标柱。这以后最大盘不会再离开，否则它还得回来，就不是最后一次到达了。",
        "前后这两段没有重叠，每段都是一次完整的小塔搬运。最大盘中间多走几步，也省不掉这两段，所以原来对小塔的结论仍要用两次。"
      ],
      "start": "一个碟子要换到另一根柱上，至少得移动一步。这是我们已经确定的起点。",
      "barTitle": "用横线概括这些条件句",
      "barHelp": "每条红线表示旁边一整句“只要……那么……”。句中的次数都按圆盘从大到小排列。",
      "bars": [
        "只要一个圆盘至少要移动 1 次，那么两个圆盘就至少分别要移动 1、2 次。",
        "只要两个圆盘至少分别要移动 1、2 次，那么三个圆盘就至少分别要移动 1、2、4 次。",
        "只要三个圆盘至少分别要移动 1、2、4 次，那么四个圆盘就至少分别要移动 1、2、4、8 次。"
      ],
      "connect": "展开理由：每个盘至少得动几次",
      "let": "设 n 是大于 1 的整数。要研究 n 个盘，上面的小塔有 n − 1 个盘。",
      "assumeLead": "假设",
      "assumeColon": "：",
      "assumption": "较小塔从大到小各盘的移动次数下界已经成立。",
      "consequence": "在 n 个盘的搬运中，较小塔要先从起始柱移到临时柱，之后还要从临时柱移到目标柱。同一个小盘会参加这两段完整搬运，大小排名和移动规则都没有改变，所以它的次数下界要用两次。新加的最大盘至少移动一次。",
      "counting": "同一个小圆盘：原来的次数至少要算两遍",
      "meaning": "比如，原来小塔中最大的圆盘，每段至少动一次，合起来至少两次；原来第二大的圆盘，每段至少动两次，合起来至少四次。新增的最大盘自己至少动一次。这个理由不依赖某个特定的圆盘数量。",
      "scopeConclusion": "所以，对于这个 n，从大到小各盘至少要移动 1、2、2²、……次。",
      "general": "从一个盘至少要移动一次这个起点出发，逐个增加盘数时，都能把较小塔的逐盘下界推到新塔。因此，对于每个正整数 n，n 个盘从大到小各盘至少要移动 1、2、2²、……、2⁽ⁿ⁻¹⁾ 次。每一步只移动一个盘，把这些次数相加，就得到总步数下界：",
      "recallTitle": "把最短步数的理由讲完整",
      "recall": "先说明这套走法让每个盘动了几次，再说明这些次数为什么不能更少。让和式里的每一项都对应到一个盘。需要时可以回看解释。",
      "teacher": "第三页已经完整证明了有解。这里把逐盘计数与移动规则联系起来：同一个盘的次数为什么要在小塔搬运中用两次？学生应同时说明构造达到这些次数，以及别的走法不能少于这些次数。两处都接上一个盘的起点，体现同一种归纳结构。",
      "barWhy": "同一个理由说明了这些条件句：原有的每个圆盘都参加两次完整的小塔搬运，各自的次数至少翻倍；新增的最大盘至少移动一次。有了一个圆盘至少一次这个起点，就能接着得到后面的结论。",
      "attainTitle": "这套已构造的走法，恰好用多少步？",
      "attainBase": "一个盘直接移到目标柱，恰好移动一次。",
      "attainLet": "设 n 是正整数，考察 n+1 个盘的构造走法。",
      "attainAssumption": "按已构造的方法搬 n 个盘时，从大到小各盘恰好分别移动 1、2、2²、……次。",
      "attainStep": "在下面加一个最大盘后，先按原方法搬小塔，再移动新最大盘，最后再按原方法搬小塔。",
      "attainResult": "因此，n+1 个盘从大到小，恰好分别移动 1、2、2²、……、2ⁿ 次。",
      "attainGeneral": "从一个盘的起点开始逐步构造。对于每个正整数 n，n 个盘从大到小恰好分别移动 1、2、2²、……、2⁽ⁿ⁻¹⁾ 次。",
      "doneTitle": "这就是最少步数",
      "done": "这套走法恰好用这些步数完成，而更少的步数不够。因此，最少步数是："
    }
  },
  "en": {
    "visualHelp": "Need a diagram? Open a reference",
    "visualNote": "These pictures show the positions before and after the largest disc moves from A to C. The individual moves used to transfer the smaller tower are not shown.",
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
      "eyebrow": "A ROUTE EXISTS · EXPLAIN WHY IT IS SHORTEST",
      "title": "Why is this method shortest?",
      "intro": "We have proved that a route exists for every positive disc count. Now consider this method: how often does each disc move, and could a different route make it move fewer times? Connecting these questions establishes the minimum.",
      "focusCue": "The total move count is just a sum. If we shift our attention from the whole route to each disc, how could we count it again and get the same total?",
      "bridgeTitle": "More detail: why does the result still apply when the pegs change?",
      "bridge": "Look only at the smaller discs. Each interval starts and ends with a complete smaller tower on different pegs, and each move obeys the original rules. The larger disc underneath permits no new kind of smaller-disc move. Peg names also do not change the rules. Each interval is therefore itself a complete smaller-tower transfer.",
      "detoursTitle": "More detail: the count still holds if the largest disc moves back and forth",
      "detours": [
        "Before the largest disc first moves, the smaller discs must already have been transferred as a complete tower from the starting peg to another peg. Otherwise the largest disc cannot move.",
        "After the largest disc’s final arrival on the target, the smaller discs are still stacked on the third peg and must be transferred to the target. The largest disc cannot leave again: it would have to return, so this would not have been its final arrival.",
        "These two intervals do not overlap, and each is a complete smaller-tower transfer. Extra moves of the largest disc cannot remove either interval. The smaller-tower result therefore still applies twice."
      ],
      "start": "One disc needs at least one move to reach a different peg. This is our established starting point.",
      "barTitle": "Represent the conditional statements with lines",
      "barHelp": "Each red line represents the entire “if … then …” statement beside it. Move counts are listed from the largest disc to the smallest.",
      "bars": [
        "If one disc must move at least 1 time, then two discs must move at least 1 and 2 times respectively.",
        "If two discs must move at least 1 and 2 times respectively, then three discs must move at least 1, 2 and 4 times respectively.",
        "If three discs must move at least 1, 2 and 4 times respectively, then four discs must move at least 1, 2, 4 and 8 times respectively."
      ],
      "connect": "Open the reasoning: how often must each disc move?",
      "let": "Let n be an integer greater than 1. To consider n discs, the smaller tower has n − 1 discs.",
      "assumeLead": "Assume",
      "assumeColon": ":",
      "assumption": "Assume the move lower bounds for each disc in the smaller tower have been established, from largest to smallest.",
      "consequence": "To move n discs, the smaller tower must first move from the starting peg to the temporary peg, then from the temporary peg to the target peg. The same smaller disc participates in both complete transfers, keeping the same size rank and following the same rules, so its lower bound applies twice. The new largest disc must move at least once.",
      "counting": "For each smaller disc: count its requirement twice",
      "meaning": "The largest disc within the smaller tower needs at least one move per interval, giving at least two. The next needs at least two per interval, giving at least four. The new largest disc itself needs at least one. This reasoning does not depend on a particular disc count.",
      "scopeConclusion": "So for this n, the lower bounds for the discs, from largest to smallest, are 1, 2, 2², … .",
      "general": "Starting with the base case of one disc, each time we add a disc we can extend the lower bounds from the smaller tower to the new tower. Therefore, for every positive integer n, the lower bounds for n discs from largest to smallest are 1, 2, 2², …, 2⁽ⁿ⁻¹⁾. Since each move moves one disc, adding these counts gives the total lower bound:",
      "recallTitle": "Explain why the route is shortest",
      "recall": "Explain how often this method moves each disc, then why fewer moves cannot work. Match each term of the sum to a disc. Reopen the explanations when useful.",
      "teacher": "The third page has established existence. Connect individual counts to the movement rules: why does the same disc’s count apply twice in the smaller transfers? Students should explain both that the construction achieves these counts and that other routes cannot use fewer. Connect both arguments to one disc to expose their shared inductive structure.",
      "barWhy": "The same reason establishes these conditionals: each existing disc participates in two complete smaller transfers, doubling its own lower bound, while the new largest disc moves at least once. The one-disc starting point then lets us establish each successive result.",
      "attainTitle": "How many moves does the constructed method actually use?",
      "attainBase": "One disc moves directly to the target, exactly once.",
      "attainLet": "Let n be a positive integer and consider the constructed route for n + 1 discs.",
      "attainAssumption": "By the construction for n discs, its discs from largest to smallest move exactly 1, 2, 2², … times.",
      "attainStep": "Add a new largest disc underneath. Use the existing method to move the smaller tower, move the new largest disc, then use the method again to move the smaller tower.",
      "attainResult": "Therefore the n + 1 discs move exactly 1, 2, 2², …, 2ⁿ times from largest to smallest.",
      "attainGeneral": "Starting from one disc and extending the construction, for every positive integer n the n discs move exactly 1, 2, 2², …, 2⁽ⁿ⁻¹⁾ times from largest to smallest.",
      "doneTitle": "This is the minimum",
      "done": "The constructed route finishes in exactly this many moves, and fewer moves are impossible. The minimum is therefore:"
    }
  }
}
