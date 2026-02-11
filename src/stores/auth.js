import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)

  async function init() {
    if (!supabase) {
      loading.value = false
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    if (user.value) await fetchProfile()
    loading.value = false
    supabase.auth.onAuthStateChange(async (event, session) => {
      user.value = session?.user ?? null
      if (user.value) await fetchProfile()
      else profile.value = null
    })
  }

  async function fetchProfile() {
    if (!supabase || !user.value) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    profile.value = data
  }

  async function signUp(email, password, meta = {}) {
    if (!supabase) return { error: new Error('Supabase non configuré') }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: meta },
    })
    if (!error && data.user) {
      await supabase.from('profiles').upsert(
        { id: data.user.id, full_name: meta.full_name || null, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )
      await fetchProfile()
    }
    return { data, error }
  }

  async function signIn(email, password) {
    if (!supabase) return { error: new Error('Supabase non configuré') }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data.user) await fetchProfile()
    return { data, error }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  function userContextForChat() {
    if (!user.value && !profile.value) return null
    const parts = []
    if (profile.value?.full_name) parts.push(`Nom: ${profile.value.full_name}`)
    if (profile.value?.preferred_era) parts.push(`Époque préférée: ${profile.value.preferred_era}`)
    if (profile.value?.travel_goals) parts.push(`Objectifs: ${profile.value.travel_goals}`)
    return parts.length ? parts.join('. ') : `Utilisateur connecté (${user.value?.email})`
  }

  return {
    user,
    profile,
    loading,
    isLoggedIn,
    init,
    signUp,
    signIn,
    signOut,
    fetchProfile,
    userContextForChat,
  }
})
