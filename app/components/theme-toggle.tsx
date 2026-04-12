'use client'

import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const resolved = mode === 'system' ? getSystemTheme() : mode
  root.classList.toggle('theme-dark', resolved === 'dark')
  root.classList.toggle('theme-light', resolved === 'light')
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const initial: ThemeMode =
      stored === 'dark' || stored === 'light' || stored === 'system'
        ? stored
        : 'system'

    applyTheme(initial)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      if (initial === 'system' || localStorage.getItem(STORAGE_KEY) === 'system') {
        applyTheme('system')
      }
    }

    media.addEventListener('change', onSystemChange)
    setMode(initial)

    return () => media.removeEventListener('change', onSystemChange)
  }, [])

  const setThemeMode = (nextMode: ThemeMode) => {
    applyTheme(nextMode)
    localStorage.setItem(STORAGE_KEY, nextMode)
    setMode(nextMode)
  }

  return (
    <div
      role="group"
      aria-label="Theme preference"
      className="theme-switch-shell control-border rounded-xl border p-1"
    >
      {(['light', 'dark', 'system'] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-label={`Use ${option} theme`}
          onClick={() => setThemeMode(option)}
          className={`theme-switch-option ${mode === option ? 'theme-switch-option-active' : ''}`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
