// hooks/useAuth.ts
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

  const fetchResume = useCallback(async (authToken: string) => {
    try {
      apiService.setToken(authToken)
      const resumeData = await apiService.getResume()
      setResume(resumeData)
    } catch (err) {
      console.error('Failed to fetch resume:', err)
    }
  }, [apiService])

  const authenticate = useCallback(async (code: string) => {
    try {
      const authData = await apiService.authenticate(code)
      const { token: newToken } = authData
      
      AuthManager.setToken(newToken)
      setToken(newToken)
      setIsAuthenticated(true)
      AuthManager.clearAuthCodeFromUrl()
      
      await fetchResume(newToken)
    } catch (err) {
      console.error('Auth error:', err)
      throw err
    }
  }, [apiService, fetchResume])

  const logout = useCallback(() => {
    AuthManager.removeToken()
    setToken('')
    setResume(null)
    setIsAuthenticated(false)
  }, [])

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      const savedToken = AuthManager.getToken()
      const authCode = AuthManager.getAuthCodeFromUrl()

      if (savedToken && !resume) {
        setToken(savedToken)
        setIsAuthenticated(true)
        await fetchResume(savedToken)
      } else if (authCode && !savedToken) {
        try {
          await authenticate(authCode)
        } catch (err: any) {
          alert(err.response?.data?.detail || 'Ошибка авторизации')
        }
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    initAuth()

    return () => {
      isMounted = false
    }
  }, []) // Пустой массив зависимостей

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