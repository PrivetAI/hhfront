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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#d6001c] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#999999]">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LandingPage loginUrl={loginUrl} />
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      {/* Simple Header */}
      <header className="bg-white border-b border-[#e7e7e7]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-[#d6001c] font-bold text-xl">hh</span>
            <span className="text-[#232529] font-medium">агент</span>
          </div>
          <button onClick={logout} className="text-sm text-[#999999] hover:text-[#d6001c]">
            Выйти
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
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
      </main>
    </div>
  )
}