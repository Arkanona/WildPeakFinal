import '/Formation/React/WildPeak/frontend/src/styles/cardParks.scss';
import { useNavigate } from 'react-router-dom';



function CardParks({datas}) {

    const navigate = useNavigate()


    return (
        <>
        <div className='divCardPark'>
            <div className='divTitleParks'>
                <span></span>
                <h2>TOUT LES PARCS</h2>
                <span></span>
                <p>{datas.length} parcs d'Europe</p>
            </div>
            <div className='cardsContainer'> 
                {datas.map((park) => (

                    <a key={park.id} onClick={() => navigate(`/parcs/${park.id}`)}>
                        <article>
                        <img src={park.img} alt={park.parc} />
                        <div>
                            <h3>{park.parc}</h3>
                            <div className='location'>
                                <span>{park.pays},</span>
                                <p>{park.ville}</p>
                            </div>
                            <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-roller-coaster-icon lucide-roller-coaster"><path d="M6 19V5"/><path d="M10 19V6.8"/><path d="M14 19v-7.8"/><path d="M18 5v4"/><path d="M18 19v-6"/><path d="M22 19V9"/><path d="M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65"/></svg>{park.attractions.length} Attractions</p>
                        </div>
                        </article>
                    </a>
                ))}              
            </div>
        </div>
        </>
       
    )
}
export default CardParks