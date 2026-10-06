import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../styles/auth/resetPass.scss';
import { useState } from 'react';
import { resetPassword } from '../../services/authService'


function ResetPass () {

    const [errors, setErrors] = useState({})    
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate()
    const { token } = useParams()

    const  [form, setForm]  = useState({
        password:'',
        confirmPassword:''
    })

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        setPasswordError('')
        setErrors({})

        if (form.password !== form.confirmPassword){
            setPasswordError('Les mots de passe ne correspondent pas !')
            return
        }

        if(form.password.length < 7){
            setPasswordError('Le mot de passe doit contenir au moins 8 caractères.')
            return
        }

        try{
            await resetPassword(token, form.password)

            navigate('/connexion')

        } catch(error){
            console.error(error.message)

            setErrors({ general: error.message})
        }
    }
        
    return (
        <>
        <div className='divResetPass'>
            <article className='resetArticle'>
                <h1>Réinitialiser le mot de passe</h1>
                <p>Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="password">Nouveau mot de passe :</label>
                    <input type="password" name="password" id="password" placeholder="Nouveau mot de passe" value={form.password} onChange={handleChange} required/>
                    
                    <label htmlFor="confirmPassword">Confirmez mot de passe :</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirmez le mot de passe" value={form.confirmPassword} onChange={handleChange} required/>
                <button type='submit'>Reinitialiser le mot de passe</button>
                </form>
                {passwordError && (
                    <p className='errorPass'>{passwordError}</p>
                )}
                {errors.general && (
                    <p className='errorPass'>{errors.general}</p>
                )}
            </article>
            <div>
                <p>Vous vous souvenez de votre mot de passe ? </p>
                <Link to="/connexion">Connectez-vous</Link>
            </div>
        </div>
        </>
    )
}
export default ResetPass