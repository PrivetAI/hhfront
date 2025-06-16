// components/VacancyFilters.tsx
import { useState, useEffect } from 'react'
import ApiService from '../services/apiService'
import { AreasHelper } from '../utils/areas'
import { VacancyFiltersProps, Area, Dictionaries, SearchFilters } from '../types'

export default function VacancyFilters({ onSearch, loading }: VacancyFiltersProps) {
  const [areas, setAreas] = useState<Area[]>([])
  const [dictionaries, setDictionaries] = useState<Dictionaries | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    url: '',
    text: '',
    area: '',
    salary: '',
    only_with_salary: false,
    experience: '',
    employment: '',
    schedule: ''
  })

  const apiService = ApiService.getInstance()

  useEffect(() => {
    let isLoaded = false
    
    const loadData = async () => {
      if (isLoaded) return
      isLoaded = true
      
      try {
        const [dictData, areasData] = await Promise.all([
          apiService.getDictionaries(),
          apiService.getAreas()
        ])
        
        setDictionaries(dictData)
        setAreas(AreasHelper.flattenRussianAreas(areasData))
      } catch (err) {
        console.error('Failed to load dictionaries:', err)
      }
    }
    
    loadData()
  }, [apiService])

  const handleSearch = () => {
    if (filters.url) {
      // Parse URL
      try {
        const url = new URL(filters.url)
        const params = Object.fromEntries(url.searchParams)
        onSearch(params)
      } catch (e) {
        alert('Неверный URL')
      }
    } else {
      // Use form filters
      const params: any = {}
      if (filters.text) params.text = filters.text
      if (filters.area) params.area = filters.area
      if (filters.salary) params.salary = filters.salary
      if (filters.only_with_salary) params.only_with_salary = true
      if (filters.experience) params.experience = filters.experience
      if (filters.employment) params.employment = filters.employment
      if (filters.schedule) params.schedule = filters.schedule
      onSearch(params)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Поиск вакансий</h2>
      
      {/* URL Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ссылка на поиск HH</label>
        <input
          type="text"
          value={filters.url}
          onChange={e => setFilters({ ...filters, url: e.target.value })}
          placeholder="https://hh.ru/search/vacancy?text=..."
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="text-center text-gray-500 mb-4">или используйте фильтры</div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ключевые слова</label>
          <input
            type="text"
            value={filters.text}
            onChange={e => setFilters({ ...filters, text: e.target.value })}
            placeholder="Python, React, Manager..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Город</label>
          <select
            value={filters.area}
            onChange={e => setFilters({ ...filters, area: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Все города</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {AreasHelper.formatAreaName(area)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Зарплата от</label>
          <input
            type="number"
            value={filters.salary}
            onChange={e => setFilters({ ...filters, salary: e.target.value })}
            placeholder="100000"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Опыт работы</label>
          <select
            value={filters.experience}
            onChange={e => setFilters({ ...filters, experience: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Любой</option>
            {dictionaries?.experience?.map(exp => (
              <option key={exp.id} value={exp.id}>{exp.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Тип занятости</label>
          <select
            value={filters.employment}
            onChange={e => setFilters({ ...filters, employment: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Любой</option>
            {dictionaries?.employment?.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">График работы</label>
          <select
            value={filters.schedule}
            onChange={e => setFilters({ ...filters, schedule: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Любой</option>
            {dictionaries?.schedule?.map(sch => (
              <option key={sch.id} value={sch.id}>{sch.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="only_with_salary"
          checked={filters.only_with_salary}
          onChange={e => setFilters({ ...filters, only_with_salary: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="only_with_salary" className="text-sm">
          Только с указанной зарплатой
        </label>
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Поиск...' : 'Найти вакансии'}
      </button>
    </div>
  )
}