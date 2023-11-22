import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
  const token = ref<string>()

  const setToken = (value: string) => {
    token.value = value
  }

  const getToken = () => unref(token)

  return { setToken, getToken }
})
