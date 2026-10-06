import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ForgotPass from "../components/auth/FortgotPass";

function ForgotPassword() {
    

    return (
        <>
        <meta content="text/html;charset=UTF-8" />
        <title>Mot de passe oublié - WildPeak</title>
        <meta name="description" content="Page mot de passe oublié de WildPeak." />
        <main>
            <section className="firstSecForgotPass">
                <Link to="/" className="arrowBack"><FontAwesomeIcon icon={faArrowLeft} /></Link>
                <ForgotPass/>
            </section>
        </main>
        </>
    )
}

export default ForgotPassword