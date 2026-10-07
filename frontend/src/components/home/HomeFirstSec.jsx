import { Link } from 'react-router-dom';
import '../../styles/home/homeFirstSec.scss';
import FavoriteButton from '../attractionDetail/FavoriteButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faRotate } from '@fortawesome/free-solid-svg-icons';

function HomeFirstSec({ attractions = [], parks = [] }){

    return (
        <section className='homeFirstSec'>
            <div className='divSpeed'>
                <span></span>
                <h2>ATTRACTIONS LES PLUS RAPIDES</h2>
            </div>
            <div className='cardsContainerAttraction'>
                {attractions.map((attraction, index) => {
                    const park = parks.find(
                        park => park.id_park === attraction.id_park)

                        return(
                    <Link to={`/attractions/${attraction.slug_attraction}`} key={attraction.id_attraction}>
                        <article>
                            <span className='ranking'>#{index + 1}</span>
                            <span className='speed'><FontAwesomeIcon icon={faGaugeHigh} size="sm" /> {attraction?.speed_max_kmh_attraction} KM/H</span>
                            <FavoriteButton attractionId={attraction.id_attraction}/>
                            <img src={`http://localhost:3000${attraction.img_attraction}`} alt={attraction.alt_attraction} />
                            <div>
                                <h3>{attraction.name_attraction}</h3>
                                <p className='parkName'>{park?.name_park}</p>
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
                )
                })}                        
            </div>   
        </section>
    )
}
export default HomeFirstSec