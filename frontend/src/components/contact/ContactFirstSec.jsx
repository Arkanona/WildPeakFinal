import '../../styles/contact/contact.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLocationDot  } from '@fortawesome/free-solid-svg-icons';
import ContactLocation from './ContactLocation';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ContactFirstSec(){

    const [message, setMessage ] = useState("")

    return (
        <section className='contactSec'>
            <article className='formContact'>
                <h2>Envoyer-nous un message</h2>
                <p>Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>
                <form action="" method="post">
                    <div>
                        <div>
                            <label htmlFor="firstname">Nom <span>*</span></label>
                            <input type="text" id='firstname' placeholder='Votre nom'/>
                        </div>
                        <div>
                            <label htmlFor="lastname">Prénom <span>*</span></label>
                            <input type="text" id='lastname' placeholder='Votre prénom'/>
                        </div>
                    </div>
                    <label htmlFor="email">Adresse e-mail <span>*</span></label>
                    <input type="email" id='email' placeholder='votre@email.com' />
                    <div className='messageGroup'>
                        <label htmlFor="message">Message <span>*</span></label>
                        <textarea id='message' rows='8' cols='10' placeholder='Votre message...' maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)}/>
                        <p>{message.length} / 500</p>
                    </div>
                    <div className='divCheck'>
                        <input type="checkbox" name="confidentiality" id="confidentiality" />
                        <span>
                        <label htmlFor="confidentiality">J'accepte que mes données soient traitées conformément à notre <br /></label>
                        <Link to="#" onClick={(e) => e.stopPropagation()}>politique de confidentialité</Link>.
                        </span>
                    </div>
                    <button type="submit">Envoyer le message</button>
                </form>
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