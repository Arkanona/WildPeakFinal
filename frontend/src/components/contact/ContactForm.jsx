import '../../styles/contact/contact.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ContactForm(){

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [confidentiality, setConfidentiality] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errors, setErrors] = useState({})

    const validateForm = () => {
    const newErrors = {}

    if (!lastname.trim()) {
        newErrors.lastname = "Le nom est obligatoire."
    } else if (lastname.trim().length < 2) {
        newErrors.lastname = "Le nom doit contenir au moins 2 caractères."
    }

    if (!firstname.trim()) {
        newErrors.firstname = "Le prénom est obligatoire."
    } else if (firstname.trim().length < 2) {
        newErrors.firstname = "Le prénom doit contenir au moins 2 caractères."
    }

    if (!email.trim()) {
        newErrors.email = "L'adresse e-mail est obligatoire."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "L'adresse e-mail n'est pas valide."
    }

    if (!message.trim()) {
        newErrors.message = "Le message est obligatoire."
    } else if (message.trim().length < 10) {
        newErrors.message = "Le message doit contenir au moins 10 caractères."
    }

    if (!confidentiality) {
        newErrors.confidentiality =
        "Vous devez accepter la politique de confidentialité."
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

    }

    const handleSubmit = async (e) => {
    e.preventDefault()

    if(!validateForm()){
        return 
    }

    try {
        const response = await fetch(
            "http://localhost:3000/api/v1/contact",
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

        setFirstname("")
        setLastname("")
        setEmail("")
        setMessage("")
        setConfidentiality(false)
        setErrors({})

        setSuccessMessage("Message bien envoyé !")
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

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
                    {errors.lastname && (
                    <p className="fieldError">
                        {errors.lastname}
                    </p>
                    )}
                </div>
                <div>
                    <label htmlFor="firstname">Prénom <span>*</span></label>
                    <input type="text" id='firstname' placeholder='Votre prénom' value={firstname} onChange={(e) => setFirstname(e.target.value)} required/>
                    {errors.firstname && (
                    <p className="fieldError">
                        {errors.firstname}
                    </p>
                    )}
                </div>
            </div>
            <label htmlFor="email">Adresse e-mail <span>*</span></label>
            <input type="email" id='email' placeholder='votre@email.com' value={email} onChange={(e) => setEmail(e.target.value)} required />
            {errors.email && (
            <p className="fieldError">
                {errors.email}
            </p>
            )}
            <div className='messageGroup'>
                <label htmlFor="message">Message <span>*</span></label>
                <textarea id='message' rows='8' cols='10' placeholder='Votre message...' maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} required/>
                {errors.message && (
                <p className="fieldErrorMessage">
                    {errors.message}
                </p>
                )}
                <p>{message.length} / 500</p>
            </div>
            <div className='divCheck'>
                <input type="checkbox" name="confidentiality" id="confidentiality" checked={confidentiality} onChange={(e) => setConfidentiality(e.target.checked)}required/>
                {errors.confidentiality && (
                <p className="fieldError">
                    {errors.confidentiality}
                </p>
                )}
                <span>
                <label htmlFor="confidentiality">J'accepte que mes données soient traitées conformément à notre <br /></label>
                <Link to="#" onClick={(e) => e.stopPropagation()}>politique de confidentialité</Link>.
                </span>
            </div>
            <button type="submit">Envoyer le message</button>
            {successMessage && (
            <p className="successMessage">
                {successMessage}
            </p>
            )}
        </form>      
    )
}
export default ContactForm