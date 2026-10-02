import '../../styles/contact/contact.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLocationDot  } from '@fortawesome/free-solid-svg-icons';
import ContactLocation from './ContactLocation';
import ContactForm from './ContactForm';

function ContactFirstSec(){

    return (
        <section className='contactSec'>
            <article className='formContact'>
                <h2>Envoyer-nous un message</h2>
                <p>Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>
                <ContactForm/>
            </article>
            <aside>
                <div className='contactInfo'>
                    <h2>Nos informations</h2>
                    <p>Vous pouvez également nous contacter directement via les moyens ci-dessous</p>
                    <div>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <div>
                            <h3>E-mail</h3>
                            <p>arkanona@gmail.com <br />Nous répondons sous 24 à 48h.</p>
                        </div>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faLocationDot} />
                        <div>
                            <h3>Notre siège</h3>
                            <p>WildPeak <br />Brignoles, France <br />(Projet non commercial)</p>
                        </div>
                    </div>
                </div>
                <ContactLocation/>
            </aside>
        </section>
    )
}
export default ContactFirstSec