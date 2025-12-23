/**
 * Detects if the user is using automated tools or bots
 */
export const detectBot = (): boolean => {
    if (typeof window === 'undefined') return false

    const botPatterns = [
        /bot/i,
        /spider/i,
        /crawl/i,
        /scrape/i,
        /headless/i,
        /phantom/i,
        /selenium/i,
        /puppeteer/i,
        /playwright/i,
    ]

    const userAgent = navigator.userAgent

    // Check user agent
    if (botPatterns.some(pattern => pattern.test(userAgent))) {
        return true
    }

    // Check for headless browser indicators
    if (
        // @ts-ignore
        navigator.webdriver ||
        // @ts-ignore
        window.document.documentElement.getAttribute('webdriver') ||
        // @ts-ignore
        window.callPhantom ||
        // @ts-ignore
        window._phantom ||
        // @ts-ignore
        window.phantom
    ) {
        return true
    }

    // Check for automation tools
    // @ts-ignore
    if (window.chrome && window.chrome.runtime) {
        // Likely a Chrome extension or automation
        // @ts-ignore
        if (!window.chrome.runtime.onMessage) {
            return true
        }
    }

    return false
}

/**
 * Monitors for suspicious activity (rapid clicking/typing)
 * Note: DevTools detection is handled by disable-devtool library
 */
export const monitorSuspiciousActivity = () => {
    if (typeof window === 'undefined') return

    let clickCount = 0
    let keyPressCount = 0
    const timeWindow = 5000 // 5 seconds

    const resetCounters = () => {
        clickCount = 0
        keyPressCount = 0
    }

    // Monitor rapid clicking
    document.addEventListener('click', () => {
        clickCount++
        if (clickCount > 50) {
            console.warn('Suspicious activity detected: Rapid clicking')
            // You could redirect or block the user here
        }
    })

    // Monitor rapid key pressing
    document.addEventListener('keypress', () => {
        keyPressCount++
        if (keyPressCount > 100) {
            console.warn('Suspicious activity detected: Rapid key pressing')
            // You could redirect or block the user here
        }
    })

    // Reset counters every time window
    setInterval(resetCounters, timeWindow)
}
