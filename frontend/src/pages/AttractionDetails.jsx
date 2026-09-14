
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Attractions from "../components/attraction/AttractionsSec1";
import AttractionsStats from "../components/attraction/AttractionsStats";
import AboutAttractions from "../components/attraction/AboutAttractions";
import data from '../data/attraction.json';
import { Navigate, useParams } from "react-router-dom";


function AttractionDetails() {
    const { slug } = useParams();

const attraction = data
    .flatMap((park) => park.attractions)
    .find((attraction) => attraction.slug === slug);

    if(!attraction){
        return <Navigate to={'/'}/>
    }
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