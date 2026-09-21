import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser, faRightFromBracket  } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';


function Navbar () {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev)
    }
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/')
    }
    return (
        <>
        <header>
        <div className="divHeader">
            <Link to='/'>WILDPEAK</Link>   
            <nav className='navbar'>
                <ul>
                    <li><Link to='/'>Accueil</Link></li>
                    <li><Link to='/parcs'>Parcs</Link></li>
                    <li><Link to='#'>Attractions</Link></li>
                    <li><Link to='/comparateur'>Comparateur</Link></li>
                </ul>
            </nav>
            <div>
                {user ? (
                    // Ce qui s'affiche si l'utilisateur est connecté
                    <>
                    <Link to='#' className='profileIconBg'><FontAwesomeIcon icon={faUser} /></Link>
                    <button onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} /></button>
                    </>
                ) : (
                    // Ce qui s'affiche si l'utilisateur n'est pas connecté
                    <>
                    <Link to='/connexion'>Connexion</Link>
                    <Link to='/inscription'>Inscription</Link> 
                    </>
                )}
            </div>
            <nav className='navbarBurger'>
                <div className='divBurger' onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
                </div>
                <ul className={`navbarList ${isMenuOpen ? 'show' : ''}`}>
                    <li className='navbarItem'>
                        <NavLink end to="/" onClick={toggleMenu}>
                            Accueil
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink end to="/parcs" onClick={toggleMenu}>
                            Parcs
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink end to="#" onClick={toggleMenu}>
                            Attractions
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink end to="/comparateur" onClick={toggleMenu}>
                            Comparateur
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink end to="/connexion" onClick={toggleMenu}>
                            Connexion
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink end to="/inscription" onClick={toggleMenu}>
                            Inscription
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
        </header>
        </>
    )
};

export default Navbar