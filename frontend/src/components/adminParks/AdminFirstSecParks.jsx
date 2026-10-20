import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import "../../styles/adminPark/adminFirstSec.scss"

function AdminFirstSecParks({ parks = [], setFilteredParks, onAdd }) {
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    useEffect(() => {
        const search = searchTerm.trim().toLowerCase()

        const filtered = parks.filter((park) =>
            park.name_park?.toLowerCase().includes(search) ||
            park.country_park?.toLowerCase().includes(search) ||
            park.place_park?.toLowerCase().includes(search)
        )

        setFilteredParks(filtered)

    }, [searchTerm, parks, setFilteredParks])

    return (
        <section className="adminFirstSec">
            <div className="divText">
                <p><strong>{parks.length}</strong> parcs dans le catalogue</p>
                <button type="button" onClick={onAdd}>
                    <FontAwesomeIcon icon={faPlus} />
                    Ajouter un parc
                </button>
            </div>
            <div className="divGroupFilter">
                <div className="inputFilter">
                    <label htmlFor="searchPark">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </label>
                    <input
                        type="search"
                        id="searchPark"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Rechercher par nom, pays ou localisation..."
                    />
                </div>
            </div>
        </section>
    )
}

export default AdminFirstSecParks