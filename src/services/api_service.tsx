// services/apiService.ts
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiService {
  private static instance: ApiService
  private token: string = ''

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  setToken(token: string) {
    this.token = token
  }

  private getHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {}
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
    const response = await axios.get(`${BASE_URL}/api/resume`, {
      headers: this.getHeaders()
    })
    return response.data
  }

  // Dictionaries
  async getDictionaries() {
    const response = await axios.get(`${BASE_URL}/api/dictionaries`)
    return response.data
  }

  async getAreas() {
    const response = await axios.get(`${BASE_URL}/api/areas`)
    return response.data
  }

  // Vacancies
  async searchVacancies(params: any) {
    const response = await axios.get(`${BASE_URL}/api/vacancies`, {
      params,
      headers: this.getHeaders()
    })
    return response.data
  }

  async analyzeVacancy(id: string) {
    const response = await axios.post(`${BASE_URL}/api/vacancy/${id}/analyze`, {}, {
      headers: this.getHeaders()
    })
    return response.data
  }

  async generateLetter(id: string) {
    const response = await axios.post(`${BASE_URL}/api/vacancy/${id}/generate-letter`, {}, {
      headers: this.getHeaders()
    })
    return response.data
  }

  async applyToVacancy(id: string, message: string) {
    const response = await axios.post(`${BASE_URL}/api/vacancy/${id}/apply`, 
      { message }, 
      { headers: this.getHeaders() }
    )
    return response.data
  }
}

export default ApiService