import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AttractionBgImage from "../components/attractionPage/AttractionBgImage"
import AttractionFilter from "../components/attractionPage/AttractionFilter"
import AttractionCard from "../components/attractionPage/AttractionCard"
import { getAttractions, getParks } from "../services/api"

function Attraction() {

    const [parks, setParks] = useState([])
    const [attractions, setAttractions] = useState([])
    const [filteredAttractions, setFilteredAttractions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [parksData, attractionsData] = await Promise.all([
                    getParks(),
                    getAttractions()
                ])

                setParks(parksData)
                setAttractions(attractionsData)
                setFilteredAttractions(attractionsData)

            } catch (error) {
                console.error("Erreur lors du chargement des données :", error)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            <title>Attractions - WildPeak</title>
            <meta name="description" content="Filtrer les attractions des parcs européens grâce à leurs statistiques et caractéristiques principales."/>
            <Navbar />
            <main>
                <AttractionBgImage />
                <AttractionFilter
                    parks={parks}
                    attractions={attractions}
                    setFilteredAttractions={setFilteredAttractions}
                    filteredAttractions={filteredAttractions}
                />
                <AttractionCard
                    parks={parks}
                    attractions={filteredAttractions}
                />
            </main>
            <Footer />
        </>
    )
}

export default Attraction