import { Link } from 'react-router-dom';
import '../../styles/attraction/attractionCard.scss';
import FavoriteButton from '../attractionDetail/FavoriteButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

function AttractionCard({ attractions }){

    return (
        <>
            <div className='titleAttraction'>
                <span></span>
                <h2>ATTRACTIONS LES PLUS RAPIDES</h2>
                <span></span>
                <p>Classez les attractions par vitesse, inversions, hauteur et plus encore.</p>
            </div>
            <div className='cardsContainerAttraction'>
                {attractions.map((attraction) => (
                    <Link to={`/attractions/${attraction.slug_attraction}`} key={attraction.id_attraction}>
                        <article>
                        <FavoriteButton attractionId={attraction.id_attraction}/>
                        <img src={`http://localhost:3000${attraction.img_attraction}`} alt={attraction.alt_attraction} />
                        <div>
                            <h3>{attraction.name_attraction}</h3>
                            <p>{attraction.short_description_attraction}</p>
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
        </>
    )
}
export default AttractionCard