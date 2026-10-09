import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import { getAttractionCategory } from "../../utils/filterTypes"
import '../../styles/adminAttraction/adminFirstSec.scss'

function AdminFirstSecAttraction({ parks = [], attractions = [], setFilteredAttractions }) {
    const [selectedPark, setSelectedPark] = useState("")
    const [selectedType, setSelectedType] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)

        applyFilters(value, selectedPark, selectedType)
    }

    const handleParkChange = (e) => {
        const value = e.target.value
        setSelectedPark(value)

        applyFilters(searchTerm, value, selectedType)
    }

    const handleTypeChange = (e) => {
        const value = e.target.value
        setSelectedType(value)

        applyFilters(searchTerm, selectedPark, value)
    }

    const applyFilters = (search, park, type) => {
        let filtered = [...attractions]

        if (search) {
            filtered = filtered.filter((attraction) =>
                attraction.name_attraction
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
        }

        if (park) {
            filtered = filtered.filter(
                (attraction) =>
                    String(attraction.id_park) === String(park)
            )
        }

        if (type) {
            filtered = filtered.filter(
                (attraction) =>
                    getAttractionCategory(attraction.type_attraction) === type
            )
        }

        setFilteredAttractions(filtered)
    }

    const types = [
        "Montagnes russes",
        "Attractions à sensations",
        "Attractions aquatiques",
        "Attractions intérieures",
        "Attractions familiales"
    ]

    return (
        <section className="adminFirstSec">
            <div className="divText">
                <p>{attractions.length} attractions</p>

                <button>
                    <FontAwesomeIcon icon={faPlus} />
                    Ajouter une attraction
                </button>
            </div>
            <div className="divGroupFilter">
                <div className="inputFilter">
                    <label htmlFor="search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Rechercher une attraction..."
                    />
                </div>

                <div className="divFilter">
                    <select
                        id="park"
                        value={selectedPark}
                        onChange={handleParkChange}
                    >
                        <option value="">Tous les parcs</option>

                        {parks.map((park) => (
                            <option
                                key={park.id_park}
                                value={park.id_park}
                            >
                                {park.name_park}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="divFilter">
                    <select
                        id="type"
                        value={selectedType}
                        onChange={handleTypeChange}
                    >
                        <option value="">Tous les types</option>

                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>  
            </div>      
        </section>
    )
}

export default AdminFirstSecAttraction