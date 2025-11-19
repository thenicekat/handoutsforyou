/**
 * Axios instance with HTTP caching for GET requests.
 * Caches all successful GET responses in memory for 1 hour to reduce API calls,
 * especially beneficial for PWA auth call bombardment prevention.
 */

import axios from 'axios'
import {
    AxiosCacheInstance,
    buildMemoryStorage,
    setupCache,
} from 'axios-cache-interceptor'

const axiosInstance: AxiosCacheInstance = setupCache(
    axios.create({
        baseURL: '',
        timeout: 10000,
    }),
    {
        storage: buildMemoryStorage(),
        cachePredicate: {
            statusCheck: (status) => status >= 200 && status < 300,
            responseMatch: (res) => {
                // Only cache GET requests for safety
                return res.config.method?.toLowerCase() === 'get'
            },
        },
        generateKey: (req) => {
            return `${req.method?.toUpperCase()}_${req.url}`
        },
        ttl: 3600000,
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        if (status === 401 || status === 403) {
            if (typeof window !== 'undefined') {
                window.location.assign('/error?error=Unauthorized')
            }
        }
        if (status === 503) {
            if (typeof window !== 'undefined') {
                window.location.assign('/error?error=Unavailable')
            }
        }
        return Promise.reject(error)
    }
)

export { axiosInstance }
export default axiosInstance
