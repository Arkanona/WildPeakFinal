import { Link } from 'react-router-dom';
import '../styles/footer.scss';

function Footer () {
    return (
        <footer>
            <div>
                <Link to="/">WILDPEAK</Link>
                <span>© 2026 WildPeak. Tout droit réservés.</span>
                <article>
                    <Link to="/informations-legales#LegalMention" >Mentions Légales</Link>
                    <Link to="/informations-legales#PrivacyPolicy" >Politiques de confidentialités</Link>
                    <Link to="/informations-legales#TermsOfUse" >Condition d'utilisations</Link>
                    <Link to="/contact">Contact</Link>
                </article>
            </div>
        </footer>
    )
}
export default Footer