import '/Formation/React/WildPeak/frontend/src/styles/attractionDetails.scss';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faGaugeHigh, faArrowUpLong, faMapLocationDot, faStopwatch, faGear, faCalendarDays, faRulerVertical} from '@fortawesome/free-solid-svg-icons'
import { findAttractionBySlug } from '../../utils/findAttractionBySlug';


function AttractionsStats({datas}){

    const { slug } = useParams()

    // const park = datas.find((park) => park.attractions.some((attraction) => String(attraction.slug) === slug) )

    // const attraction = park?.attractions.find(
    //     (attraction) => String(attraction.slug) === slug
    // )
    const { attraction } = findAttractionBySlug(datas, slug)

    return (
        <>
        <div className='paddingAttraction'>
            <div className='statAttraction'>
                <h2>STATISTIQUES</h2>
                <div>
                    <div>
                        <span><FontAwesomeIcon icon={faGaugeHigh} size="sm" /></span>
                        <p>{attraction.vitesse_max_kmh} KM/H</p>
                        <h3>VITESSE DE POINTE</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faArrowUpLong} size="sm" /></span>
                        <p>{attraction.hauteur_m} M</p>
                        <h3>HAUTEUR</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faMapLocationDot} size="sm" /></span>
                        <p>{attraction.longueur_m} M</p>
                        <h3>LONGUEUR DE LA PISTE</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faRotate} size="sm" /></span>
                        <p>{attraction.inversions}</p>
                        <h3>INVERSIONS</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faStopwatch} size="sm" /></span>
                        <p>{attraction.duree_min} MIN</p>
                        <h3>DURÉE</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faGear} size="sm" /></span>
                        <p>{attraction.type}</p>
                        <h3>TYPE</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faRulerVertical} size="sm" /></span>
                        <p>{attraction.taille_minimum_cm} CM</p>
                        <h3>TAILLE MINIMUM</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faCalendarDays} size="sm" /></span>
                        <p>{attraction.ouverture}</p>
                        <h3>ANNÉE D'OUVERTURE</h3>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
} 
export default AttractionsStats