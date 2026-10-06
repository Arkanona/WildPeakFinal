import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorSec from "../components/error/Error";

function ErrorPage() {
    

    return (
        <>
        <meta content="text/html;charset=UTF-8" />
        <title>404 - WildPeak</title>
        <meta name="description" content="Page erreur de WildPeak." />
        <Navbar/>
        <main>
            <ErrorSec/>
        </main>
        <Footer/>
        </>
    )
}

export default ErrorPage