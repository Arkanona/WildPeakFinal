import '../../styles/park/cardParks.scss';
import { Link } from 'react-router-dom';

function CardParks({parks = [], attractions}) {

    return (
        <>
        <div className='divCardPark'>
            <div className='divTitleParks'>
                <span></span>
                <h2>TOUT LES PARCS</h2>
                <span></span>
                <p>{parks.length} parcs d'Europe</p>
            </div>
            <div className='cardsContainer'> 
                {parks.map((park) => (
                    <Link to={`/parcs/${park.slug_park}`} key={park.id_park}>
                        <article>
                        <img src={`http://localhost:3000${park.img_park}`} alt={park.name_park} />
                        <div>
                            <h3>{park.name_park}</h3>
                            <div className='location'>
                                <span>{park.country_park},</span>
                                <p>{park.place_park}</p>
                            </div>
                            <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-roller-coaster-icon lucide-roller-coaster"><path d="M6 19V5"/><path d="M10 19V6.8"/><path d="M14 19v-7.8"/><path d="M18 5v4"/><path d="M18 19v-6"/><path d="M22 19V9"/><path d="M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65"/></svg>{attractions.filter(
                                (attraction) => attraction.id_park === park.id_park
                            ).length} Attractions</p>
                        </div>
                        </article>
                    </Link>
                ))}              
            </div>
        </div>
        </>
       
    )
}
export default CardParks