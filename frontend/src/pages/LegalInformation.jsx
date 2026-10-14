import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LegalBgImage from "../components/legals/LegalBgImage";
import LegalMention from "../components/legals/LegalMention";

function LegalInformation(){

    return(
        <>
        <title>Information Légales - WildPeak</title>
        <meta name="description" content="Information légales de WildPeak, avec les mentions légales, politique de confidentialité et condition d'utilisation." />
        <Navbar />
        <main>
            <section className="secLegalInformation">
                <LegalBgImage/>
                <LegalMention/>
            </section>
        </main>
        <Footer/>
        </>
    )
}

export default LegalInformation