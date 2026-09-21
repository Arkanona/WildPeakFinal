import { useEffect, useState } from "react";
import CardParks from "../components/park/CardParks";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParkImage from "../components/park/ParkBgImage";
import { getParks, getAttractions } from "../services/api";


function Parks() {
    
    const [ parks, setParks ] = useState([])

    useEffect(() => {
        getParks()
            .then(data => setParks(data))
            .catch(error => console.error(error))
    }, [])
    const [ attractions, setAttractions ] = useState([])
    
        useEffect(() => {
            getAttractions()
                .then(data => setAttractions(data))
                .catch(error => console.error(error))
        }, [])
    return (
        <>
        <title>Parcs - WildPeak</title>
        <meta name="description" content="Découvrez les principaux parcs d’attractions européens, leurs informations, leurs univers et les attractions qu’ils proposent." />     
        <Navbar/>
        <main>
            <ParkImage parks={parks}/>
            <section className='sectionCardPark'>
                <CardParks parks={parks} attractions={attractions}/>
            </section>
        </main>
        <Footer/>
        </>
    )
}

export default Parks