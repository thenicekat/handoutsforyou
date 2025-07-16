import { authApi } from './api'

export async function checkSession() {
    try {
        const result = await authApi.checkSession()
        if (result.error) {
            return false
        }
        return true
    } catch (error) {
        console.error('Session check failed:', error)
        return false
    }
}
