export interface Vacancy {
  id: string
  name: string
  salary?: { 
    from?: number
    to?: number
    currency?: string 
  }
  employer: { name: string }
  snippet?: { 
    requirement?: string
    responsibility?: string 
  }
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

export interface Resume {
  id: string
  first_name: string
  last_name: string
  title: string
}

export interface Area {
  id: string
  name: string
  parent_id?: string
  areas?: Area[]
}

export interface DictionaryItem {
  id: string
  name: string
}

export interface Dictionaries {
  experience: DictionaryItem[]
  employment: DictionaryItem[]
  schedule: DictionaryItem[]
}

export interface SearchFilters {
  url: string
  text: string
  area: string
  salary: string
  only_with_salary: boolean
  experience: string
  employment: string
  schedule: string
  per_page: string
}

export interface VacancyFiltersProps {
  onSearch: (params: any) => void
  loading: boolean
}

export interface VacanciesTableProps {
  vacancies: Vacancy[]
  onVacancyUpdate: (id: string, updates: Partial<Vacancy>) => void
  onAnalyze: (id: string) => void
  onGenerate: (id: string) => void
  onSendSelected: () => void
}