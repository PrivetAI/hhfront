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

  const formatSalary = (salary?: any) => {
    if (!salary) return null
    const parts = []
    if (salary.from) parts.push(`от ${salary.from.toLocaleString()}`)
    if (salary.to) parts.push(`до ${salary.to.toLocaleString()}`)
    if (salary.currency) parts.push(salary.currency)
    return parts.join(' ')
  }

  const getDescription = (vacancy: Vacancy) => {
    const text = vacancy.snippet?.requirement || vacancy.snippet?.responsibility || ''
    return text.replace(/<[^>]*>/g, '').slice(0, 1000) + (text.length > 1000 ? '...' : '')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">Найдено вакансий: {vacancies.length}</h2>
        <button
          onClick={onSendSelected}
          disabled={selectedCount === 0}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto"
        >
          Отправить отклики ({selectedCount})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left w-10">✓</th>
              <th className="p-3 text-left min-w-[200px]">Вакансия</th>
              <th className="p-3 text-left min-w-[300px]">Описание</th>
              <th className="p-3 text-left min-w-[120px]">AI оценка шансов</th>
              <th className="p-3 text-left min-w-[300px]">AI отклик</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map(vacancy => (
              <tr key={vacancy.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={vacancy.selected || false}
                    onChange={e => onVacancyUpdate(vacancy.id, { selected: e.target.checked })}
                    className="w-4 h-4"
                  />
                </td>
                <td className="p-3">
                  <div>
                    <a
                      href={`https://hh.ru/vacancy/${vacancy.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {vacancy.name}
                    </a>
                    <div className="text-sm text-gray-600 mt-1">{vacancy.employer?.name}</div>
                    {vacancy.salary && (
                      <div className="text-sm text-green-600 mt-1">
                        {formatSalary(vacancy.salary)}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">{vacancy.area?.name}</div>
                  </div>
                </td>
                <td className="p-3">
                  <p className="text-sm text-gray-600">
                    {getDescription(vacancy)}
                  </p>
                </td>
                <td className="p-3">
                  {vacancy.aiScore !== undefined ? (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{vacancy.aiScore}%</div>
                      <div className="text-xs text-gray-500">соответствие</div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAnalyze(vacancy.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Оценить
                    </button>
                  )}
                </td>
                <td className="p-3">
                  {vacancy.aiLetter ? (
                    <textarea
                      value={vacancy.aiLetter}
                      onChange={e => onVacancyUpdate(vacancy.id, { aiLetter: e.target.value })}
                      className="w-full p-2 border rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  ) : (
                    <button
                      onClick={() => onGenerate(vacancy.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Создать отклик
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vacancies.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Используйте фильтры выше для поиска вакансий
        </div>
      )}
    </div>
  )
}