import { Link } from 'react-router-dom';
import '../styles/footer.scss';

function Footer () {
    return (
        <footer>
            <div>
                <Link to="/">WILDPEAK</Link>
                <span>© 2026 WildPeak. Tout droit réservés.</span>
                <article>
                    <Link to="#" >Mentions Légales</Link>
                    <Link to="/contact">Contact</Link>
                </article>
            </div>
        </footer>
    )
}
export default Footer