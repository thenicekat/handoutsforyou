import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

interface CacheEntry {
    data: any
    timestamp: number
    ttl: number
}

class AxiosCache {
    private cache: Map<string, CacheEntry> = new Map()
    private defaultTTL: number = 300000 // 5 minutes default

    private generateKey(config: AxiosRequestConfig): string {
        return `${config.method?.toUpperCase()}_${config.url}`
    }

    private isExpired(entry: CacheEntry): boolean {
        return Date.now() - entry.timestamp > entry.ttl
    }

    get(config: AxiosRequestConfig): any | null {
        const key = this.generateKey(config)
        const entry = this.cache.get(key)
        
        if (!entry || this.isExpired(entry)) {
            this.cache.delete(key)
            return null
        }
        
        return entry.data
    }

    set(config: AxiosRequestConfig, data: any, ttl: number = this.defaultTTL): void {
        const key = this.generateKey(config)
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        })
    }

    clear(): void {
        this.cache.clear()
    }

    clearExpired(): void {
        const entries = Array.from(this.cache.entries())
        for (const [key, entry] of entries) {
            if (this.isExpired(entry)) {
                this.cache.delete(key)
            }
        }
    }
}

const cache = new AxiosCache()

// Create axios instance with cache interceptor
const axiosInstance: AxiosInstance = axios.create({
    baseURL: '',
    timeout: 10000,
})

// Request interceptor to check cache
axiosInstance.interceptors.request.use(
    (config) => {
        // Only cache GET requests
        if (config.method?.toLowerCase() === 'get') {
            const cachedData = cache.get(config)
            if (cachedData) {
                // Return cached response by throwing a custom error that we'll catch
                return Promise.reject({
                    __cached: true,
                    data: cachedData,
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config
                })
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to store cache
axiosInstance.interceptors.response.use(
    (response) => {
        // Cache successful GET responses
        if (response.config.method?.toLowerCase() === 'get' && response.status === 200) {
            const ttl = response.config.url?.includes('/api/auth/session') ? 30000 : 60000 // 30s for auth, 60s for others
            cache.set(response.config, response.data, ttl)
        }
        return response
    },
    (error) => {
        // Handle cached responses
        if (error.__cached) {
            return Promise.resolve({
                data: error.data,
                status: error.status,
                statusText: error.statusText,
                headers: error.headers,
                config: error.config
            })
        }
        return Promise.reject(error)
    }
)

// Clean up expired cache entries every 5 minutes
setInterval(() => {
    cache.clearExpired()
}, 5 * 60 * 1000)

export { axiosInstance, cache }
export default axiosInstance