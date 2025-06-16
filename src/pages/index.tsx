import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import VacancyFilters from '../components/VacancyFilters'
import VacanciesTable from '../components/VacanciesTable'

interface Vacancy {
  id: string
  name: string
  salary?: { from?: number; to?: number; currency?: string }
  employer: { name: string }
  snippet?: { requirement?: string; responsibility?: string }
  area: { name: string }
  aiScore?: number
  aiLetter?: string
  selected?: boolean
}

export default function Home() {
  const [token, setToken] = useState('')
  const [resume, setResume] = useState<any>(null)
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState('')
  const [mounted, setMounted] = useState(false)

  // Создаем единый API клиент
  const api = useMemo(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return axios.create({
      baseURL,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  }, [token])

  const fetchResume = useCallback(async (t: string) => {
    try {
      const res = await api.get('/api/resume', {
        headers: { Authorization: `Bearer ${t}` }
      })
      setResume(res.data)
    } catch (err) {
      console.error('Failed to fetch resume:', err)
    }
  }, [api])

  useEffect(() => {
    if (mounted) return // Предотвращаем повторный вызов
    
    setMounted(true)
    const savedToken = Cookies.get('jwt_token')
    
    if (savedToken) {
      setToken(savedToken)
      fetchResume(savedToken)
      return
    }
    
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      axios.post(`${apiUrl}/api/auth/callback`, null, { params: { code } })
        .then(res => {
          Cookies.set('jwt_token', res.data.token)
          setToken(res.data.token)
          window.history.replaceState({}, '', '/')
          fetchResume(res.data.token)
        })
        .catch(err => {
          console.error('Auth error:', err)
          alert(err.response?.data?.detail || 'Ошибка авторизации')
        })
    }
  }, [mounted, fetchResume])

  const searchVacancies = useCallback(async (params: any) => {
    setLoading('search')
    try {
      const res = await api.get('/api/vacancies', { params })
      setVacancies(res.data.items || [])
    } catch (err: any) {
      console.error('Search error:', err)
      alert(err.response?.data?.description || 'Ошибка поиска')
    } finally {
      setLoading('')
    }
  }, [api])

  const analyzeVacancy = useCallback(async (id: string) => {
    try {
      const res = await api.post(`/api/vacancy/${id}/analyze`)
      updateVacancy(id, { aiScore: res.data.score })
    } catch (err) {
      console.error('Analysis error:', err)
    }
  }, [api])

  const generateLetter = useCallback(async (id: string) => {
    try {
      const res = await api.post(`/api/vacancy/${id}/generate-letter`)
      updateVacancy(id, { aiLetter: res.data.content })
    } catch (err) {
      console.error('Generation error:', err)
    }
  }, [api])

  const updateVacancy = useCallback((id: string, updates: Partial<Vacancy>) => {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }, [])

  const sendApplications = useCallback(async () => {
    const selected = vacancies.filter(v => v.selected && v.aiLetter)
    if (selected.length === 0) return

    setLoading('send')
    let successful = 0
    
    for (const vacancy of selected) {
      try {
        await api.post(`/api/vacancy/${vacancy.id}/apply`, { 
          message: vacancy.aiLetter 
        })
        successful++
      } catch (err) {
        console.error(`Failed to apply to ${vacancy.id}:`, err)
      }
    }
    
    alert(`Отправлено ${successful} из ${selected.length} откликов!`)
    setLoading('')
  }, [vacancies, api])

  const loginUrl = useMemo(() => {
    if (!mounted) return '#'
    return `https://hh.ru/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_HH_CLIENT_ID}&redirect_uri=${window.location.origin}`
  }, [mounted])

  if (!token) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
              AI помощник для поиска работы
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Генерируем персонализированные отклики с помощью ИИ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#demo" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition">
                Посмотреть демо
              </a>
              <a href="#features" className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg hover:bg-blue-50 transition">
                Возможности
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Как это работает</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Авторизация через HH</h3>
                <p className="text-gray-600">Войдите через ваш аккаунт HeadHunter</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Поиск вакансий</h3>
                <p className="text-gray-600">Используйте фильтры или вставьте ссылку</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI генерация откликов</h3>
                <p className="text-gray-600">Получите персонализированные отклики</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
          <div className="text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Демо</h2>
            <div className="bg-gray-300 rounded-lg w-full aspect-video flex items-center justify-center">
              <p className="text-gray-600">Видео демонстрация</p>
            </div>
          </div>
        </section>

        {/* App Section */}
        <section id="app" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Начните прямо сейчас</h2>
            <p className="text-xl text-gray-600 mb-8">Войдите через HeadHunter и начните поиск работы</p>
            <a href={loginUrl} className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-red-700 transition">
              Войти через HeadHunter
            </a>
          </div>
        </section>

        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="font-bold text-xl">HH AI Assistant</div>
            <div className="hidden sm:flex space-x-6">
              <a href="#hero" className="hover:text-blue-600 transition">Главная</a>
              <a href="#features" className="hover:text-blue-600 transition">Возможности</a>
              <a href="#demo" className="hover:text-blue-600 transition">Демо</a>
              <a href="#app" className="hover:text-blue-600 transition">Приложение</a>
            </div>
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">HH AI Assistant</h1>
            {resume && (
              <p className="text-sm text-gray-600">
                {resume.first_name} {resume.last_name} • {resume.title}
              </p>
            )}
          </div>
          <button 
            onClick={() => { 
              Cookies.remove('jwt_token')
              setToken('')
              setResume(null)
              setVacancies([])
            }} 
            className="text-red-600 hover:underline"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <VacancyFilters 
          onSearch={searchVacancies} 
          loading={loading === 'search'} 
        />
        
        <VacanciesTable
          vacancies={vacancies}
          onVacancyUpdate={updateVacancy}
          onAnalyze={analyzeVacancy}
          onGenerate={generateLetter}
          onSendSelected={sendApplications}
        />
      </div>
    </div>
  )
}