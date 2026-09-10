
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Attractions from "../components/attraction/AttractionsSec1";
import AttractionsStats from "../components/attraction/AttractionsStats";
import AboutAttractions from "../components/attraction/AboutAttractions";
import data from '../data/attraction.json';


function AttractionDetails() {
    return (
        <>
        <meta content="text/html;charset=UTF-8" />
        <title>Attractions - WildPeak</title>
        <meta name="description" content="Découvrez les attractions des parcs européens et consultez leurs principales caractéristiques, informations et statistiques." />
        <Navbar/>
        <main>
            <section className='secParkDetail'>
                <Attractions datas={data}/>
                <AttractionsStats datas={data}/>
            </section>
            <AboutAttractions datas={data}/>
        </main>
        <Footer/>
        </>
    )
}

export default AttractionDetails