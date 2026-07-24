import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const api = axios.create({
    baseURL: config.public.apiBase,
  })

  // วิธีเรียกใช้ในหน้าอื่นคือ const { $api } = useNuxtApp()
  return {
    provide: {
      api: api
    }
  }
})