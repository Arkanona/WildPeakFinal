import '/Formation/React/WildPeak/frontend/src/styles/login.scss';

function Login () {
    return (
        <>
        <div className='divLogin'>
            <article className='loginArticle'>
                <form action="#">
                    <label htmlFor="email">E-mail :</label>
                    <input type="email" name="email" id="email" placeholder="mail@exemple.com"/>
                    
                    <label htmlFor="pass">Mot de passe :</label>
                        <input type="pass" name="pass" id="pass" placeholder="Mot de passe"/>
                    
                </form>
                <a href="#" className='forgotPassLink'>Mot de passe oublié ?</a>
                <button type="submit">Se connecter</button>
                <div>
                    <span></span>
                    <p>Ou se connecter avec</p>
                    <span></span>
                </div>
                <a href="#" className='googleLink'>GOOGLE</a>
            </article>
            <div>
                <p>Pas de compte ?</p>
                <a href="/inscription">Inscrivez-vous !</a>
            </div>
        </div>
        </>
    )
}
export default Login