import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const lang = await server.ssrLoadModule('/src/Language.jsx')
  const { ExistenceScreen, NoticeScreen, PlayScreen, ProveScreen } = await server.ssrLoadModule('/src/Screens.jsx')
  const { MinimumProofScreen } = await server.ssrLoadModule('/src/SequenceScreens.jsx')
  const props = {count: 3, pegs: [[3,2,1],[],[]], moveCount: 0, message: 'Select a top disc, then choose its destination.', target: 7}
  for (const locale of ['en','zh']) {
    lang.setLanguage(locale)
    const student = renderToStaticMarkup(React.createElement(PlayScreen, {...props, studentMode:true}))
    const teacher = renderToStaticMarkup(React.createElement(PlayScreen, {...props, studentMode:false}))
    assert.ok(!student.includes('play-equation'))
    assert.ok(teacher.includes('play-equation'))
    const hint = locale === 'zh' ? '提示下一步' : 'Hint for this position'
    assert.ok(!student.includes(hint))
    assert.ok(teacher.includes(hint))
  }
  lang.setLanguage('zh')
  const notice = renderToStaticMarkup(React.createElement(NoticeScreen, { answer: 'possible', count: 3, nextUnlocked: true }))
  assert.match(notice, /起点：把三个碟子从 A 柱搬到 C 柱/)
  assert.match(notice, /三个盘能搬完，是因为我们已经把走法一步步做出来了/)
  assert.match(notice, /继续加盘，也一定能搬完吗？/)
  const existence = renderToStaticMarkup(React.createElement(ExistenceScreen))
  assert.match(existence, /只要两个碟子有走法，三个碟子就有走法/)
  assert.match(existence, /只要三个碟子有走法，四个碟子就有走法/)
  assert.match(existence, /对于每个正整数 n/)
  const shortest = renderToStaticMarkup(React.createElement(ProveScreen))
  assert.doesNotMatch(shortest, /existence-proof/)
  assert.match(shortest, /三个盘能搬完，是因为我们已经把走法一步步做出来了/)
  assert.match(shortest, /三个圆盘/)
  assert.match(renderToStaticMarkup(React.createElement(MinimumProofScreen)), /这套走法恰好用这些步数完成/)
  assert.equal(lang.t('Yuri'), 'Yuri')
  assert.equal(lang.t('possible'), 'possible')
  assert.equal(lang.localizedUrl('join','RGGTVQ',true,'https://example.com/lab/'), 'https://example.com/lab/?join=RGGTVQ&lang=zh')
  assert.equal(lang.localizedUrl('teacher','',false,'https://example.com/lab/'), 'https://example.com/lab/?teacher=1')
  console.log('Localization checks passed: student-only hiding, both languages, proof transition, identifiers, join URLs and canonical auth redirect.')
} finally { await server.close() }
