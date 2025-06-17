import { useState, useCallback } from 'react'
import ApiService from '../services/apiService'
import { Vacancy } from '../types'

export const useVacancies = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState('')

  const apiService = ApiService.getInstance()

  const searchVacancies = useCallback(async (params: any) => {
    setLoading('search')
    try {
      const data = await apiService.searchVacancies(params)
      // Устанавливаем selected: true по умолчанию для всех вакансий
      const vacanciesWithSelection = (data.items || []).map((v: Vacancy) => ({
        ...v,
        selected: true
      }))
      setVacancies(vacanciesWithSelection)
    } catch (err: any) {
      console.error('Search error:', err)
      alert(err.response?.data?.description || 'Ошибка поиска')
    } finally {
      setLoading('')
    }
  }, [apiService])

  const updateVacancy = useCallback((id: string, updates: Partial<Vacancy>) => {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }, [])

  const analyzeVacancy = useCallback(async (id: string) => {
    try {
      const data = await apiService.analyzeVacancy(id)
      updateVacancy(id, { aiScore: data.score })
    } catch (err) {
      console.error('Analysis error:', err)
    }
  }, [apiService, updateVacancy])

  const generateLetter = useCallback(async (id: string) => {
    try {
      const data = await apiService.generateLetter(id)
      updateVacancy(id, { aiLetter: data.content })
    } catch (err) {
      console.error('Generation error:', err)
    }
  }, [apiService, updateVacancy])

  const sendApplications = useCallback(async () => {
    const selected = vacancies.filter(v => v.selected && v.aiLetter)
    if (selected.length === 0) return

    setLoading('send')
    let successful = 0
    
    for (const vacancy of selected) {
      try {
        await apiService.applyToVacancy(vacancy.id, vacancy.aiLetter!)
        successful++
      } catch (err) {
        console.error(`Failed to apply to ${vacancy.id}:`, err)
      }
    }
    
    alert(`Отправлено ${successful} из ${selected.length} откликов!`)
    setLoading('')
  }, [vacancies, apiService])

  return {
    vacancies,
    loading,
    searchVacancies,
    updateVacancy,
    analyzeVacancy,
    generateLetter,
    sendApplications
  }
}