import '../../styles/park/cardAttraction.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom';
import FavoriteButton from '../attraction/FavoriteButton';

function CardAttraction({ parks, attractions }){
   
    const { id } = useParams()

    const park = parks.find((park) => park.slug_park === id
    )

    if (!park) {
        return <p>Parc introuvable</p>
    }

    const parkAttractions = attractions.filter(
        (attraction) => attraction.id_park === park.id_park
    )

    return (
        <>
        <div className='cardAttraction'>
            <div className='divTitleAttraction'>
                <h2>TOUTES LES ATTRACTIONS {park.name_park}</h2>
                <p>{parkAttractions.length}</p>
            </div>
            <div className='cardsContainerAttraction'>
                {parkAttractions.map((attraction) => (
                    <Link to={`/attractions/${attraction.slug_attraction}`} key={attraction.id_attraction}>
                        <article>
                        <FavoriteButton attractionId={attraction.id_attraction}/>
                        <img src={`http://localhost:3000${attraction.img_attraction}`} alt={attraction.alt_attraction} />
                        <div>
                            <h3>{attraction.name_attraction}</h3>
                            <div className='location'>
                                <p>{attraction.short_description_attraction}</p>
                            </div>
                            <div className='divStatAttraction'>
                                <p>{attraction.speed_max_kmh_attraction} km/h</p>
                                <p><FontAwesomeIcon icon={faRotate} size="2xs" /> {attraction.inversion_attraction}</p>
                                <p>durée {attraction.duration_min_attraction} min</p>
                                <span>{attraction.type_attraction}</span>
                            </div>
                        </div>
                        </article>
                    </Link>
                ))}                        
            </div>           
        </div>
        </>
    )
}
export default CardAttraction
