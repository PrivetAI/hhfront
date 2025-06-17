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
    schedule: '',
    per_page: '20'
  })

  const apiService = ApiService.getInstance()

  useEffect(() => {
    Promise.all([
      apiService.getDictionaries(),
      apiService.getAreas()
    ]).then(([dictData, areasData]) => {
      setDictionaries(dictData)
      setAreas(AreasHelper.flattenRussianAreas(areasData))
    }).catch(console.error)
  }, [])

  const handleSearch = () => {
    if (filters.url) {
      try {
        const url = new URL(filters.url)
        onSearch(Object.fromEntries(url.searchParams))
      } catch {
        alert('Неверный URL')
      }
    } else {
      const params: any = {}
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'url') params[key] = value
      })
      if (filters.per_page) params.per_page = filters.per_page
      onSearch(params)
    }
  }

  return (
    <div className="hh-card p-4 mb-4">
      {/* URL Input */}
      <div className="mb-4">
        <input
          type="text"
          value={filters.url}
          onChange={e => setFilters({ ...filters, url: e.target.value })}
          placeholder="Вставьте ссылку с hh.ru или используйте фильтры ниже"
          className="hh-input"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          value={filters.text}
          onChange={e => setFilters({ ...filters, text: e.target.value })}
          placeholder="Ключевые слова"
          className="hh-input"
        />

        <select
          value={filters.area}
          onChange={e => setFilters({ ...filters, area: e.target.value })}
          className="hh-select"
        >
          <option value="">Все города</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>
              {AreasHelper.formatAreaName(area)}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={filters.salary}
          onChange={e => setFilters({ ...filters, salary: e.target.value })}
          placeholder="Зарплата от"
          className="hh-input"
        />

        <select
          value={filters.experience}
          onChange={e => setFilters({ ...filters, experience: e.target.value })}
          className="hh-select"
        >
          <option value="">Любой опыт</option>
          {dictionaries?.experience?.map(exp => (
            <option key={exp.id} value={exp.id}>{exp.name}</option>
          ))}
        </select>

        <select
          value={filters.employment}
          onChange={e => setFilters({ ...filters, employment: e.target.value })}
          className="hh-select"
        >
          <option value="">Тип занятости</option>
          {dictionaries?.employment?.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.only_with_salary}
            onChange={e => setFilters({ ...filters, only_with_salary: e.target.checked })}
            className="hh-checkbox"
          />
          <span className="text-sm text-[#232529]">Только с зарплатой</span>
        </label>

        <div>
          <select
            value={filters.per_page}
            onChange={e => setFilters({ ...filters, per_page: e.target.value })}
            className="hh-select"
          >
            <option value="20">20 вакансий</option>
            <option value="50">50 вакансий</option>
            <option value="100">100 вакансий</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="hh-btn hh-btn-primary w-full"
      >
        {loading ? <span className="hh-loader"></span> : 'Найти вакансии'}
      </button>
    </div>
  )
} 