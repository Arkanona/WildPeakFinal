import Login from "../components/auth/Login";

function LoginPage() {
    return (
        <>
        <title>Connexion - WildPeak</title>
        <meta name="description" content="Connecter vous à WildPeak, un site de comparateur d'attractions." />
        <main>
            <div className="firstDivLogin">
            <a href="/" className="arrowBack">←</a>
            <Login/>
            </div>
        </main>
        </>
    )
}

export default LoginPage