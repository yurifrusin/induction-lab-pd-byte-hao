// Explanations follow the structure of the puzzle before introducing notation.
export const proofCopy = {
  zh: {
    visualHelp: '需要图示？展开对照', visualNote: '图中是四个碟子，展示最大碟从 A 柱移到 C 柱的前后。先借图理清位置，再想想：换了柱名或走法，哪些理由仍然成立？',
    visualCaptions: ['最大碟移动前：小塔在 B 柱，C 柱空着。', '最大碟移动后：小塔还在 B 柱。', '最后还要把小塔搬到 C 柱，叠在最大碟上。'],
    reveal: '想好后，展开解释',
    hide: '收起推理，自己讲一遍', show: '再看推理', back: '返回', next: '这些步数真的够吗？', restart: '重新体验',
    lower: {
      "eyebrow": "把刚才的推理接着用下去",
      "title": "把刚才想明白的理由连起来",
      "intro": "从移动规则想清楚小塔为什么必须搬两遍，就已经抓住了归纳推进的论证：原有每个圆盘的次数限制要用两次，再加上新最大盘的一次。这里把这段理由整理出来，并接上一个圆盘的起点。",
      "structureTitle": "回看：每个小圆盘为什么都要参加两次搬运？",
      "structure": [
        "最大盘第一次移动前，上面的小圆盘必须先完整地搬到另一根柱上。否则，最大盘还被压着，或者它要去的柱上有小圆盘。",
        "最大盘最后一次移到目标柱时，小圆盘又完整地叠在第三根柱上。要完成任务，还必须把它们搬到目标柱。从这以后最大盘不再离开目标柱，否则它还得再回来，这就不是最后一次到达了。",
        "这两段搬运一前一后，互不重叠。同一个小圆盘，在每一段里都要完成小塔搬运对它的要求。所以，它原来至少需要的移动次数，要在这里算两遍。"
      ],
      "bridgeTitle": "柱子换了，底下还有大碟子，为什么仍能用小塔的结论？",
      "bridge": "只看小碟子：每一段都从一座完整的小塔开始，到另一根柱上的完整小塔结束，每一步仍遵守原来的规则。底下的大碟子比它们都大，不会给小碟子提供新的移动方式。柱子的名字也不会改变规则。因此，每一段本身就是一次完整的小塔搬运。",
      "detoursTitle": "最大碟中途来回移动，也能这样算吗？",
      "detours": [
        "能。前一段在最大碟第一次移动之前，后一段在它最后一次到达目标柱之后。这两段没有重叠，中间最大碟至少移动了一次。多绕路也不能省掉这两段搬运。"
      ],
      "growTitle": "先想两个圆盘，再想三个",
      "start": "一个碟子要换到另一根柱上，至少得移动一步。这是我们已经确定的起点。",
      "barTitle": "用横线概括这些条件句",
      "barHelp": "每条红线表示旁边一整句“只要……那么……”。句中的次数都按圆盘从大到小排列。",
      "bars": [
        "只要一个圆盘至少要移动 1 次，那么两个圆盘就至少分别要移动 1、2 次。",
        "只要两个圆盘至少分别要移动 1、2 次，那么三个圆盘就至少分别要移动 1、2、4 次。",
        "只要三个圆盘至少分别要移动 1、2、4 次，那么四个圆盘就至少分别要移动 1、2、4、8 次。"
      ],
      "compareTitle": "把这个结论和刚才的走法对照",
      "compare": "现在已经说明：三个碟子少于七步不能完成。如果刚才也用七步完成了搬运，两件事合起来，就说明七步是最少步数。一次成功的走法和刚才这段理由，各自补上了不同的一半。",
      "compactNext": "接下来把四个圆盘的搬运过程想清楚，再用演示对照每个圆盘的移动。",
      "connect": "展开理由：逐个圆盘说明移动次数",
      "let": "设 n 是大于 1 的整数。加入一个新的最大盘之前，上面的小塔有 n − 1 个圆盘。",
      "assumption": "如果我们已经说明了小塔里每个圆盘至少要动几次，那么加入新最大盘后，前后两次搬运就能分别用上这些结论。",
      "consequence": "前后两次完整的小塔搬运中，同一个圆盘的大小排名没有变，移动规则也没有变。所以，对于每个完成 n 个圆盘搬运的走法，这个圆盘在前一段至少要动原来已经说明的次数，后一段也至少要动这么多次。",
      "counting": "同一个小圆盘：原来的次数至少要算两遍",
      "meaning": "比如，原来小塔中最大的圆盘，每段至少动一次，合起来至少两次；原来第二大的圆盘，每段至少动两次，合起来至少四次。新增的最大盘自己至少动一次。这个理由不依赖某个特定的圆盘数量。",
      "general": "设 n 是正整数。从一个圆盘至少一次开始，每加入一个最大的圆盘，就把原有每个圆盘的次数限制翻倍，并在最前面加上新盘的一次。这样接着推 n − 1 次，就得到了 n 个圆盘各自的次数限制。每一步只移动一个圆盘，把这些次数相加，就知道总共至少需要多少步：",
      "sumNote": "和式的每一项对应一个圆盘：最大盘至少动 1 次，第二大至少动 2 次，再小一个至少动 2² 次，依次继续，共有 n 项。",
      "pending": "这已经说明更少的步数不够。对于更多碟子，这些步数是否也确实够用？这是前面暂时留下的另一半，下一页接着说明。",
      "recallTitle": "试着把理由连起来讲",
      "recall": "从最大的圆盘开始，一个一个往小的说：它至少要动几次？为什么？试着让和式里的每一项都对应到一个圆盘，需要时再回看图示或解释。",
      "teacher": "从最短搬运必须完成什么开始思考。学生能解释小塔为什么必须搬两遍、同一个圆盘的次数限制为什么要用两次，就已经完成了归纳推进的关键论证。演示和计数用来对照、表达这段理由，不用来猜规律。这里再接上一个圆盘的起点，说明推理怎样继续；横线只概括完整的条件命题。",
      "barWhy": "同一个理由说明了这些条件句：原有的每个圆盘都参加两次完整的小塔搬运，各自的次数至少翻倍；新增的最大盘至少移动一次。有了一个圆盘至少一次这个起点，就能接着得到后面的结论。"
    },
    can: {
      "eyebrow": "回头补上 · 这些步数确实够用",
      "title": "凭什么说做得到？",
      "intro": "前面我们暂时搁置了一个问题：对于更多碟子，已经说明更少的步数不够，可是，用这些步数真的能完成吗？现在来补上这部分。可以借助图示，也可以在脑中回想：怎样把一套已经会用的走法接着用下去？",
      "setupTitle": "每个圆盘的这些次数，能同时做到吗？",
      "setup": "设 n 是大于 1 的整数。已经有一套搬 n − 1 个圆盘的方法，并且每个圆盘恰好用到了前面算出的次数。现在加入一个新的最大盘，试着把原来的方法用起来。",
      "questions": [
        {
          "title": "先怎样给最大盘腾出位置？",
          "answer": "用已经会的小塔走法，把小圆盘从 A 搬到 B，让 C 空出来。每个小圆盘各走一遍这套方法要求的次数，最大盘便露了出来。"
        },
        {
          "title": "最大盘自己需要动几次？",
          "answer": "把最大盘从 A 直接移到空着的 C，一次就够。接下来只搬小圆盘，最大盘留在 C。"
        },
        {
          "title": "怎样把剩下的小圆盘搬完？",
          "answer": "把 B 看作起始柱、A 看作临时柱、C 看作目标柱，再用一遍原来的方法。每个小圆盘又走了一遍相同的次数。C 底下的最大盘比它们都大，不会妨碍这些移动。"
        }
      ],
      "countTitle": "同一条走法，让每个圆盘都恰好达到次数要求",
      "count": "新加的最大盘恰好移动一次；原来的每个圆盘，前后各用一遍原来的方法，次数恰好翻倍。这些次数是在同一条完整走法中同时做到的。",
      "growTitle": "从一个圆盘开始，方法和次数一起建立",
      "start": "一个圆盘直接移到目标柱，一次就完成。以后每增加一个最大盘，都把已有方法用两遍，中间移动一次新盘。",
      "barTitle": "用横线概括“这些次数能做到”",
      "barHelp": "每条红线表示旁边完整的条件句。句中的次数按圆盘从大到小排列。",
      "bars": [
        "只要能让一个圆盘移动 1 次完成搬运，那么就能让两个圆盘分别移动 1、2 次完成搬运。",
        "只要能让两个圆盘分别移动 1、2 次完成搬运，那么就能让三个圆盘分别移动 1、2、4 次完成搬运。",
        "只要能让三个圆盘分别移动 1、2、4 次完成搬运，那么就能让四个圆盘分别移动 1、2、4、8 次完成搬运。"
      ],
      "barWhy": "这些条件句都由刚才的构造得到：已有方法前后各用一次，中间移动一次新加的最大盘。",
      "general": "设 n 是正整数。从一个圆盘的走法开始，把这个构造接着用 n − 1 次，就能让 n 个圆盘从大到小恰好分别移动 1、2、2²、……次完成搬运。把每个圆盘的次数相加，得到这条走法的总步数：",
      "doneTitle": "两部分合起来，才知道这是最少步数",
      "done": "前一页说明：更少的步数不够。这一页说明：这些步数确实够用。",
      "recallTitle": "在脑中把方法接起来",
      "recall": "换一根柱作为目标，每个圆盘的次数会变吗？解释原来的方法怎样换柱继续用，以及为什么每个小圆盘的次数恰好算两遍。",
      "teacher": "请学生说明同一条构造怎样同时达到每个圆盘的次数要求。先前逐盘排除了更少的次数，现在逐盘构造出恰好这些次数，合起来才得到最少总步数。等学生讲清楚这个从一个圆盘接着建立的方法，再将它命名为数学归纳法。"
    },
  },
  en: {
    visualHelp: 'Need a diagram? Open a reference', visualNote: 'These four-disc pictures show the largest disc moving from A to C. Use them to locate the discs, then consider which reasons still hold with different peg names or a different route.',
    visualCaptions: ['Before the largest disc moves: the smaller tower is on B and C is empty.', 'After the largest disc moves: the smaller tower is still on B.', 'The smaller tower must still reach C, on top of the largest disc.'],
    reveal: 'Explain it first, then compare', hide: 'Hide the reasoning and explain it yourself', show: 'Show the reasoning again', back: 'Back', next: 'Can these moves actually be achieved?', restart: 'Restart experience',
    lower: {
      "eyebrow": "CONTINUE THE REASONING YOU HAVE BUILT",
      "title": "Connect the reasoning you have already understood",
      "intro": "Explaining why the rules require two complete smaller-tower transfers establishes the key inductive inference: each existing disc’s bound applies twice, plus one move for the new largest disc. Here we express that reasoning and connect it to the one-disc starting point.",
      "structureTitle": "Revisit why each smaller disc participates in two transfers",
      "structure": [
        "Before the largest disc first moves, the complete smaller tower must reach another peg. Otherwise the largest disc is still covered, or the peg receiving it contains a smaller disc.",
        "At the largest disc’s final arrival on the target, the smaller discs form a complete tower on the third peg. They must still be transferred to the target. The largest disc stays there afterwards: leaving would require another arrival to finish, contradicting that this was its final arrival.",
        "These intervals do not overlap. The same smaller disc must meet its smaller-tower move requirement in each interval. Its established minimum requirement is therefore counted twice."
      ],
      "bridgeTitle": "Why does the smaller-tower result apply with different pegs and a larger disc underneath?",
      "bridge": "Look only at the smaller discs. Each interval starts and ends with a complete smaller tower on different pegs, and each move obeys the original rules. The larger disc underneath permits no new kind of smaller-disc move. Peg names also do not change the rules. Each interval is therefore itself a complete smaller-tower transfer.",
      "detoursTitle": "What if the largest disc moves back and forth?",
      "detours": [
        "The first interval is before its first move; the second is after its final arrival on the target. They do not overlap, and the largest disc moves at least once between them. Detours cannot remove these two transfers."
      ],
      "growTitle": "Start with one disc and build the reasoning",
      "start": "One disc needs at least one move to reach a different peg. This is our established starting point.",
      "barTitle": "Represent the conditional statements with lines",
      "barHelp": "Each red line represents the entire “if … then …” statement beside it. Move counts are listed from the largest disc to the smallest.",
      "bars": [
        "If one disc must move at least 1 time, then two discs must move at least 1 and 2 times respectively.",
        "If two discs must move at least 1 and 2 times respectively, then three discs must move at least 1, 2 and 4 times respectively.",
        "If three discs must move at least 1, 2 and 4 times respectively, then four discs must move at least 1, 2, 4 and 8 times respectively."
      ],
      "compareTitle": "Compare this result with the route you found",
      "compare": "We have now ruled out fewer than seven moves for three discs. If you also completed a seven-move route, the two results together establish seven as the minimum. A successful route and this reasoning supply different parts of the argument.",
      "compactNext": "Next, reason through four discs, then use the walkthrough to connect that reasoning with each disc’s moves.",
      "connect": "Open the reasoning for each disc’s move count",
      "let": "Let n be an integer greater than 1. Before adding a new largest disc, the smaller tower has n − 1 discs.",
      "assumption": "If we have established each smaller disc’s move requirement, then after adding the new largest disc we can use those results in each of the two smaller transfers.",
      "consequence": "In both complete smaller transfers, the same disc keeps its rank by size and obeys the same rules. For every complete n-disc route, it must therefore meet its established move requirement in the first interval and again in the last interval.",
      "counting": "For each smaller disc: count its requirement twice",
      "meaning": "The largest disc within the smaller tower needs at least one move per interval, giving at least two. The next needs at least two per interval, giving at least four. The new largest disc itself needs at least one. This reasoning does not depend on a particular disc count.",
      "general": "Let n be a positive integer. Start with one disc needing at least one move. Each new largest disc doubles each existing disc’s lower bound and adds a new first entry of one. Repeat this inference n − 1 times to establish the individual bounds for n discs. Since each move moves exactly one disc, adding those bounds gives the total lower bound:",
      "sumNote": "Each term belongs to a disc: the largest must move at least 1 time, the next at least 2, the next at least 2², continuing for n terms.",
      "pending": "This rules out fewer moves. For more discs, can this many moves actually be achieved? We left that other part open; the next page returns to it.",
      "recallTitle": "Explain the reasoning as a connected whole",
      "recall": "From largest to smallest, explain how many moves each disc must make and why. Match each term of the sum to a disc. Return to a diagram or explanation when useful.",
      "teacher": "Begin by reasoning about what a shortest transfer must accomplish. Explaining why the smaller tower must be transferred twice and why the same disc’s bound applies twice establishes the key inductive inference. The demonstration and counters express that reasoning; they are not a pattern-guessing task. Connect the inference to the one-disc starting point. Each line summarises a complete conditional statement.",
      "barWhy": "The same reason establishes these conditionals: each existing disc participates in two complete smaller transfers, doubling its own lower bound, while the new largest disc moves at least once. The one-disc starting point then lets us establish each successive result."
    },
    can: {
      "eyebrow": "RETURN TO THE QUESTION · ACHIEVE THE BOUND",
      "title": "Why believe it can be done?",
      "intro": "Earlier, we set aside a question: fewer moves cannot work, but can this many moves actually be achieved? We now return to it. Use the diagrams or work mentally to explain how a method we already have can be used again.",
      "setupTitle": "Can one route achieve every disc’s count together?",
      "setup": "Let n be an integer greater than 1. We have a method for n − 1 discs that achieves each disc’s established count exactly. Add a new largest disc and use that method to finish the larger tower.",
      "questions": [
        {
          "title": "How can we make room for the largest disc?",
          "answer": "Use the known smaller-tower method to transfer the smaller discs from A to B, leaving C empty. Each smaller disc makes its prescribed moves once through that method, exposing the largest disc."
        },
        {
          "title": "How often does the largest disc need to move?",
          "answer": "Move it directly from A to the empty C once. Leave it there while finishing the smaller discs."
        },
        {
          "title": "How can we finish the smaller discs?",
          "answer": "Make B the start, A the temporary peg, and C the target. Use the same method again. Each smaller disc repeats its prescribed count. The largest disc underneath them on C does not obstruct their moves."
        }
      ],
      "countTitle": "One route achieves each disc’s required count",
      "count": "The new largest disc moves exactly once. Each existing disc makes its old count once in the first transfer and once in the second, exactly doubling its own count. These counts are achieved together in the same complete route.",
      "growTitle": "Build the method and individual counts from one disc",
      "start": "One disc reaches its target in one move. For each new largest disc, use the existing method twice with one move of the new disc between them.",
      "barTitle": "Represent the achievable-count conditionals with lines",
      "barHelp": "Each red line represents the complete conditional statement beside it. Counts are listed from largest to smallest.",
      "bars": [
        "If one disc can finish in 1 move, then two discs can finish with individual counts of 1 and 2 moves.",
        "If two discs can finish with individual counts of 1 and 2 moves, then three can finish with counts of 1, 2 and 4.",
        "If three discs can finish with individual counts of 1, 2 and 4 moves, then four can finish with counts of 1, 2, 4 and 8."
      ],
      "barWhy": "Each conditional follows from the construction: use the existing method twice with one move of the new largest disc in between.",
      "general": "Let n be a positive integer. Start with the one-disc method and repeat the construction n − 1 times. The n discs then finish with individual counts of 1, 2, 2², … from largest to smallest. Adding these counts gives the route’s total:",
      "doneTitle": "Both parts together establish the minimum",
      "done": "The previous page showed that fewer moves are insufficient. This page shows that this many moves are sufficient.",
      "recallTitle": "Connect the method in your mind",
      "recall": "Would a different target peg change each disc’s count? Explain how to reassign the peg roles and why each smaller disc’s old count is used exactly twice.",
      "teacher": "Ask how a single constructed route achieves each disc’s count simultaneously. The earlier reasoning ruled out lower individual counts; the construction now attains them. Together they establish the minimum total. Name mathematical induction after students can explain the construction from one disc onwards."
    },
  },
}
