// Explanations connect a constructed route with individual move bounds.
export const proofCopy = {
  "zh": {
    "visualHelp": "需要图示？展开对照",
    "visualNote": "图中以六个圆盘为例，展示最大盘从 A 柱移到 C 柱的前后。上面五个盘的具体移动步骤没有画出。",
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
      "let": "设 n 是大于 1 的整数。加入一个新的最大盘之前，上面的小塔有 n − 1 个圆盘。",
      "assumption": "如果我们已经说明了小塔里每个圆盘至少要动几次，那么加入新最大盘后，前后两次搬运就能分别用上这些结论。",
      "consequence": "前后两次完整的小塔搬运中，同一个圆盘的大小排名没有变，移动规则也没有变。所以，对于每个完成 n 个圆盘搬运的走法，这个圆盘在前一段至少要动原来已经说明的次数，后一段也至少要动这么多次。",
      "counting": "同一个小圆盘：原来的次数至少要算两遍",
      "meaning": "比如，原来小塔中最大的圆盘，每段至少动一次，合起来至少两次；原来第二大的圆盘，每段至少动两次，合起来至少四次。新增的最大盘自己至少动一次。这个理由不依赖某个特定的圆盘数量。",
      "general": "设 n 是正整数。从一个圆盘至少一次开始，每加入一个最大的圆盘，就把原有每个圆盘的次数限制翻倍，并在最前面加上新盘的一次。这样接着推 n − 1 次，就得到了 n 个圆盘各自的次数限制。每一步只移动一个圆盘，把这些次数相加，就知道总共至少需要多少步：",
      "sumNote": "和式的每一项对应一个圆盘：最大盘至少动 1 次，第二大至少动 2 次，再小一个至少动 2² 次，依次继续，共有 n 项。",
      "recallTitle": "把最短步数的理由讲完整",
      "recall": "先说明这套走法让每个盘动了几次，再说明这些次数为什么不能更少。让和式里的每一项都对应到一个盘。需要时可以回看解释。",
      "teacher": "第三页已经完整证明了有解。这里把逐盘计数与移动规则联系起来：同一个盘的次数为什么要在小塔搬运中用两次？学生应同时说明构造达到这些次数，以及别的走法不能少于这些次数。两处都接上一个盘的起点，体现同一种归纳结构。",
      "barWhy": "同一个理由说明了这些条件句：原有的每个圆盘都参加两次完整的小塔搬运，各自的次数至少翻倍；新增的最大盘至少移动一次。有了一个圆盘至少一次这个起点，就能接着得到后面的结论。",
      "attainTitle": "这套已构造的走法，恰好用多少步？",
      "attain": [
        "一个盘直接移到目标柱，恰好移动一次。每加一个最大盘，就把已有的方法前后各用一次，中间移动新最大盘一次。",
        "因此，新最大盘恰好动一次；原来的每个盘，移动次数都恰好翻倍。方法已经构造出来，这些次数会在同一条完整走法中一起达到。",
        "对于每个正整数 n，从一个盘接着构造 n − 1 次，n 个盘从大到小便恰好分别移动 1、2、2²、……次。把这些次数相加，正好达到刚才说明的步数。"
      ],
      "doneTitle": "这就是最少步数",
      "done": "这套走法恰好用这些步数完成，而更少的步数不够。因此，最少步数是："
    }
  },
  "en": {
    "visualHelp": "Need a diagram? Open a reference",
    "visualNote": "These six-disc pictures show the positions before and after the largest disc moves from A to C. The individual moves used to transfer the five smaller discs are not shown.",
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
      "let": "Let n be an integer greater than 1. Before adding a new largest disc, the smaller tower has n − 1 discs.",
      "assumption": "If we have established each smaller disc’s move requirement, then after adding the new largest disc we can use those results in each of the two smaller transfers.",
      "consequence": "In both complete smaller transfers, the same disc keeps its rank by size and obeys the same rules. For every complete n-disc route, it must therefore meet its established move requirement in the first interval and again in the last interval.",
      "counting": "For each smaller disc: count its requirement twice",
      "meaning": "The largest disc within the smaller tower needs at least one move per interval, giving at least two. The next needs at least two per interval, giving at least four. The new largest disc itself needs at least one. This reasoning does not depend on a particular disc count.",
      "general": "Let n be a positive integer. Start with one disc needing at least one move. Each new largest disc doubles each existing disc’s lower bound and adds a new first entry of one. Repeat this inference n − 1 times to establish the individual bounds for n discs. Since each move moves exactly one disc, adding those bounds gives the total lower bound:",
      "sumNote": "Each term belongs to a disc: the largest must move at least 1 time, the next at least 2, the next at least 2², continuing for n terms.",
      "recallTitle": "Explain why the route is shortest",
      "recall": "Explain how often this method moves each disc, then why fewer moves cannot work. Match each term of the sum to a disc. Reopen the explanations when useful.",
      "teacher": "The third page has established existence. Connect individual counts to the movement rules: why does the same disc’s count apply twice in the smaller transfers? Students should explain both that the construction achieves these counts and that other routes cannot use fewer. Connect both arguments to one disc to expose their shared inductive structure.",
      "barWhy": "The same reason establishes these conditionals: each existing disc participates in two complete smaller transfers, doubling its own lower bound, while the new largest disc moves at least once. The one-disc starting point then lets us establish each successive result.",
      "attainTitle": "How many moves does the constructed method actually use?",
      "attain": [
        "One disc moves directly to the target, exactly once. Each new largest disc uses the existing method twice, with one move of the new disc between them.",
        "The new largest disc therefore moves exactly once, while each existing disc’s count exactly doubles. The method has already been constructed, so these counts are achieved together in one complete route.",
        "For every positive integer n, starting with one disc and extending the construction n − 1 times gives individual counts of 1, 2, 2², … from largest to smallest. Their sum meets the bound just established."
      ],
      "doneTitle": "This is the minimum",
      "done": "The constructed route finishes in exactly this many moves, and fewer moves are impossible. The minimum is therefore:"
    }
  }
}
