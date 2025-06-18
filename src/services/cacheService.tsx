class CacheService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private ttl: number = 5 * 60 * 1000 // 5 minutes default

  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + (ttl || this.ttl)
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.timestamp) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  clear(): void {
    this.cache.clear()
  }
}

export default new CacheService()