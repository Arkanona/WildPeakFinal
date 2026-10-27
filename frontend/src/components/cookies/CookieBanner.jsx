
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { getCookieConsent, saveCookieConsent, startAnalytics } from '../../utils/analytics'

import '../../styles/cookies/cookieBanner.scss'

function CookieBanner() {

    const [isOpen, setIsOpen] = useState(() => getCookieConsent() === null)
    const [isCustomizing, setIsCustomizing] = useState(false)
    const [analyticsAccepted, setAnalyticsAccepted] = useState(() => getCookieConsent() === true)

    const bannerRef = useRef(null)
    const previousFocusRef = useRef(null)

    useEffect(() => {
        if (getCookieConsent() === true) {
            startAnalytics()
        }

        const openSettings = () => {
            previousFocusRef.current = document.activeElement

            setAnalyticsAccepted(getCookieConsent() === true)
            setIsCustomizing(true)
            setIsOpen(true)
        }

        window.addEventListener(
            'wildpeak-open-cookie-settings',
            openSettings
        )

        return () => {
            window.removeEventListener(
                'wildpeak-open-cookie-settings',
                openSettings
            )
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            bannerRef.current?.focus()
        }
    }, [isOpen])

    const handleChoice = (accepted) => {
        saveCookieConsent(accepted)

        setAnalyticsAccepted(accepted)
        setIsCustomizing(false)
        setIsOpen(false)

        requestAnimationFrame(() => {
            previousFocusRef.current?.focus?.()
        })
    }

    if (!isOpen) return null

    return (
        <section
            className="cookieBanner"
            ref={bannerRef}
            tabIndex={-1}
            aria-labelledby="cookieTitle"
        >
            <h2 id="cookieTitle">Gestion des cookies</h2>
            <p>WildPeak utilise Google Analytics pour mesurer la fréquentation du site et améliorer l'expérience utilisateur. Vous pouvez accepter ou refuser ces cookies.</p>

            {isCustomizing && (
                <div className="cookiePreferences">
                    <div className="cookiePreference">
                        <span>Stockage nécessaire</span>
                        <span>Toujours actif</span>
                    </div>
                    <label className="cookiePreference">
                        <span>Cookies de mesure d'audience</span>
                        <input
                            type="checkbox"
                            checked={analyticsAccepted}
                            onChange={(e) =>
                                setAnalyticsAccepted(e.target.checked)
                            }
                        />
                    </label>
                </div>
            )}

            <div className="cookieActions">
                <button type="button" onClick={() => handleChoice(false)}>Tout refuser</button>
                <button type="button" onClick={() => handleChoice(true)}>Tout accepter</button>

                {isCustomizing ? (
                    <button type="button" onClick={() => handleChoice(analyticsAccepted)}>Enregistrer</button>
                ) : (
                    <button type="button" onClick={() => setIsCustomizing(true)}>Personnaliser</button>
                )}
            </div>
            <Link to="/informations-legales#PrivacyPolicy">Politique de confidentialité</Link>
        </section>
    )
}

export default CookieBanner
