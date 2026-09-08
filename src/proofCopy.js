// Explanations follow the structure of the puzzle before introducing notation.
export const proofCopy = {
  zh: {
    visualHelp: '需要图示？展开对照', visualNote: '图中是四个碟子，展示最大碟从 A 柱移到 C 柱的前后。先借图理清位置，再想想：换了柱名或走法，哪些理由仍然成立？',
    visualCaptions: ['最大碟移动前：小塔在 B 柱，C 柱空着。', '最大碟移动后：小塔还在 B 柱。', '最后还要把小塔搬到 C 柱，叠在最大碟上。'],
    reveal: '想好后，展开解释',
    hide: '收起推理，自己讲一遍', show: '再看推理', back: '返回', next: '这些步数真的够吗？', restart: '重新体验',
    lower: {
      "eyebrow": "把刚才的推理接着用下去",
      "title": "为什么碟子再多，理由也一样？",
      "intro": "第三页里，我们已经从一个碟子出发，逐层说明两个、三个碟子为什么不能更少。四碟演示又让我们看到了同样的搬运。现在把这段理由说完整：它为什么不受碟子数量的限制？",
      "structureTitle": "需要时，回看前后两次搬运的理由",
      "structure": [
        "最大碟第一次移动前，上面的小碟子必须全部移开，它要去的那根柱也必须空着。因此，小碟子必须先从起始柱完整地搬到剩下的那根柱上。",
        "再看最大碟最后一次移到目标柱的那一步。它上面没有小碟子，目标柱也是空的，所以小碟子此刻又完整地叠在第三根柱上。要完成任务，还得把这座小塔搬到目标柱。",
        "前一次搬小塔、最大碟自己的移动、后一次搬小塔，是不同的步骤。所以，小塔至少需要的步数要算两遍，再加上最大碟至少移动的一步。"
      ],
      "bridgeTitle": "柱子换了，底下还有大碟子，为什么仍能用小塔的结论？",
      "bridge": "只看小碟子：每一段都从一座完整的小塔开始，到另一根柱上的完整小塔结束，每一步仍遵守原来的规则。底下的大碟子比它们都大，不会给小碟子提供新的移动方式。柱子的名字也不会改变规则。因此，每一段本身就是一次完整的小塔搬运。",
      "detoursTitle": "最大碟中途来回移动，也能这样算吗？",
      "detours": [
        "能。前一段在最大碟第一次移动之前，后一段在它最后一次到达目标柱之后。这两段没有重叠，中间最大碟至少移动了一次。多绕路也不能省掉这两段搬运。"
      ],
      "growTitle": "从一个碟子开始，一层层说明",
      "start": "一个碟子要换到另一根柱上，至少得移动一步。这是我们已经确定的起点。",
      "barTitle": "先自己接着想，再展开核对",
      "barHelp": "每条横线表示一整段推理：前一层已经说明的结论，怎样帮助我们说明下一层。它不是在表示碟子的移动。",
      "barLabels": [
        "从一个碟子推到两个",
        "从两个碟子推到三个"
      ],
      "barPrompts": [
        "最大碟移动前后，那个小碟子至少各要移动几步？",
        "前后两次搬的都是两个小碟子。刚才对两个碟子的结论，在哪里用得上？"
      ],
      "bars": [
        "前面要把小碟子移开，至少一步；最后要把它移到目标柱，又至少一步；大碟子自己至少移动一步。因此，两个碟子至少需要 1 + 2 步。这里的 2，是把“一个碟子至少一步”用了两次。",
        "刚才已经说明，完整地搬两个碟子至少需要 1 + 2 步。三个碟子的任务中，前后各要完整地搬一次上面那两个碟子，所以这个结论用了两次；最大碟还至少要动一步。因此，至少需要 1 + 2(1 + 2) = 1 + 2 + 2² 步，也就是七步。七步是这样推出来的。"
      ],
      "compareTitle": "把这个结论和刚才的走法对照",
      "compare": "现在已经说明：三个碟子少于七步不能完成。如果刚才也用七步完成了搬运，两件事合起来，就说明七步是最少步数。一次成功的走法和刚才这段理由，各自补上了不同的一半。",
      "compactNext": "接下来观察四个碟子：刚才用过的理由，还能在哪里用上？",
      "connect": "展开推理：从小塔的结论，推到整座塔",
      "let": "设 n 是大于 1 的整数，表示碟子数量。上面的小塔有 n − 1 个碟子。",
      "assumption": "如果已经说明：对于每个把 n − 1 个碟子从一根柱移到另一根柱的完整走法，至少需要 a 步；",
      "consequence": "那么，前后两次完整的小塔搬运各需至少 a 步，最大碟还至少移动一步。因此，对于每个完成 n 个碟子搬运的走法，至少需要：",
      "counting": "1 + 2a 步",
      "meaning": "这个推断只用了移动规则，没有用到某个特定的碟子数量。因此，每增加一个碟子，都能继续使用同一段理由。",
      "general": "设 n 是正整数。一个碟子至少一步；从这个起点出发，把同一段推理接着用 n − 1 次，就说明 n 个碟子至少需要下面这些步数。每次把前一层的步数限制算两遍，再加一步，和式便多长出一项。",
      "sumNote": "这个和有 n 项：从 1 开始，之后每项是前一项的两倍。一个碟子对应的和就是 1。",
      "pending": "这已经说明更少的步数不够。对于更多碟子，这些步数是否也确实够用？这是前面暂时留下的另一半，下一页接着说明。",
      "recallTitle": "试着把理由连起来讲",
      "recall": "从一个碟子的一步出发，不看步数表，说明每多一个碟子，为什么能接着推出新的步数限制。需要时可以回看图示或展开解释。",
      "teacher": "这里承接第三页已经完成的逐层推理，不再把七步当作新给的前提。请学生先用自己的话解释同一个理由为什么能接着用，再展开字母表达。听他们能否说明两次完整的小塔搬运、起点的一步，以及理由为什么不依赖碟子数量。横线表示整个推断；学生可借图解释，有把握后再收起图。"
    },
    can: {
      eyebrow: '回头补上 · 这些步数确实够用', title: '凭什么说做得到？',
      intro: '前面我们暂时搁置了一个问题：对于更多碟子，已经说明更少的步数不够，可是，用这些步数真的能完成吗？现在来补上这部分。可以借助图示，也可以在脑中回想：怎样把一套已经会用的走法接着用下去？',
      setupTitle: '已经会搬小塔，怎样接着搬大塔？',
      setup: '设 n 是大于 1 的整数。假设已经有一套搬 n − 1 个碟子的走法，设 a 是这套走法的步数。三根柱的名字不影响移动规则；换一下起始柱、临时柱和目标柱的角色，这套方法仍能用，步数也不变。',
      questions: [
        { title: '先怎样把最大碟露出来？', answer: '把已经会用的小塔走法用于 A 柱到 B 柱，C 柱作临时柱。a 步以后，小碟子全部到了 B 柱，最大碟露了出来，C 柱也空了。' },
        { title: '接下来，最大碟能去哪里？', answer: '把最大碟从 A 柱移到 C 柱，只需一步。C 柱原来是空的，这一步符合规则。' },
        { title: '最后为什么还能用同一套方法？', answer: '现在搬的是 B 柱上的同一座小塔。把 B 柱看作起始柱、A 柱看作临时柱、C 柱看作目标柱，再用一次那套走法，仍需 a 步。C 柱底下虽然有最大碟，但它比每个小碟子都大，不会妨碍小碟子的移动。' },
      ],
      countTitle: '这一次，我们真正拼出了一条走法',
      count: '前一次搬小塔用 a 步，移动最大碟用一步，再搬小塔用 a 步。每一步都能照着完成，总共就是 1 + 2a 步。',
      growTitle: '从一步开始，方法和步数一起长出来',
      start: '一个碟子直接移到目标柱，一步就能完成。每增加一个碟子，把前一套方法用两次，中间加上移动最大碟的那一步。',
      barTitle: '同样用横线表示“为什么能接着做”',
      barHelp: '每条横线代表一次完整的推断。点开看看：已有的方法，怎样变成多一个碟子的方法？',
      barLabels: ['从一个碟子构造两个', '从两个碟子构造三个', '从三个碟子构造四个'],
      bars: ['只要能用 1 步搬好一个碟子，把这个方法用两次，中间移动一次最大碟，就能用 1 + 2 步搬好两个碟子。', '只要能用 1 + 2 步搬好两个碟子，把这套方法用两次，中间移动一次最大碟，就能用 1 + 2 + 2² 步搬好三个碟子。', '只要能用 1 + 2 + 2² 步搬好三个碟子，同样的构造就能用 1 + 2 + 2² + 2³ 步搬好四个碟子。'],
      barWhy: '每条横线背后都有同一个可执行的构造：先用小塔方法，再移动最大碟，再用一次小塔方法。',
      general: '设 n 是正整数。从一个碟子的走法开始，重复这个构造 n − 1 次，就得到了 n 个碟子的完整走法。因此，对于每个正整数 n，都确实能用这个 n 项和所表示的步数完成。',
      doneTitle: '两部分合起来，才知道这是最少步数',
      done: '前一页说明：更少的步数不够。这一页说明：这些步数确实够用。',
      recallTitle: '在脑中把方法接起来',
      recall: '把目标改成 B 柱，你还会搬吗？试着说明三根柱的角色怎样换，需要时可以看图。再说清楚：我们先假设会搬的是几个碟子？这个方法用了两次以后，为什么就能多搬一个？',
      teacher: '请学生先口头构造，再对照说明。重点听他们是否能解释柱子角色的变化、底下的最大碟为什么不妨碍小碟，以及方法为什么能从一个碟子逐层建立。这段推理本身就是归纳证明的核心；等学生讲清楚以后，再命名为“数学归纳法”。',
    },
  },
  en: {
    visualHelp: 'Need a diagram? Open a reference', visualNote: 'These four-disc pictures show the largest disc moving from A to C. Use them to locate the discs, then consider which reasons still hold with different peg names or a different route.',
    visualCaptions: ['Before the largest disc moves: the smaller tower is on B and C is empty.', 'After the largest disc moves: the smaller tower is still on B.', 'The smaller tower must still reach C, on top of the largest disc.'],
    reveal: 'Explain it first, then compare', hide: 'Hide the reasoning and explain it yourself', show: 'Show the reasoning again', back: 'Back', next: 'Can these moves actually be achieved?', restart: 'Restart experience',
    lower: {
      "eyebrow": "CONTINUE THE REASONING YOU HAVE BUILT",
      "title": "Why does the reason still work with more discs?",
      "intro": "On SHORTEST?, we started with one disc and established the bounds for two and three. The four-disc walkthrough showed the same transfers again. Now explain why this reasoning does not depend on the number of discs.",
      "structureTitle": "Revisit why the two smaller transfers are necessary",
      "structure": [
        "Before the largest disc first moves, every smaller disc must be removed from it, and the peg it moves to must be empty. The smaller discs must therefore first be transferred as a complete tower from the starting peg to the remaining peg.",
        "Consider the largest disc’s final arrival on the target. No smaller disc is on it, and the target is empty, so the smaller discs form a complete tower on the third peg. That tower must still be transferred to the target to finish.",
        "The first smaller transfer, the largest disc’s own moves, and the final smaller transfer are separate contributions. Count the smaller tower’s lower bound twice, plus at least one move of the largest disc."
      ],
      "bridgeTitle": "Why does the smaller-tower result apply with different pegs and a larger disc underneath?",
      "bridge": "Look only at the smaller discs. Each interval starts and ends with a complete smaller tower on different pegs, and each move obeys the original rules. The larger disc underneath permits no new kind of smaller-disc move. Peg names also do not change the rules. Each interval is therefore itself a complete smaller-tower transfer.",
      "detoursTitle": "What if the largest disc moves back and forth?",
      "detours": [
        "The first interval is before its first move; the second is after its final arrival on the target. They do not overlap, and the largest disc moves at least once between them. Detours cannot remove these two transfers."
      ],
      "growTitle": "Start with one disc and build the reasoning",
      "start": "One disc needs at least one move to reach a different peg. This is our established starting point.",
      "barTitle": "Reason it through, then open each line to compare",
      "barHelp": "Each line represents a complete inference: how an established result supports the next case. It does not represent a disc movement.",
      "barLabels": [
        "From one disc to two",
        "From two discs to three"
      ],
      "barPrompts": [
        "Before and after the largest disc moves, how many moves must the single smaller disc make?",
        "Each of the two smaller transfers involves two discs. Where can you use the result you just established for two discs?"
      ],
      "bars": [
        "The smaller disc must first move out of the way, costing at least one move. It must later reach the target, costing at least another. The larger disc also moves at least once. Two discs therefore need at least 1 + 2 moves: the one-disc bound is used twice.",
        "We have established that a complete two-disc transfer needs at least 1 + 2 moves. The three-disc task contains two complete transfers of those two smaller discs, so that result applies twice. Add at least one largest-disc move: at least 1 + 2(1 + 2) = 1 + 2 + 2² moves, which is seven. This is how the seven-move bound is derived."
      ],
      "compareTitle": "Compare this result with the route you found",
      "compare": "We have now ruled out fewer than seven moves for three discs. If you also completed a seven-move route, the two results together establish seven as the minimum. A successful route and this reasoning supply different parts of the argument.",
      "compactNext": "Next, watch four discs. Where does the reasoning you just used apply again?",
      "connect": "Open the inference: from the smaller tower to the whole tower",
      "let": "Let n be an integer greater than 1, representing the disc count. The smaller tower has n − 1 discs.",
      "assumption": "If we have established that for every complete transfer of n − 1 discs between distinct pegs, at least a moves are needed,",
      "consequence": "then each of the two complete smaller transfers needs at least a moves, and the largest disc needs at least one. Thus, for every complete n-disc transfer, at least this many moves are needed:",
      "counting": "1 + 2a moves",
      "meaning": "This inference uses the movement rules, not a particular disc count. The same reasoning can therefore be used again for each additional disc.",
      "general": "Let n be a positive integer. One disc needs at least one move. Starting there and applying this reasoning n − 1 times establishes the following lower bound for n discs. Each application counts the previous bound twice and adds one, producing another term in the sum.",
      "sumNote": "There are n terms, starting at 1 and doubling each time. For one disc, the sum is 1.",
      "pending": "This rules out fewer moves. For more discs, can this many moves actually be achieved? We left that other part open; the next page returns to it.",
      "recallTitle": "Explain the reasoning as a connected whole",
      "recall": "Start with the one-disc bound. Without a table of move counts, explain why each extra disc gives a new lower bound. Return to the diagrams or explanations when helpful.",
      "teacher": "Continue the reasoning students established on SHORTEST?; do not reintroduce seven as a supplied premise. Ask for an explanation of why the same reason continues before opening the notation. Listen for two complete smaller transfers, the one-disc starting point, and a reason independent of disc count. Each line represents the whole inference. Diagrams remain optional support."
    },
    can: {
      eyebrow: 'RETURN TO THE QUESTION · ACHIEVE THE BOUND', title: 'Why believe it can be done?',
      intro: 'Earlier, we set aside a question: fewer moves cannot work, but can this many moves actually be achieved? We now return to it. Use the diagrams or work mentally to explain how a method we already have can be used again.',
      setupTitle: 'How does knowing a smaller-tower method help?',
      setup: 'Let n be an integer greater than 1. Suppose we have a method for transferring n − 1 discs, and let a be its move count. Peg names do not affect the rules. Reassigning the start, temporary and target roles gives the same method with the same move count.',
      questions: [
        { title: 'How can we expose the largest disc?', answer: 'Apply the smaller-tower method from A to B, using C as the temporary peg. After a moves, every smaller disc is on B. The largest disc is exposed and C is empty.' },
        { title: 'Where can the largest disc go next?', answer: 'Move it directly from A to C in one move. C was empty, so this move is legal.' },
        { title: 'Why does the same method still work at the end?', answer: 'The same smaller tower is now on B. Make B the start, A the temporary peg, and C the target. Apply the method again in a moves. The largest disc on C is larger than each smaller disc, so it does not obstruct any move of the smaller tower.' },
      ],
      countTitle: 'We have now assembled an actual route', count: 'The first smaller transfer uses a moves, the largest disc uses one, and the second smaller transfer uses a moves. Each move can be carried out: the total is 1 + 2a.',
      growTitle: 'The method and the sum grow together', start: 'One disc can reach its target directly in one move. For each extra disc, use the previous method twice, with one largest-disc move between the two uses.',
      barTitle: 'Use a line to represent why the construction continues', barHelp: 'Each line represents a complete inference. Open it to see how an existing method produces a method for one more disc.',
      barLabels: ['Construct two discs from one', 'Construct three discs from two', 'Construct four discs from three'],
      bars: ['If one disc can be transferred in 1 move, using that method twice around one largest-disc move gives a two-disc route using 1 + 2 moves.', 'If two discs can be transferred in 1 + 2 moves, using that method twice around one largest-disc move gives a three-disc route using 1 + 2 + 2² moves.', 'If three discs can be transferred in 1 + 2 + 2² moves, the same construction gives a four-disc route using 1 + 2 + 2² + 2³ moves.'],
      barWhy: 'Each conditional is supported by the same executable construction: use the smaller method, move the largest disc, and use the smaller method again.',
      general: 'Let n be a positive integer. Starting with the one-disc method and repeating this construction n − 1 times produces a complete n-disc route. So for every positive integer n, the move count represented by this n-term sum is achievable.',
      doneTitle: 'Both parts together establish the minimum', done: 'The previous page showed that fewer moves are insufficient. This page shows that this many moves are sufficient.',
      recallTitle: 'Connect the method in your mind',
      recall: 'Could you finish on B instead? Explain how the peg roles change, using the diagrams if helpful. How many discs did we suppose we could already transfer? Why does using that method twice let us transfer one more?',
      teacher: 'Ask students to construct the route aloud before comparing explanations. Listen for peg-role changes, why the largest disc does not obstruct smaller moves, and how the method can be built from one disc onwards. This reasoning is the core of the induction proof. Name mathematical induction after students can explain it.',
    },
  },
}
