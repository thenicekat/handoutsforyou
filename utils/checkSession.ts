import { authApi } from './api'

export async function checkSession() {
    try {
        const result = await authApi.checkSession()
        if (result.error) {
            return false
        }
        return true
    } catch (error) {
        return false
    }
}
