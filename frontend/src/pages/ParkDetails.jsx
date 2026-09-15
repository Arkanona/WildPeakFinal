
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CardAttraction from "../components/park/CardAttraction";
import ParkAttractionSec1 from "../components/park/ParkAttractionSec1";
// import data from '../data/attraction.json';
import { getAttractions, getParks } from "../services/api";
import { useState, useEffect } from "react";

function ParksDetails() {
    // const { id } = useParams()
    // const park = data.find((park) => park.id === id)
    
    // if(!park){
    //     return <Navigate to={'/'}/>
    // }
    const [ attractions, setAttractions ] = useState([])

    useEffect(() => {
        getAttractions()
            .then(data => setAttractions(data))
            .catch(error => console.error(error))
    }, [])

    const [ parks, setParks ] = useState([])
    
        useEffect(() => {
            getParks()
                .then(data => setParks(data))
                .catch(error => console.error(error))
        }, [])
    return (
        <>
        <title>Parcs - WildPeak</title>
        <meta name="description" content="Connectez-vous à WildPeak, un site de comparateur d'attractions." />
        <Navbar/>
        <main>
            <ParkAttractionSec1 attractions={attractions} parks={parks}/>
            <CardAttraction attractions={attractions} parks={parks}/>
        </main>
        <Footer/>
        </>
    )
}

export default ParksDetails