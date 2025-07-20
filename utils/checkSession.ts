export async function checkSession() {
    const response = await fetch('/api/auth/session')
    const result = await response.json()
    if (result.error) {
        return false
    }
    return true
}
