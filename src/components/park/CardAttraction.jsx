import '../../styles/cardAttraction.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom';

function CardAttraction({datas}){
   
    const { id } = useParams()
    const park = datas.find((park) => park.id === id)


    return (
        <>
        <div className='divCardAttraction'>
            <div className='divTitleAttraction'>
                <h2>TOUTES LES ATTRACTIONS {park.parc}</h2>
                <p>{park.attractions.length}</p>
            </div>
            <div className='cardsContainerAttraction'>
                {park.attractions.map((attraction) => (
                    <Link to={`/attractions/${attraction.slug}`} key={attraction.id}>
                    <article>
                    <img src={attraction.img} alt={attraction.alt} />
                    <div>
                        <h3>{attraction.nom}</h3>
                        <div className='location'>
                            <p>{attraction.short_description}</p>
                        </div>
                        <div className='divStatAttraction'>
                            <p>{attraction.vitesse_max_kmh} km/h</p>
                            <p><FontAwesomeIcon icon={faRotate} size="2xs" /> {attraction.inversions}</p>
                            <p>durée {attraction.duree_min} min</p>
                            <span>{attraction.type}</span>
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
