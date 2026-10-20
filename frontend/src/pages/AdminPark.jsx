import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { getParks, getAttractions } from "../services/api"
import AdminFirstSecParks from "../components/adminParks/AdminFirstSecParks"
import AdminParkTable from "../components/adminParks/AdminParkTable"
import AddParkModal from "../components/adminParks/AddParkModal"
import useAuthStore from "../store/authStore"

function AdminParks() {
    const [parks, setParks] = useState([])
    const [attractions, setAttractions] = useState([])
    const [filteredParks, setFilteredParks] = useState([])

    const [selectedPark, setSelectedPark] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const token = useAuthStore((state) => state.token)

    const handleAdd = () => {
        setSelectedPark(null)
        setIsModalOpen(true)
    }

    const handleEdit = (park) => {
        setSelectedPark(park)
        setIsModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false)
        setSelectedPark(null)
    }

    const handleParkSaved = (savedPark) => {
        setParks((prev) => {
            const exists = prev.some(
                (park) => park.id_park === savedPark.id_park
            )

            if (exists) {
                return prev.map((park) =>
                    park.id_park === savedPark.id_park
                        ? savedPark
                        : park
                )
            }

            return [...prev, savedPark]
        })
    }

    const handleDelete = async (idPark) => {
        const confirmDelete = window.confirm(
            "Voulez-vous vraiment supprimer ce parc ?"
        )

        if (!confirmDelete) return

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin-wild/parcs/${idPark}`,
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

            setParks((prev) =>
                prev.filter((park) => park.id_park !== idPark)
            )

        } catch (error) {
            console.error(error)
        }
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

            } catch (error) {
                console.error("Erreur de chargement :", error)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            <title>Administration des parcs - WildPeak</title>
            <meta name="description" content="Gestion des parcs WildPeak."/>
            <Navbar />
            <main>
                <section className="secBgAdminPark">
                    <AdminFirstSecParks
                        parks={parks}
                        setFilteredParks={setFilteredParks}
                        onAdd={handleAdd}
                    />

                    <AdminParkTable
                        parks={filteredParks}
                        attractions={attractions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </section>
                {isModalOpen && (
                    <AddParkModal
                        key={selectedPark?.id_park ?? "create"}
                        park={selectedPark}
                        mode={selectedPark ? "edit" : "create"}
                        onSaved={handleParkSaved}
                        onUpdated={handleParkSaved}
                        onClose={handleClose}
                    />
                )}
            </main>
        </>
    )
}

export default AdminParks