import { Link } from 'react-router-dom';
import '../styles/navbar.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

function Navbar () {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev)
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
                <Link to='/connexion'>Connexion</Link>
                <Link to='/inscription'>Inscription</Link>
            </div>
            <nav className='navbarBurger'>
                <div className='divBurger' onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
                </div>
                <ul className={`navbarList ${isMenuOpen ? 'show' : ''}`}>
                    <li className='navbarItem'>
                        <NavLink exact to="/" onClick={toggleMenu}>
                            Accueil
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink exact to="/parcs" onClick={toggleMenu}>
                            Parcs
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink exact to="#" onClick={toggleMenu}>
                            Attractions
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink exact to="/comparateur" onClick={toggleMenu}>
                            Comparateur
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink exact to="/connexion" onClick={toggleMenu}>
                            Connexion
                        </NavLink>
                    </li>
                    <li className='navbarItem'>
                        <NavLink exact to="/inscription" onClick={toggleMenu}>
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