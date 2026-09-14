
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CardAttraction from "../components/park/CardAttraction";
import ParkAttractionSec1 from "../components/park/ParkAttractionSec1";
import data from '../data/attraction.json';
import { Navigate, useParams } from "react-router-dom";

function ParksDetails() {
    const { id } = useParams()
    const park = data.find((park) => park.id === id)
    
    if(!park){
        return <Navigate to={'/'}/>
    }
    return (
        <>
        <title>Parcs - WildPeak</title>
        <meta name="description" content="Connectez-vous à WildPeak, un site de comparateur d'attractions." />
        <Navbar/>
        <main>
            <ParkAttractionSec1 datas={data}/>
            <CardAttraction datas={data}/>
        </main>
        <Footer/>
        </>
    )
}

export default ParksDetails