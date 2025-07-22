import { axiosInstance } from './axiosCache'

export const api = {
    get: async (url: string, config?: any) => {
        const response = await axiosInstance.get(url, config)
        return response.data
    },

    post: async (url: string, data?: any, config?: any) => {
        const response = await axiosInstance.post(url, data, config)
        return response.data
    },

    put: async (url: string, data?: any, config?: any) => {
        const response = await axiosInstance.put(url, data, config)
        return response.data
    },

    delete: async (url: string, config?: any) => {
        const response = await axiosInstance.delete(url, config)
        return response.data
    },

    patch: async (url: string, data?: any, config?: any) => {
        const response = await axiosInstance.patch(url, data, config)
        return response.data
    },
}

export const authApi = {
    checkSession: () => api.get('/api/auth/session'),
    signOut: () => api.post('/api/auth/signout'),
}

export default api
