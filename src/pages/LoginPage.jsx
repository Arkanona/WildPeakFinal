import Login from "../components/auth/Login";

function LoginPage() {
    return (
        <>
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