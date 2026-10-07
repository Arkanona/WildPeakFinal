import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AttractionsSec1 from "../components/attractionDetail/AttractionsSec1";
import AttractionsStats from "../components/attractionDetail/AttractionsStats";
import AboutAttractions from "../components/attractionDetail/AboutAttractions";
import { Navigate, useParams } from "react-router-dom";
import { getParks, getAttractions } from "../services/api";
import { useEffect, useState } from "react";


function AttractionDetails() {
    const { slug } = useParams()

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
                setError("Impossible de charger l'attraction.")
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

    const attraction = attractions.find(
        attraction => attraction.slug_attraction === slug
    )

    if (!attraction) {
        return <Navigate to="/404" replace />
    }

    const park = parks.find(
        park => park.id_park === attraction.id_park
    )

    if (!park) {
        return <Navigate to="/404" replace />
    }

    return (
        <>
        <meta content="text/html;charset=UTF-8" />
        <title>Attraction - WildPeak</title>
        <meta name="description" content="Découvrez les attractions des parcs européens et consultez leurs principales caractéristiques, informations et statistiques." />
        <Navbar/>
        <main>
            <section className='secParkDetail'>
                <AttractionsSec1 attraction={attraction} park={park}/>
                <AttractionsStats attraction={attraction}/>
            </section>
            <AboutAttractions attraction={attraction}/>
        </main>
        <Footer/>
        </>
    )
}

export default AttractionDetails