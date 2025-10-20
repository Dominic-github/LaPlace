import Axios from 'axios'
import NProgress from 'nprogress'
import 'dotenv/config'

class Http {
  silent = false

  constructor() {
    this.client = Axios.create({
      baseURL: `${process.env.SERVER_URL}api`,
      headers: {
        'X-Api-Version': 'v1'
      }
    })

    // Intercept the request to make sure the token is injected into the header.
    this.client.interceptors.request.use((config) => {
      this.silent || this.showLoadingIndicator()
      config.headers.Authorization = `Bearer ${authService.getApiToken()}`
      return config
    })

    // Intercept the response and…
    this.client.interceptors.response.use(
      (response) => {
        this.silent || this.hideLoadingIndicator()
        this.silent = false

        const token = response.headers.authorization
        token && authService.setApiToken(token)

        return response
      },
      (error) => {
        this.silent || this.hideLoadingIndicator()
        this.silent = false

        return Promise.reject(error)
      }
    )
  }

  get silently() {
    this.silent = true
    return this
  }

  async get(url) {
    return (await this.request('get', url)).data
  }

  async post(url, data = {}, onUploadProgress) {
    return (await this.request('post', url, data, onUploadProgress)).data
  }

  async put(url, data) {
    return (await this.request('put', url, data)).data
  }

  async patch(url, data) {
    return (await this.request('patch', url, data)).data
  }

  async delete(url, data = {}) {
    return (await this.request('delete', url, data)).data
  }

  showLoadingIndicator() {
    NProgress.start()
  }

  hideLoadingIndicator() {
    NProgress.done(true)
  }
}

export const http = new Http()
