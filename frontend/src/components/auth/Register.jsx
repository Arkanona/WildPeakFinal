import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/register.scss';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';


function Register () {

    const register = useAuthStore((state) => state.register)
    const error = useAuthStore((state) => state.error)

    const navigate = useNavigate()

    const  [form, setForm]  = useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

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

    if (!form.name.trim()) {
        newErrors.name = "Le prénom est obligatoire."
    } else if (form.name.trim().length < 2) {
        newErrors.name = "Le prénom doit contenir au moins 2 caractères."
    }

    if (!form.email.trim()) {
        newErrors.email = "L'adresse e-mail est obligatoire."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "L'adresse e-mail n'est pas valide."
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{7,}$/

    if (!form.password) {
        newErrors.password = "Le mot de passe est obligatoire."
    } else if (!passwordRegex.test(form.password)) {
        newErrors.password = "Le mot de passe doit contenir au moins 7 caractères, une majuscule, une minuscule, un chiffre et un symbole."
    }

    if (form.confirmPassword){
        newErrors.confirmPassword = 'Veuillez confirmez votre mot de passe.'
    } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!validateForm()){
            return 
        }

        setLoading(true)

        try{
            await register({
                name: form.name.trim(),
                email: form.email.tim(),
                password: form.password
            })
            navigate('/connexion')
        } catch(error){
            console.error(error.message)
        } finally {
            setLoading(false)
        }

        
    }

    return (
        <div className='divRegister'>
            <img src="../../assets/Logo.webp" alt="Logo du site web" />
            <article className='registerArticle'>
            <h1>Rejoignez l’aventure !</h1>
            <p>Créez votre compte et explorez WildPeak à votre façon.</p>
                <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="name">Prénom :</label>
                    <input type="text" name='name' id='name' placeholder='Prénom' value={form.name} onChange={handleChange} required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'nameError' : undefined}/>
                    {errors.name && (
                        <p id='nameError' className='fieldError' role='alert'>{errors.name}</p>
                    )}
                    <label htmlFor="email">E-mail :</label>
                    <input type="email" name="email" id="email" placeholder="mail@exemple.com" value={form.email} onChange={handleChange} required aria-invalid={!!errors.email}aria-describedby={errors.email ? 'emailError' : undefined}/>
                    {errors.email && (
                        <p id='emailError' className='fieldError' role='alert'>{errors.email}</p>
                    )}
                    <label htmlFor="password">Mot de passe :</label>
                    <input type="password" name="password" id="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required aria-invalid={!!errors.password} aria-describedby={errors.password ? 'passwordlError' : undefined}/>
                    {errors.password && (
                        <p id='passwordError' className='fieldError' role='alert'>{errors.password}</p>
                    )}
                    <label htmlFor="confirmPassword">Confirmez le mot de passe :</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirmez le mot de passe" value={form.confirmPassword} onChange={handleChange} required aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? 'confirmPasswordlError' : undefined}/>
                    {errors.confirmPassword && (
                        <p id='confirmPasswordError' className='fieldError' role='alert'>{errors.confirmPassword}</p>
                    )}

                    {error && (
                        <p className='errorPass' role='alert'>{error}</p>
                    )}
                <button type="submit" disabled={loading}>{loading ? 'Inscription...' : "S'inscrire"}</button>
                </form>
            </article>
            <div>
                <p>Vous avez déjà un compte ?</p>
                <Link to="/connexion">Connectez-vous</Link>
            </div>
        </div>
    )
}
export default Register