import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeImage from "../components/home/HomeBgImage";
import HomeFirstSec from "../components/home/HomeFirstSec";
import { useEffect, useState } from "react";
import { getAttractions, getParks } from "../services/api";


function Home() {

    const [attractions, setAttractions] = useState([])
    const [parks, setParks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
    
            const fetchData = async () => {
                try {
    
                    const [attractionsData, parksData] = await Promise.all([
                        getAttractions(),
                        getParks()
                    ])
    
                    setAttractions(attractionsData)
                    setParks(parksData)
    
                } catch (error) {
                    console.error(error)
                    setError("Impossible de charger le parc.")
                } finally {
                    setLoading(false)
                }
            }
    
            fetchData()
    
        }, [])

    if (loading) {
        return <p>Chargement...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    const fatestAttraction = [...attractions]
    .sort(
        (a, b) =>
            b.speed_max_kmh_attraction -
            a.speed_max_kmh_attraction 
    )
    .slice(0, 6)

    return (
        <>
        <title>Accueil - WildPeak</title>
        <meta name="description" content="Découvrez WildPeak, comparez les attractions et les parcs d'Europe pour trouver les expériences et sensations qui vous correspondent." />
        <Navbar />
        <main>
            <HomeImage/>
            <HomeFirstSec attractions={fatestAttraction} parks={parks}/>
        </main>
        
        <Footer/>
        </>
    )
}

export default Home