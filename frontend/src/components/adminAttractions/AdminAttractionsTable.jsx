import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import '../../styles/adminAttraction/adminAttractionTable.scss'

function AdminAttractionsTable({ attractions = [], parks = [], onEdit, onDelete }) {

    const getParkById = (idPark) => {
        return parks.find((park) => park.id_park === idPark)
    }

    return (
        <div className="adminTable">

            <div className="adminTableHeader">
                <p>ATTRACTION</p>
                <p>PARC</p>
                <p>TYPE</p>
                <p>ACTIONS</p>
            </div>

            {attractions.map((attraction) => {

                const park = getParkById(attraction.id_park)

                return (
                    <div
                        className="adminTableRow"
                        key={attraction.id_attraction}
                    >
                        <div className="attractionInfo">
                            <img
                                src={`http://localhost:3000${attraction.img_attraction}`}
                                alt={
                                    attraction.alt_attraction ||
                                    attraction.name_attraction
                                }
                            />
                            <div>
                                <h3>{attraction.name_attraction}</h3>
                                <p>
                                    {park?.country_park || "Pays inconnu"}
                                </p>
                            </div>
                        </div>
                        <div className="parkName">
                            <p>
                                {park?.name_park || "Parc inconnu"}
                            </p>
                        </div>
                        <div className="attractionType">
                            <span>
                                {attraction.type_attraction}
                            </span>
                        </div>
                        <div className="attractionActions">
                            <button
                                className="editButton"
                                onClick={() => onEdit(attraction)}
                                aria-label={`Modifier ${attraction.name_attraction}`}
                            >
                                <FontAwesomeIcon icon={faPen} />
                            </button>

                            <button
                                className="deleteButton"
                                onClick={() =>
                                    onDelete(attraction.id_attraction)
                                }
                                aria-label={`Supprimer ${attraction.name_attraction}`}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}

export default AdminAttractionsTable