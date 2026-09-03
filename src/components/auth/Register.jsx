import '/Formation/React/WildPeak/frontend/src/styles/register.scss';

function Register () {
    return (
        <>
        <div className='divRegister'>
            <article className='registerArticle'>
                <form action="#">
                    <label htmlFor="email">E-mail :</label>
                    <input type="email" name="email" id="email" placeholder="mail@exemple.com"/>
                    
                    <label htmlFor="pass">Mot de passe :</label>
                        <input type="pass" name="pass" id="pass" placeholder="Mot de passe"/>
                    
                    <label htmlFor="pass">Confirmez mot de passe :</label>
                        <input type="pass" name="pass" id="pass" placeholder="Confirmez mot de passe"/>
                </form>
                <button type="submit">S'inscrire</button>
                <div>
                    <span></span>
                    <p>Ou s'inscrire avec</p>
                    <span></span>
                </div>
                <a href="#" className='googleLink'>GOOGLE</a>
            </article>
            <div>
                <p>Vous avez déjà un compte ?</p>
                <a href="/connexion">Connectez-vous</a>
            </div>
        </div>
        </>
    )
}
export default Register