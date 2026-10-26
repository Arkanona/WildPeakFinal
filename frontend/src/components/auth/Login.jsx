import { Link } from 'react-router-dom';
import '../../styles/auth/login.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';


function Login () {

    const login = useAuthStore((state) => state.login)
    const loading = useAuthStore((state) => state.loading)
    const error = useAuthStore((state) => state.error)
    
    const navigate = useNavigate()

    const [ form, setForm ] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev, [name]: value
        }))

        setErrors((prev) => ({
            ...prev, [name]: ''
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!form.email.trim()) {
            newErrors.email = "L'adresse e-mail est obligatoire."
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "L'adresse e-mail n'est pas valide."
        }

        if (!form.password) {
            newErrors.password = 'Le mot de passe est obligatoire.'
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await login({
                email: form.email.trim(),
                password: form.password
            })

            navigate('/')

        } catch (error) {
            console.error(error.message)
        }
    }
        
    return (
        <div className='divLogin'>
            <img src="../../assets/Logo.webp" alt="Logo du site web" />
            <article className='loginArticle'>
            <h1>Bon retour parmi nous !</h1>
            <p>Connectez-vous pour retrouver votre espace WildPeak.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail :</label>
                    <input type="email" name="email" id="email" placeholder="mail@exemple.com" value={form.email} onChange={handleChange} aria-invalid={!!errors.email}aria-describedby={errors.email ? 'loginEmailError' : undefined}/>
                     {errors.email && (
                        <p id="loginEmailError" className="fieldError" role="alert">
                            {errors.email}
                        </p>
                    )}
                    
                    <label htmlFor="password">Mot de passe :</label>
                        <input type="password" name="password" id="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} aria-invalid={!!errors.password}aria-describedby={errors.password ? 'loginPasswordError' : undefined}/>
                        {errors.email && (
                        <p id="loginPasswordError" className="fieldError" role="alert">
                            {errors.password}
                        </p>
                    )}

                    {error && (
                        <p className="errorPass" role="alert">{error}</p>
                    )}
                    
                <button disabled={loading} type="submit">{loading ? 'Connexion...' : 'Se connecter'}</button>
                </form>
                 <Link to="/mot-de-passe-oublie" className='forgotPassLink'>Mot de passe oublié ?</Link>
            </article>
            <div>
                <p>Pas de compte ?</p>
                <Link to="/inscription">Inscrivez-vous !</Link>
            </div>
        </div>
    )
}
export default Login