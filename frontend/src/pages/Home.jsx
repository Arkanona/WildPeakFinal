import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeImage from "../components/home/HomeBgImage";


function Home() {
    return (
        <>
        <title>Accueil - WildPeak</title>
        <meta name="description" content="Découvrez WildPeak, comparez les attractions et les parcs d'Europe pour trouver les expériences et sensations qui vous correspondent." />
        <Navbar />
        <HomeImage/>
        <Footer/>
        </>
    )
}

export default Home