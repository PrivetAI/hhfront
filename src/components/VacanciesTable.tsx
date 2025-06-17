import { useEffect } from 'react'
import ApiService from '../services/apiService'

interface Vacancy {
  id: string
  name: string
  salary?: { from?: number; to?: number; currency?: string }
  employer: { name: string }
  snippet?: { requirement?: string; responsibility?: string }
  area: { name: string }
  published_at?: string
  schedule?: { name: string }
  employment?: { name: string }
  description?: string
  descriptionLoading?: boolean
  aiScore?: number
  aiLetter?: string
  selected?: boolean
}

interface TableProps {
  vacancies: Vacancy[]
  onVacancyUpdate: (id: string, updates: Partial<Vacancy>) => void
  onAnalyze: (id: string) => void
  onGenerate: (id: string) => void
  onSendSelected: () => void
}

export default function VacanciesTable({
  vacancies,
  onVacancyUpdate,
  onAnalyze,
  onGenerate,
  onSendSelected
}: TableProps) {
  const selectedCount = vacancies.filter(v => v.selected && v.aiLetter).length
  const allSelected = vacancies.length > 0 && vacancies.every(v => v.selected !== false)
  const apiService = ApiService.getInstance()

  const toggleAll = () => {
    const newValue = !allSelected
    vacancies.forEach(v => onVacancyUpdate(v.id, { selected: newValue }))
  }

  const formatSalary = (salary?: any) => {
    if (!salary) return null
    const parts = []
    if (salary.from) parts.push(`от ${salary.from.toLocaleString()}`)
    if (salary.to) parts.push(`до ${salary.to.toLocaleString()}`)
    if (salary.currency) parts.push(salary.currency)
    return parts.join(' ')
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`
    return `${Math.floor(diffDays / 30)} месяцев назад`
  }

  const loadDescription = async (vacancy: Vacancy) => {
    if (vacancy.description || vacancy.descriptionLoading) return
    
    onVacancyUpdate(vacancy.id, { descriptionLoading: true })
    
    try {
      const details = await apiService.getVacancyDetails(vacancy.id)
      onVacancyUpdate(vacancy.id, { 
        description: details.description,
        schedule: details.schedule ? { name: details.schedule } : vacancy.schedule,
        employment: details.employment ? { name: details.employment } : vacancy.employment,
        descriptionLoading: false 
      })
    } catch (err) {
      onVacancyUpdate(vacancy.id, { descriptionLoading: false })
    }
  }

  // Load descriptions sequentially
  useEffect(() => {
    const loadDescriptions = async () => {
      for (const vacancy of vacancies) {
        if (!vacancy.description && !vacancy.descriptionLoading) {
          await loadDescription(vacancy)
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
    }
    
    if (vacancies.length > 0) {
      loadDescriptions()
    }
  }, [vacancies.map(v => v.id).join(',')])

  const analyzeAll = async () => {
    for (const vacancy of vacancies) {
      if (vacancy.aiScore === undefined) {
        await onAnalyze(vacancy.id)
      }
    }
  }

  const generateAll = async () => {
    for (const vacancy of vacancies) {
      if (!vacancy.aiLetter) {
        await onGenerate(vacancy.id)
      }
    }
  }

  return (
    <div className="hh-card overflow-hidden">
      <div className="p-4 border-b border-[#e7e7e7] flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#232529]">
          Найдено вакансий: {vacancies.length}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={analyzeAll}
            className="hh-btn hh-btn-secondary text-sm"
          >
            Оценить все
          </button>
          <button
            onClick={generateAll}
            className="hh-btn hh-btn-primary text-sm"
          >
            Создать отклики
          </button>
          <button
            onClick={onSendSelected}
            disabled={selectedCount === 0}
            className="hh-btn hh-btn-success text-sm"
          >
            Отправить ({selectedCount})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f4f4f5] text-sm">
            <tr>
              <th className="p-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="hh-checkbox"
                />
              </th>
              <th className="p-3 text-left min-w-[350px]">Вакансия</th>
              <th className="p-3 text-left min-w-[400px]">Описание</th>
              <th className="p-3 text-left min-w-[80px]">Оценка</th>
              <th className="p-3 text-left min-w-[300px]">AI отклик</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map(vacancy => (
              <tr key={vacancy.id} className="border-b border-[#e7e7e7] hover:bg-gray-50">
                <td className="p-3 align-top">
                  <input
                    type="checkbox"
                    checked={vacancy.selected !== false}
                    onChange={e => onVacancyUpdate(vacancy.id, { selected: e.target.checked })}
                    className="hh-checkbox"
                  />
                </td>
                <td className="p-3 align-top">
                  <div>
                    <a
                      href={`https://hh.ru/vacancy/${vacancy.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hh-link font-medium block mb-1"
                    >
                      {vacancy.name}
                    </a>
                    <div className="text-sm text-[#999999] space-y-1">
                      <div>{vacancy.employer?.name}</div>
                      {vacancy.salary && (
                        <div className="text-[#4bb34b] font-medium">
                          {formatSalary(vacancy.salary)}
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span>{vacancy.area?.name}</span>
                        {vacancy.employment?.name && (
                          <>
                            <span className="text-[#d5d5d5]">•</span>
                            <span>{vacancy.employment.name}</span>
                          </>
                        )}
                        {vacancy.schedule?.name && (
                          <>
                            <span className="text-[#d5d5d5]">•</span>
                            <span>{vacancy.schedule.name}</span>
                          </>
                        )}
                      </div>
                      {vacancy.published_at && (
                        <div className="text-xs">{formatDate(vacancy.published_at)}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3 align-top">
                  {vacancy.descriptionLoading ? (
                    <div className="animate-pulse">
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#666666] leading-relaxed">
                      {vacancy.description || vacancy.snippet?.requirement || vacancy.snippet?.responsibility || ''}
                    </p>
                  )}
                </td>
                <td className="p-3 text-center align-top">
                  {vacancy.aiScore !== undefined && (
                    <div className={`score-badge ${
                      vacancy.aiScore >= 70 ? 'score-high' : 
                      vacancy.aiScore >= 40 ? 'score-medium' : 'score-low'
                    }`}>
                      {vacancy.aiScore}%
                    </div>
                  )}
                </td>
                <td className="p-3 align-top">
                  <textarea
                    value={vacancy.aiLetter || ''}
                    onChange={e => onVacancyUpdate(vacancy.id, { aiLetter: e.target.value })}
                    placeholder="AI отклик появится здесь..."
                    className="hh-input text-sm resize-none"
                    rows={4}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vacancies.length === 0 && (
        <div className="p-12 text-center text-[#999999]">
          Используйте фильтры выше для поиска вакансий
        </div>
      )}
    </div>
  )
}