import Register from "../components/auth/Register";

function RegisterPage() {
    return (
        <>
        <title>Inscription - WildPeak</title>
        <meta name="description" content="Inscrivez-vous à WildPeak, un site de comparateur d'attractions." />
        <main>
            <div className="firstDivRegister">
            <a href="/" className="arrowBack">←</a>
            <Register/>
            </div>
        </main>
        </>
    )
}

export default RegisterPage