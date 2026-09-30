import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.argv[2] ?? '.')
const screensPath = path.join(root, 'src/Screens.jsx')
const translationsPath = path.join(root, 'src/zh.js')
const stylesPath = path.join(root, 'src/styles.css')

let screens = fs.readFileSync(screensPath, 'utf8').replace(/\r\n/g, '\n')
const replaceOnce = (before, after) => {
  if (!screens.includes(before)) throw new Error(`Cannot find answer control: ${before.slice(0, 70)}`)
  screens = screens.replace(before, after)
}

replaceOnce("import { t, useLanguage, LanguageSwitcher } from './Language.jsx'", "import { t, useLanguage, LanguageSwitcher } from './Language.jsx'\nimport { useState } from 'react'")
replaceOnce("  const correct = answer === 'possible'", "  const [selection, setSelection] = useState(answer)\n  const submitted = selection != null && selection === answer\n  const correct = submitted && answer === 'possible'")
replaceOnce("aria-pressed={answer === 'possible'}", "aria-pressed={selection === 'possible'}")
replaceOnce("className={answer === 'possible' ? 'is-selected is-correct' : ''}", "className={selection === 'possible' ? 'is-selected' : ''}")
replaceOnce("onClick={() => onAnswer('possible')}", "onClick={() => setSelection('possible')}")
replaceOnce("aria-pressed={answer === 'minimum'}", "aria-pressed={selection === 'minimum'}")
replaceOnce("className={answer === 'minimum' ? 'is-selected is-wrong' : ''}", "className={selection === 'minimum' ? 'is-selected' : ''}")
replaceOnce("onClick={() => onAnswer('minimum')}", "onClick={() => setSelection('minimum')}")
replaceOnce("          {answer === 'minimum' && (", "          <button className=\"answer-confirm\" disabled={!selection || submitted} onClick={() => onAnswer(selection)} type=\"button\">{t('Confirm answer')}</button>\n\n          {submitted && answer === 'minimum' && (")
replaceOnce("  const correct = answer === 'all'", "  const [selection, setSelection] = useState(answer)\n  const submitted = selection != null && selection === answer\n  const correct = submitted && answer === 'all'")
replaceOnce("answer === choice ? 'is-selected' : ''", "selection === choice ? 'is-selected' : ''")
replaceOnce("answer === 'some' && choice === 'some' ? 'is-wrong' : ''", "submitted && answer === 'some' && choice === 'some' ? 'is-wrong' : ''")
replaceOnce("checked={answer === choice}", "checked={selection === choice}")
replaceOnce("onChange={() => onAnswer(choice)}", "onChange={() => setSelection(choice)}")
replaceOnce("        {answer === 'some' && <p className=\"compact-feedback\"", "        <button className=\"answer-confirm\" disabled={!selection || submitted} onClick={() => onAnswer(selection)} type=\"button\">{t('Confirm answer')}</button>\n        {submitted && answer === 'some' && <p className=\"compact-feedback\"")
fs.writeFileSync(screensPath, screens)

let translations = fs.readFileSync(translationsPath, 'utf8')
if (!translations.includes("'Confirm answer':") && !translations.includes('"Confirm answer":')) {
  translations = translations.replace('export const zh = {', "export const zh = {\n  'Confirm answer': '确认答案',")
  fs.writeFileSync(translationsPath, translations)
}

let styles = fs.readFileSync(stylesPath, 'utf8')
if (!styles.includes('.answer-confirm {')) {
  styles += `\n.answer-confirm {\n  margin-top: 18px;\n  padding: 12px 20px;\n  border: 1px solid var(--amber);\n  border-radius: 8px;\n  background: var(--amber);\n  color: #0b1b27;\n  font: inherit;\n  font-weight: 700;\n  cursor: pointer;\n}\n.answer-confirm:disabled { opacity: .45; cursor: not-allowed; }\n`
  fs.writeFileSync(stylesPath, styles)
}
