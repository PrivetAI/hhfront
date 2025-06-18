import { useState, useEffect, useCallback } from 'react'
import ApiService from '../services/apiService'
import { AuthManager } from '../utils/auth'
import { Resume } from '../types'

export const useAuth = () => {
  const [token, setToken] = useState<string>('')
  const [resume, setResume] = useState<Resume | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const apiService = ApiService.getInstance()

  
  const fetchResume = useCallback(async () => {
    if (resume) return // Skip if already loaded
    try {
      const resumeData = await apiService.getResume()
      setResume(resumeData)
    } catch (err) {
      console.error('Failed to fetch resume:', err)
    }
  }, [apiService, resume])


  const authenticate = useCallback(async (code: string) => {
    try {
      const authData = await apiService.authenticate(code)
      const { token: newToken } = authData
      
      AuthManager.setToken(newToken)
      setToken(newToken)
      setIsAuthenticated(true)
      AuthManager.clearAuthCodeFromUrl()
      
      await fetchResume()
    } catch (err) {
      console.error('Auth error:', err)
      throw err
    }
  }, [fetchResume])

  const logout = useCallback(() => {
    AuthManager.logout()
    setToken('')
    setResume(null)
    setIsAuthenticated(false)
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = AuthManager.getToken()
      const authCode = AuthManager.getAuthCodeFromUrl()

      if (savedToken) {
        setToken(savedToken)
        setIsAuthenticated(true)
        await fetchResume()
      } else if (authCode) {
        try {
          await authenticate(authCode)
        } catch (err: any) {
          alert(err.response?.data?.detail || 'Ошибка авторизации')
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  return {
    token,
    resume,
    isLoading,
    isAuthenticated,
    authenticate,
    logout,
    loginUrl: AuthManager.getLoginUrl()
  }
}