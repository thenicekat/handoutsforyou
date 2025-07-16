import { axiosInstance } from './axiosCache'

// Centralized API utility using cached axios instance
export const api = {
  // GET requests
  get: async (url: string, config?: any) => {
    const response = await axiosInstance.get(url, config)
    return response.data
  },

  // POST requests
  post: async (url: string, data?: any, config?: any) => {
    const response = await axiosInstance.post(url, data, config)
    return response.data
  },

  // PUT requests
  put: async (url: string, data?: any, config?: any) => {
    const response = await axiosInstance.put(url, data, config)
    return response.data
  },

  // DELETE requests
  delete: async (url: string, config?: any) => {
    const response = await axiosInstance.delete(url, config)
    return response.data
  },

  // PATCH requests
  patch: async (url: string, data?: any, config?: any) => {
    const response = await axiosInstance.patch(url, data, config)
    return response.data
  }
}

// Specific API endpoints
export const authApi = {
  checkSession: () => api.get('/api/auth/session'),
  signOut: () => api.post('/api/auth/signout')
}

export const dataApi = {
  // Generic CRUD operations
  getAll: (endpoint: string) => api.get(endpoint),
  getById: (endpoint: string, id: string) => api.get(`${endpoint}/${id}`),
  create: (endpoint: string, data: any) => api.post(endpoint, data),
  update: (endpoint: string, id: string, data: any) => api.put(`${endpoint}/${id}`, data),
  delete: (endpoint: string, id: string) => api.delete(`${endpoint}/${id}`)
}

export default api