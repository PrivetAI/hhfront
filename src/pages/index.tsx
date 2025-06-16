import { useAuth } from '../hooks/useAuth'
import { useVacancies } from '../hooks/useVacancies'
import VacancyFilters from '../components/VacancyFilters'
import VacanciesTable from '../components/VacanciesTable'
import LandingPage from '../components/LandingPage'

export default function Home() {
  const { 
    token, 
    resume, 
    isLoading, 
    isAuthenticated, 
    logout, 
    loginUrl 
  } = useAuth()

  const {
    vacancies,
    loading,
    searchVacancies,
    updateVacancy,
    analyzeVacancy,
    generateLetter,
    sendApplications
  } = useVacancies()

  // Показываем загрузку во время инициализации аутентификации
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Показываем лендинг, если пользователь не авторизован
  if (!isAuthenticated) {
    return <LandingPage loginUrl={loginUrl} />
  }

  // Главное приложение для авторизованных пользователей
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
            onClick={logout}
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