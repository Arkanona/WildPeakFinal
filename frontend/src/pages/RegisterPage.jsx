import { Link } from "react-router-dom";
import Register from "../components/auth/Register";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function RegisterPage() {
    return (
        <>
        <title>Inscription - WildPeak</title>
        <meta name="description" content="Inscrivez-vous à WildPeak, un site de comparateur d'attractions." />
        <main>
            <section className="firstSecRegister">
            <Link to="/" className="arrowBack"><FontAwesomeIcon icon={faArrowLeft} /></Link>
            <Register/>
            </section>
        </main>
        </>
    )
}

export default RegisterPage