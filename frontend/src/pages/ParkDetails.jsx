
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CardAttraction from "../components/park/CardAttraction";
import ParkAttractionSec1 from "../components/park/ParkAttractionSec1";
import { getAttractions, getParks } from "../services/api";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

function ParksDetails() {

    const { id } = useParams()

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

    const park = parks.find(
        park => park.slug_park === id
    )

    if (!park) {
        return <Navigate to="/404" replace />
    }

    const parkAttractions = attractions.filter(
        attraction => attraction.id_park === park.id_park
    )

    return (
        <>
        <title>Parcs - WildPeak</title>
        <meta name="description" content={`Découvrez ${park.name_park}, ses attractions et ses principales informations sur WildPeak.`} />
        <Navbar/>
        <main>
            <ParkAttractionSec1 park={park}/>
            <CardAttraction attractions={parkAttractions} park={park}/>
        </main>
        <Footer/>
        </>
    )
}

export default ParksDetails