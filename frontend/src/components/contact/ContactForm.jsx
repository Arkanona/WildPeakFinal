import '../../styles/contact/contact.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ContactForm(){

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [confidentiality, setConfidentiality] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            message,
            confidentiality
          })
        }
      );

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

    } catch (error) {
      console.error(error.message)
    }
  }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div>
                    <label htmlFor="lastname" >Nom <span>*</span></label>
                    <input type="text" id='lastname' placeholder='Votre nom' value={lastname} onChange={(e) => setLastname(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="firstname">Prénom <span>*</span></label>
                    <input type="text" id='firstname' placeholder='Votre prénom' value={firstname} onChange={(e) => setFirstname(e.target.value)} required/>
                </div>
            </div>
            <label htmlFor="email">Adresse e-mail <span>*</span></label>
            <input type="email" id='email' placeholder='votre@email.com' value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className='messageGroup'>
                <label htmlFor="message">Message <span>*</span></label>
                <textarea id='message' rows='8' cols='10' placeholder='Votre message...' maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} required/>
                <p>{message.length} / 500</p>
            </div>
            <div className='divCheck'>
                <input type="checkbox" name="confidentiality" id="confidentiality" checked={confidentiality} onChange={(e) => setConfidentiality(e.target.checked)}required/>
                <span>
                <label htmlFor="confidentiality">J'accepte que mes données soient traitées conformément à notre <br /></label>
                <Link to="#" onClick={(e) => e.stopPropagation()}>politique de confidentialité</Link>.
                </span>
            </div>
            <button type="submit">Envoyer le message</button>
        </form>      
    )
}
export default ContactForm