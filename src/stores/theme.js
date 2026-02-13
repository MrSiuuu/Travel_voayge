import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'timetravel-theme'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)

  function setDark(value) {
    isDark.value = !!value
    apply()
    try {
      localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
    } catch (_) {}
  }

  function toggle() {
    setDark(!isDark.value)
  }

  function apply() {
    if (typeof document === 'undefined') return
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'light') isDark.value = false
      else if (saved === 'dark') isDark.value = true
    } catch (_) {}
    apply()
  }

  return { isDark, setDark, toggle, apply, init }
})
