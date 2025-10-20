// import { http } from '@/services/http'

// const HEADER = {
//   // 'x-api-key': process.env.VUE_APP_API_KEY
//   authorization: `Bearer ${authService.getApiToken()}`,
//   'x-api-version': 'v1'
// }

export const authService = {
  async login(email, password) {},

  async register(fullName, email, password, rePassword) {},

  async logout() {}
}
