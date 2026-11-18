
import { useEffect, useRef, useState } from "react"
import { getAttractions, getParks } from "../services/api"
import AdminFirstSecAttraction from "../components/adminAttractions/AdminFirstSecAttractions"
import AdminAttractionsTable from "../components/adminAttractions/AdminAttractionsTable"
import AddAttractionModal from "../components/adminAttractions/AddAttractionModal"
import useAuthStore from "../store/authStore"
import AdminHeader from "../components/AdminHeader"
import "../styles/adminAttraction/adminAttractionPagination.scss"

const ITEMS_PER_PAGE = 10

function AdminAttraction() {

    const [parks, setParks] = useState([])
    const [attractions, setAttractions] = useState([])
    const [filteredAttractions, setFilteredAttractions] = useState([])
    const [selectedAttraction, setSelectedAttraction] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const tableRef = useRef(null)

    const token = useAuthStore((state) => state.token)

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAttractions.length / ITEMS_PER_PAGE)
    )

    const activePage = Math.min(currentPage, totalPages)

    const startIndex = (activePage - 1) * ITEMS_PER_PAGE

    const paginatedAttractions = filteredAttractions.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    )

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === activePage) {
            return
        }

        setCurrentPage(page)

        tableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }

    const handleFilterChange = (filtered) => {
        setFilteredAttractions(filtered)
        setCurrentPage(1)
    }

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
                `${import.meta.env.VITE_API_URL}/api/v1/admin-wild/attractions/${idAttraction}`,
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

    return (
        <>
            <title>Administration des attractions - WildPeak</title>
            <meta name="description" content="Gestion des attractions WildPeak." />

            <AdminHeader />

            <main>
                <section className="secBgAdmin">
                    <AdminFirstSecAttraction
                        parks={parks}
                        attractions={attractions}
                        setFilteredAttractions={handleFilterChange}
                        filteredAttractions={filteredAttractions}
                    />

                    <div ref={tableRef} className="adminTableAnchor">
                        <AdminAttractionsTable
                            attractions={paginatedAttractions}
                            parks={parks}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>

                    {filteredAttractions.length > 0 ? (
                        <div className="adminPaginationWrapper">
                            <p className="paginationInfo">
                                Affichage de {startIndex + 1} à{" "}
                                {Math.min(
                                    startIndex + ITEMS_PER_PAGE,
                                    filteredAttractions.length
                                )} sur {filteredAttractions.length} attractions
                            </p>

                            {totalPages > 1 && (
                                <nav
                                    className="adminPagination"
                                    aria-label="Pagination des attractions"
                                >
                                    <button
                                        type="button"
                                        disabled={activePage === 1}
                                        onClick={() => handlePageChange(activePage - 1)}
                                    >
                                        Précédent
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1
                                    ).map((page) => (
                                        <button
                                            type="button"
                                            key={page}
                                            className={activePage === page ? "active" : ""}
                                            aria-label={`Page ${page}`}
                                            aria-current={activePage === page ? "page" : undefined}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        disabled={activePage === totalPages}
                                        onClick={() => handlePageChange(activePage + 1)}
                                    >
                                        Suivant
                                    </button>
                                </nav>
                            )}
                        </div>
                    ) : (
                        <p className="adminPaginationEmpty">
                            Aucune attraction trouvée.
                        </p>
                    )}

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