
const GA_ID = 'G-MR7WNS14RH'
const CONSENT_KEY = 'wildpeak_cookie_consent'
const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000

let analyticsStarted = false

export const getCookieConsent = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(CONSENT_KEY))

        if (!saved || typeof saved.accepted !== 'boolean') {
            return null
        }

        if (
            typeof saved.date !== 'number' ||
            saved.date > Date.now() ||
            Date.now() - saved.date >= CONSENT_DURATION
        ) {
            localStorage.removeItem(CONSENT_KEY)
            return null
        }

        return saved.accepted
    } catch {
        return null
    }
}

let analyticsLoading = false

export const startAnalytics = () => {
    if (
        analyticsStarted ||
        analyticsLoading ||
        getCookieConsent() !== true
    ) return

    analyticsLoading = true

    window.dataLayer = window.dataLayer || []

    window.gtag = function () {
        window.dataLayer.push(arguments)
    }

    window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
    })

    window.gtag('consent', 'update', {
        analytics_storage: 'granted'
    })

    window.gtag('js', new Date())

    // window.gtag('config', GA_ID)
    window.gtag('config', GA_ID, {
        debug_mode: true
    })

    const script = document.createElement('script')

    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`

    script.onload = () => {
        analyticsStarted = true
        analyticsLoading = false
        console.log('Google Analytics chargé avec succès')
    }

    script.onerror = () => {
        analyticsLoading = false
        console.error('Erreur de chargement Google Analytics')
        script.remove()
    }

    document.head.appendChild(script)
}


const deleteAnalyticsCookies = () => {
    const names = document.cookie
        .split(';')
        .map(cookie => cookie.split('=')[0].trim())
        .filter(name =>
            name === '_ga' ||
            name.startsWith('_ga_')
        )

    const hostname = window.location.hostname
    const parts = hostname.split('.')

    const domains = ['', hostname, `.${hostname}`]

    // Cas d'un domaine personnalisé avec sous-domaines
    if (parts.length > 2) {
        domains.push(`.${parts.slice(1).join('.')}`)
    }

    names.forEach(name => {
        domains.forEach(domain => {
            const domainAttribute = domain
                ? `; domain=${domain}`
                : ''

            document.cookie =
                `${name}=; Max-Age=0; path=/${domainAttribute}`
        })
    })
}

export const saveCookieConsent = (accepted) => {
    const wasEnabled = analyticsStarted || analyticsLoading

    localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({
            accepted,
            date: Date.now()
        })
    )

    if (accepted) {
        startAnalytics()
    } else {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                analytics_storage: 'denied'
            })
        }

        deleteAnalyticsCookies()

        if (wasEnabled) {
            window.location.reload()
        }
    }

    return accepted
}

export const trackEvent = (name, params = {}) => {
    if (
        getCookieConsent() !== true ||
        !analyticsStarted ||
        typeof window.gtag !== 'function'
    ) return

    window.gtag('event', name, params)
}
