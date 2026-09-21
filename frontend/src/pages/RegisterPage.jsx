import { Link } from "react-router-dom";
import Register from "../components/auth/Register";

function RegisterPage() {
    return (
        <>
        <title>Inscription - WildPeak</title>
        <meta name="description" content="Inscrivez-vous à WildPeak, un site de comparateur d'attractions." />
        <main>
            <div className="firstDivRegister">
            <Link to="/" className="arrowBack">←</Link>
            <Register/>
            </div>
        </main>
        </>
    )
}

export default RegisterPage