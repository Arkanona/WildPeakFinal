import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactImage from "../components/contact/ContactBgImage";
import ContactFirstSec from "../components/contact/ContactFirstSec";
import ContactQuestion from "../components/contact/ContactQuestion";


function Contact() {
    

    return (
        <>
        <meta content="text/html;charset=UTF-8" />
        <title>Contact - WildPeak</title>
        <meta name="description" content="Page contact de WildPeak." />
        <Navbar/>
        <main>
            <ContactImage/>
            <ContactFirstSec/>
            <ContactQuestion/>
        </main>
        <Footer/>
        </>
    )
}

export default Contact