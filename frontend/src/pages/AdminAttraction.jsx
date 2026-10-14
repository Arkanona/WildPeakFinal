import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { getAttractions, getParks } from "../services/api"
import AdminFirstSecAttraction from "../components/adminAttractions/AdminFirstSecAttractions"
import AdminAttractionsTable from "../components/adminAttractions/AdminAttractionsTable"
import AddAttractionModal from "../components/adminAttractions/AddAttractionModal"
import useAuthStore from "../store/authStore"

function AdminAttraction() {

    const [parks, setParks] = useState([])
    const [attractions, setAttractions] = useState([])
    const [filteredAttractions, setFilteredAttractions] = useState([])
    const [selectedAttraction, setSelectedAttraction] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const token = useAuthStore((state) => state.token)

    const handleEdit = (attraction) => {
        setSelectedAttraction(attraction)
        setIsEditOpen(true)
    }

    const handleDelete = async (idAttraction) => {
        const confirmDelete = window.confirm(
            "Voulez-vous vraiment supprimer cette attraction ?"
        )

        if (!confirmDelete) return

        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/admin-wild/${idAttraction}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.title ||
                    result.message ||
                    "Erreur lors de la suppression"
                )
            }

            setAttractions((prev) =>
                prev.filter(
                    (attraction) =>
                        attraction.id_attraction !== idAttraction
                )
            )

            setFilteredAttractions((prev) =>
                prev.filter(
                    (attraction) =>
                        attraction.id_attraction !== idAttraction
                )
            )

        } catch (error) {
            console.error(error)
        }
    }

    const handleAttractionUpdated = (updatedAttraction) => {
    setAttractions((prev) =>
        prev.map((attraction) =>
            attraction.id_attraction === updatedAttraction.id_attraction
                ? updatedAttraction
                : attraction
        )
    )

    setFilteredAttractions((prev) =>
        prev.map((attraction) =>
            attraction.id_attraction === updatedAttraction.id_attraction
                ? updatedAttraction
                : attraction
        )
    )
}

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
            <section className="secBgAdmin">
                <AdminFirstSecAttraction
                parks={parks}
                attractions={attractions}
                setFilteredAttractions={setFilteredAttractions}
                filteredAttractions={filteredAttractions}
                />

                <AdminAttractionsTable
                    attractions={filteredAttractions}
                    parks={parks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            {isEditOpen && (
                <AddAttractionModal
                    parks={parks}
                    attraction={selectedAttraction}
                    mode="edit"
                    onUpdated={handleAttractionUpdated}
                    onClose={() => {
                        setIsEditOpen(false)
                        setSelectedAttraction(null)
                    }}
                />
            )}
            </section>
        </main>
        </>
    )
}

export default AdminAttraction