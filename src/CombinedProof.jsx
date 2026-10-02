import { useLanguage } from './Language.jsx'
import { ArrowIcon, ResetIcon } from './icons.jsx'
import { proofCopy } from './proofCopy.js'

const copy = {
  zh: {
    eyebrow: '附录 2 · 逐盘证明最少步数',
    title: '搬完整座塔，最少需要多少步？',
    intro: '相比“说明理由”页，这里直接用“最少步数”来表述，更简洁。（相当于把“为什么不能更少”和“怎样恰好做到”合在一起证明。）',
    proof: '证明', assume: '假设：',
    assumption: '搬完 n 个盘时，从大到小，每个盘最少分别需要移动 [[counts]] 次，而且有一条走法能同时做到这些次数。',
    double: '同一座 n 盘小塔前后各搬一次，因此每个小盘不能省掉的移动次数都翻倍。最大盘本身也必须移动一次。',
    construct: '这些次数也确实做得到：用假设中的走法把小塔从 A 搬到 B，把最大盘从 A 移到 C，再用同一套走法把小塔从 B 搬到 C。每个小盘的移动次数恰好翻倍，最大盘恰好移动一次。',
    roles: '为什么两次都能使用假设中的走法？',
    rolesText: '三根柱子之间都可以移动圆盘，只需遵守移动规则。第二次搬小塔时，B 是起始柱，A 是临时柱，C 是目标柱；柱子换名字不会改变走法，C 底下的最大盘也不会妨碍小盘移动。',
    thus: '这样，',
    result: '搬完 n+1 个盘时，从大到小，每个盘最少分别需要移动 [[nextCounts]] 次，而且这条走法同时做到了这些次数。所以，它的总步数已经最少。',
    so: '所以，',
    implication: '对于这个 n，如果 n 个盘有一条走法，使每个盘都用最少的 [[counts]] 次移动完成任务，那么 n+1 个盘也有一条走法，使每个盘都用最少的 [[nextCounts]] 次移动完成任务。',
    base: '只有一个盘时，直接移到另一根柱上只需一步，也不可能更少。',
    conclusion: '因此，由数学归纳法，对于每个正整数 n，从大到小，每个盘最少分别需要移动 [[counts]] 次，并且有一条走法同时做到。总步数最少是：',
    name: '把这个最少步数记作 Tₙ。一个盘最少移动一次；多一个盘，就用最省步数的走法前后各搬一次小塔，再移动最大盘一次。这个搬运结构说明：',
    sum: '刚才按每个盘分别计数的证明，也说明了这个数列的通项为什么是下面的和式：',
    back: '返回附录 1', restart: '重新体验', end: '证明完毕',
  },
  en: {
    eyebrow: 'APPENDIX 2 · THE MINIMUM, DISC BY DISC',
    title: 'What is the minimum number of moves for the whole tower?',
    intro: 'Compared with the PROVE page, this is a more concise formulation using “the minimum number of moves” directly. (Combine why fewer moves cannot work and how this minimum can be achieved in one proof.)',
    proof: 'Proof', assume: 'Assume:',
    assumption: 'For n discs, the minimum move counts from largest to smallest are [[counts]], and a route achieves all these counts together.',
    double: 'The n-disc tower is transferred once before and once after, so each smaller disc’s unavoidable count doubles. The largest disc must also move once.',
    construct: 'These counts can be achieved: use the assumed route to transfer the smaller tower from A to B, move the largest disc from A to C, and use the same method to transfer the smaller tower from B to C. Each smaller disc moves exactly twice as often, and the largest disc moves exactly once.',
    roles: 'Why can both transfers use the assumed route?',
    rolesText: 'Discs can move between all three pegs, subject to the rules. In the second transfer, B is the start, A is the spare peg and C is the target. Renaming the pegs does not change the route, and the largest disc underneath on C does not obstruct smaller-disc moves.',
    thus: 'Thus, ',
    result: 'for n + 1 discs, the minimum move counts from largest to smallest are [[nextCounts]], and this route achieves them together. Its total move count is therefore minimal.',
    so: 'So, ',
    implication: 'for this n, if a route for n discs achieves the minimum counts [[counts]] together, then a route for n + 1 discs achieves the minimum counts [[nextCounts]] together.',
    base: 'With one disc, a direct transfer takes one move, and fewer moves cannot work.',
    conclusion: 'Therefore, by mathematical induction, for every positive integer n, the minimum counts from largest disc to smallest are [[counts]], and a route achieves them together. The minimum total is:',
    name: 'Call this minimum Tₙ. One disc needs one move. Adding a disc requires two shortest smaller-tower transfers and one move of the largest disc. This structure gives:',
    sum: 'Counting each disc separately also explains why the general term of this sequence is the following sum:',
    back: 'Back to Appendix 1', restart: 'Restart experience', end: 'End of proof',
  },
}

