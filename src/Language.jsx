import { useSyncExternalStore } from 'react'
import { zh, patterns } from './zh.js'

const listeners = new Set()
const storageKey = 'induction-language'
function initialLanguage() {
  if (typeof window === 'undefined') return 'en'
  const specified = new URLSearchParams(window.location.search).get('lang')
  if (specified === 'zh' || specified === 'en') return specified
  try { return window.localStorage.getItem(storageKey) === 'zh' ? 'zh' : 'en' } catch { return 'en' }
}
let language = initialLanguage()
export const getLanguage = () => language
const subscribe = (listener) => { listeners.add(listener); return () => listeners.delete(listener) }
export const useLanguage = () => useSyncExternalStore(subscribe, getLanguage, getLanguage)

export function translate(value, locale = language) {
  if (locale !== 'zh' || typeof value !== 'string') return value
  const key = value.trim().replace(/\s+/g, ' ')
  const translated = zh[key]
  if (translated !== undefined) return translated
  for (const [pattern, replace] of patterns) {
    if (pattern.test(key)) return key.replace(pattern, replace)
  }
  return value
}
export const t = translate

function updateDocument() {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  document.title = language === 'zh' ? '数学归纳实验室' : 'Induction Lab'
}
export function setLanguage(next, updateUrl = true) {
  language = next === 'zh' ? 'zh' : 'en'
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(storageKey, language) } catch { /* Language still works without storage. */ }
    if (updateUrl) {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', language)
      window.history.replaceState(window.history.state, '', url)
    }
  }
  updateDocument()
  listeners.forEach((listener) => listener())
}
if (typeof window !== 'undefined') {
  setLanguage(language, false)
  window.addEventListener('popstate', () => setLanguage(initialLanguage(), false))
}

export function localizedUrl(mode, code = '', includeLanguage = true, base = typeof window === 'undefined' ? 'http://localhost/' : window.location.href) {
  const url = new URL(base)
  url.search = ''
  url.hash = ''
  if (mode === 'teacher') url.searchParams.set('teacher', '1')
  if (mode === 'join') url.searchParams.set('join', code)
  if (mode === 'chooser') url.searchParams.set('classroom', '1')
  if (includeLanguage) url.searchParams.set('lang', language)
  return url.href
}

export function LanguageSwitcher() {
  const locale = useLanguage()
  return <button type="button" className="language-switch" lang={locale === 'zh' ? 'en' : 'zh-CN'} aria-label={locale === 'zh' ? 'Switch to English' : '切换为中文'} onClick={() => setLanguage(locale === 'zh' ? 'en' : 'zh')}>{locale === 'zh' ? 'English' : '中文'}</button>
}
