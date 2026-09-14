import CardParks from "../components/park/CardParks";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import data from '../data/attraction.json';
import ParkImage from "../components/park/ParkBgImage";


function Parks() {
    
    return (
        <>
        <title>Parcs - WildPeak</title>
        <meta name="description" content="Découvrez les principaux parcs d’attractions européens, leurs informations, leurs univers et les attractions qu’ils proposent." />     
        <Navbar/>
        <main>
            <ParkImage/>
            <section className='sectionCardPark'>
                <CardParks datas={data}/>
            </section>
        </main>
        <Footer/>
        </>
    )
}

export default Parks