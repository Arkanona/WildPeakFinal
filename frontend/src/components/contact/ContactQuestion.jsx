import '../../styles/contact/contactQuestion.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faLightbulb, faHandshake, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';


function ContactQuestion() {

    return (
        <section className='contactQuestion'>
            <div>
                <h2>Question fréquentes</h2>
                <span></span>
                <article>
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    <h3>Problèmes sur le site ?</h3>
                    <p>Une erreur ou un bug ? <br />Dites-nous en plus via le formulaire.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faLightbulb} />
                    <h3>Suggestion</h3>
                    <p>Vous avez une idées pour améliorer WildPeak ? On adore vos retours !</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faHandshake} />
                    <h3>Partenariat</h3>
                    <p>Vous représenter un parc ou une entreprise ? Contactez-nous.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faShieldHalved} />
                    <h3>Données personnelles</h3>
                    <p>Une question sur vos données ? Consultez notre <Link to="#">politique de confidentialité</Link>.</p>
                </article>
            </div>
        </section>
    )
}
export default ContactQuestion