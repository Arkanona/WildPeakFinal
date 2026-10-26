
import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faTicket, faLocationDot } from '@fortawesome/free-solid-svg-icons'

import '../styles/adminHeader.scss'

function AdminHeader() {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    const burgerRef = useRef(null)

    const closeMenu = () => {
        burgerRef.current?.focus()
        setIsMenuOpen(false)
    }

    const toggleMenu = () => {
        if(isMenuOpen) {
            closeMenu()
        } else {
            setIsMenuOpen(true)
        }
    }

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : ''

        return () => {
            document.body.style.overflow = ''
        }
    }, [isMenuOpen])

    // Permet de refermer le menu avec la touche 'échap'
    useEffect(() => {
        if (!isMenuOpen) return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                burgerRef.current?.focus()
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isMenuOpen])

    const isAttractionPage = location.pathname === '/admin-wild/attractions'

    return (
        <>
            <header className="adminHeader">
                <div className="adminHeaderLeft">
                    <button
                        type="button"
                        className="adminBurger"
                        onClick={toggleMenu}
                        ref={burgerRef}
                        aria-label="Ouvrir le menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="admin-sidebar"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>

                    <div className="adminHeaderTitle">
                        <h1>
                            {isAttractionPage ? 'ATTRACTIONS' : 'PARCS'}
                        </h1>
                        <p>Gestion du catalogue WildPeak</p>
                    </div>
                </div>

                <div className="adminHeaderRight">
                    <div className="adminAvatar">WP</div>
                    <div className="adminUser">
                        <span>Administration</span>
                        <p>WildPeak</p>
                    </div>
                </div>
            </header>
            {isMenuOpen && (
                <div
                    className="adminOverlay"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}

            <aside
                id="admin-sidebar"
                className={`adminSidebar ${isMenuOpen ? 'open' : ''}`}
                inert={!isMenuOpen}
            >
                <div className="adminSidebarHeader">
                    <Link to="/" className="adminLogo">
                        <span className="adminLogoIcon">
                            <FontAwesomeIcon icon={faTicket} />
                        </span>
                        WILDPEAK
                    </Link>

                    <button
                        type="button"
                        onClick={closeMenu}
                        aria-label="Fermer le menu"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <nav className="adminSidebarNav">
                    <p>GESTION</p>

                    <NavLink
                        to="/admin-wild/attractions"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `adminNavLink ${isActive ? 'active' : ''}`
                        }
                    >
                        <FontAwesomeIcon icon={faTicket} />
                        Attractions
                    </NavLink>

                    <NavLink
                        to="/admin-wild/parcs"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `adminNavLink ${isActive ? 'active' : ''}`
                        }
                    >
                        <FontAwesomeIcon icon={faLocationDot} />
                        Parcs
                    </NavLink>
                </nav>

                <div className="adminSidebarFooter">
                    <span>WildPeak Administration</span>
                </div>
            </aside>
        </>
    )
}

export default AdminHeader
