import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ResetPass from "../components/auth/ResetPass";


function ResetPassword() {
    

    return (
        <>
        <meta content="text/html;charset=UTF-8" />
        <title>Réinitialiser le mot de passe - WildPeak</title>
        <meta name="description" content="Page réinitialisation de mot de passe de WildPeak." />
        <main>
            <section className="firstSecResetPass">
                <Link to="/" className="arrowBack"><FontAwesomeIcon icon={faArrowLeft} /></Link>
                <ResetPass/>
            </section>
        </main>
        </>
    )
}

export default ResetPassword