import { Link } from 'react-router-dom';
import '../../styles/auth/forgotPass.scss';
import { forgotPassword } from '../../services/authService';
import { useState } from 'react';



function ForgotPass () {

        const [errors, setErrors] = useState({})
    

    const handleSubmit = async (e) => {
        e.preventDefault()

        const email = e.target.email.value

        try{
            const data = await forgotPassword(email)
            console.log(data)

            setErrors({})

        } catch(error){
            console.error(error.message)
        }
    }
        
    return (
        <div className='divForgotPass'>
            <article className='forgotArticle'>
                <h1>Mot de passe oublié ?</h1>
                <p>Entrez votre adresse e-mail pour recevoir un lien de <br />réinitialisation.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail :</label>
                    <input type="email" name="email" id="email" placeholder="mail@exemple.com" required/>
                    {errors.email && (
                    <p className="fieldError">
                        {errors.email}
                    </p>
                    )}
                <button type='submit'>Envoyez le lien</button>
                </form>
            </article>
            <div>
                <p>Vous vous souvenez de votre mot de passe ? </p>
                <Link to="/connexion">Connectez-vous</Link>
            </div>
        </div>
    )
}
export default ForgotPass