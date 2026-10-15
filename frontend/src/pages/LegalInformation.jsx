import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LegalBgImage from "../components/legals/LegalBgImage";
import LegalMention from "../components/legals/LegalMention";
import PrivacyPolicy from "../components/legals/PrivacyPolicy";
import TermsOfUse from "../components/legals/TermsOfUse";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function LegalInformation(){

    const location = useLocation()

    useEffect(() => {
        if (!location.hash) return

        const element = document.querySelector(location.hash)

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }, [location.hash])

    return(
        <>
        <title>Information Légales - WildPeak</title>
        <meta name="description" content="Information légales de WildPeak, avec les mentions légales, politique de confidentialité et condition d'utilisation." />
        <Navbar />
        <main>
            <section className="secLegalInformation">
                <LegalBgImage/>
                <LegalMention/>
                <PrivacyPolicy/>
                <TermsOfUse/>
            </section>
        </main>
        <Footer/>
        </>
    )
}

export default LegalInformation