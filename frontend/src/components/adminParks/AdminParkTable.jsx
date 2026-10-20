import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faTrash, faLocationDot, faTicket } from "@fortawesome/free-solid-svg-icons"
import "../../styles/adminPark/adminParkTable.scss"

function AdminParkTable({ parks = [], attractions = [], onEdit, onDelete }) {

    const getAttractionCount = (idPark) => {
        return attractions.filter(
            (attraction) =>
                String(attraction.id_park) === String(idPark)
        ).length
    }

    const getImageUrl = (image) => {
        if (!image) return "/assets/parc.webp"

        if (image.startsWith("http")) return image

        return `${import.meta.env.VITE_API_URL}${image}`
    }

    return (
        <div className="adminParksGrid">
            {parks.map((park) => {
                const attractionCount = getAttractionCount(park.id_park)

                return (
                    <article
                        className="adminParkCard"
                        key={park.id_park}
                    >
                        <div className="parkImage">
                            <img
                                src={getImageUrl(park.img_park)}
                                alt={`Vue du parc ${park.name_park}`}
                            />
                            <span className="countryBadge">
                                <FontAwesomeIcon icon={faLocationDot} />
                                {park.country_park}
                            </span>
                            <span className="attractionBadge">
                                <FontAwesomeIcon icon={faTicket} />
                                {attractionCount} attractions
                            </span>
                        </div>
                        <div className="parkContent">
                            <div className="parkDetails">
                                <h3>{park.name_park}</h3>
                                <p>{park.place_park}</p>
                            </div>
                            <div className="parkStats">
                                <div>
                                    <span>Ouverture</span>
                                    <strong>
                                        {park.opening_year_park ?? "—"}
                                    </strong>
                                </div>
                                <div>
                                    <span>Attractions</span>
                                    <strong>{attractionCount}</strong>
                                </div>
                            </div>
                            <div className="parkActions">
                                <button
                                    type="button"
                                    className="editButton"
                                    onClick={() => onEdit(park)}
                                >
                                    <FontAwesomeIcon icon={faPen} />
                                    Modifier
                                </button>

                                <button
                                    type="button"
                                    className="deleteButton"
                                    onClick={() => onDelete(park.id_park)}
                                    aria-label={`Supprimer ${park.name_park}`}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    </article>
                )
            })}

            {parks.length === 0 && (
                <p className="emptyParks">
                    Aucun parc trouvé.
                </p>
            )}
        </div>
    )
}

export default AdminParkTable