function Counts({ next = false }) {
  return <strong>{next ? '1, 2 × 1, 2 × 2, 2 × ' : '1, 2, '}2<sup>2</sup>, …, {next ? '2 × ' : ''}<span style={{ whiteSpace: 'nowrap' }}>2<sup>n − 1</sup></span></strong>
}
function Text({ value }) {
  return value.split(/(\[\[(?:counts|nextCounts)\]\])/).map((part, i) => part === '[[counts]]' || part === '[[nextCounts]]' ? <Counts key={i} next={part === '[[nextCounts]]'} /> : part)
}
function Sum() {
  return <span>1 + 2 + ··· + <span style={{ whiteSpace: 'nowrap' }}>2<sup>n − 1</sup></span></span>
}
export function CombinedProofScreen({ onBack, onRestart }) {
  const locale = useLanguage()
  const c = copy[locale]
  const lower = proofCopy[locale].lower
  return <section className="sequence-screen sequence-proof-screen reasoning-page reasoning-appendix">
    <header className="sequence-heading"><span className="sequence-eyebrow">{c.eyebrow}</span><h1>{c.title}</h1><p>{c.intro}</p></header>
    <h2 className="appendix-proof-label">{c.proof}</h2>
    <div className="reasoning-fitch-outer">
      <h2>{lower.let}</h2>
      <div className="reasoning-fitch-inner">
        <p><strong className="reasoning-fitch-assume">{c.assume}</strong> <Text value={c.assumption} /></p>
        {lower.lowerSteps.slice(0, 2).map(step => <p key={step}>{step}</p>)}
        <p>{c.double}</p>
        <details><summary>{lower.bridgeTitle}</summary><p>{lower.bridge}</p></details>
        <p>{c.construct}</p>
        <details><summary>{c.roles}</summary><p>{c.rolesText}</p></details>
        <p><strong className="reasoning-fitch-assume">{c.thus}</strong><Text value={c.result} /></p>
      </div>
      <p className="reasoning-fitch-result"><strong className="reasoning-fitch-assume">{c.so}</strong><Text value={c.implication} /></p>
    </div>
    <p>{c.base}</p>
    <p className="appendix-conclusion"><Text value={c.conclusion} /></p>
    <div className="sequence-sum"><Sum /><span className="appendix-qed" aria-label={c.end}>□</span></div>
    <p>{c.name}</p>
    <div className="sequence-sum"><span>T<sub>1</sub> = 1, <span style={{ whiteSpace: 'nowrap' }}>T<sub>n + 1</sub> = 2T<sub>n</sub> + 1</span></span></div>
    <p>{c.sum}</p>
    <div className="sequence-sum"><span>T<sub>n</sub> = <Sum /></span></div>
    <footer className="sequence-footer"><button className="sequence-button" type="button" onClick={onBack}><ArrowIcon direction="left" />{c.back}</button><button className="sequence-button is-primary" type="button" onClick={onRestart}>{c.restart}<ResetIcon /></button></footer>
  </section>
}
