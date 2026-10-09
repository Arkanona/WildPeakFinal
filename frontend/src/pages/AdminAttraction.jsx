import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useEffect, useState } from "react"
import { getAttractions, getParks } from "../services/api"
import AdminFirstSecAttraction from "../components/adminAttractions/AdminFirstSecAttractions"

function AdminAttraction() {

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

    return(
        <>
        <title>Admin - WildPeak</title>
        <meta name="description" content="Page admin de WildPeak."/>
        <Navbar/>
        <main>
            <AdminFirstSecAttraction
            parks={parks}
            attractions={attractions}
            setFilteredAttractions={setFilteredAttractions}
            filteredAttractions={filteredAttractions}
            />
        </main>
        <Footer/>
        </>
    )
}

export default AdminAttraction