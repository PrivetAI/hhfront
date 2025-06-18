import axios, { AxiosInstance } from 'axios'
import { AuthManager } from '../utils/auth'
import cacheService from './cacheService'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
class ApiService {
  private static instance: ApiService
  private axios: AxiosInstance

  private constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL
    })

    // Request interceptor
    this.axios.interceptors.request.use(config => {
      const token = AuthManager.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor for 401
    this.axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          AuthManager.logout()
          window.location.href = '/'
        }
        return Promise.reject(error)
      }
    )
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  // Auth
  async authenticate(code: string) {
    const response = await axios.post(`${BASE_URL}/api/auth/callback`, null, { 
      params: { code } 
    })
    return response.data
  }

  // Resume
  async getResume() {
    const response = await this.axios.get('/api/resume')
    return response.data
  }

  // Dictionaries
  async getDictionaries() {
    const response = await this.axios.get('/api/dictionaries')
    return response.data
  }

  async getAreas() {
    const response = await this.axios.get('/api/areas')
    return response.data
  }

  // Vacancies
  async searchVacancies(params: any) {
    const response = await this.axios.get('/api/vacancies', { params })
    return response.data
  }

  async getVacancyDetails(id: string) {
    const response = await this.axios.get(`/api/vacancy/${id}`)
    return response.data
  }

  async analyzeVacancy(id: string) {
    const response = await this.axios.post(`/api/vacancy/${id}/analyze`)
    return response.data
  }

  async generateLetter(id: string) {
    const response = await this.axios.post(`/api/vacancy/${id}/generate-letter`)
    return response.data
  }

  async applyToVacancy(id: string, message: string) {
    const response = await this.axios.post(`/api/vacancy/${id}/apply`, { message })
    return response.data
  }
}

export default ApiService