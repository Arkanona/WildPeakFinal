import { Link } from "react-router-dom";
import Login from "../components/auth/Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


function LoginPage() {
    return (
        <>
        <title>Connexion - WildPeak</title>
        <meta name="description" content="Connecter vous à WildPeak, un site de comparateur d'attractions." />
        <main>
            <section className="firstSecLogin">
            <Link to="/" className="arrowBack"><FontAwesomeIcon icon={faArrowLeft} /></Link>
            <Login/>
            </section>
        </main>
        </>
    )
}

export default LoginPage