import '../../styles/attraction/attractionDetails.scss';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faGaugeHigh, faArrowUpLong, faMapLocationDot, faStopwatch, faGear, faCalendarDays, faRulerVertical} from '@fortawesome/free-solid-svg-icons'
// import { findAttractionBySlug } from '../../utils/findAttractionBySlug';


function AttractionsStats({attractions = []}){

    const { slug } = useParams()

    const attraction = attractions.find(
        (attraction) => attraction.slug_attraction === slug
    )
    if (!attraction) {
        return <p>Chargement...</p>
    }
    // const { attraction } = findAttractionBySlug(datas, slug)
    console.log(attraction)
    return (
        <>
        <div className='paddingAttraction'>
            <div className='statAttraction'>
                <h2>STATISTIQUES</h2>
                <div>
                    <div>
                        <span><FontAwesomeIcon icon={faGaugeHigh} size="sm" /></span>
                        <p>{attraction?.speed_max_kmh_attraction} KM/H</p>
                        <h3>VITESSE DE POINTE</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faArrowUpLong} size="sm" /></span>
                        <p>{attraction?.height_m_attraction} M</p>
                        <h3>HAUTEUR</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faMapLocationDot} size="sm" /></span>
                        <p>{attraction?.length_m_attraction} M</p>
                        <h3>LONGUEUR DE LA PISTE</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faRotate} size="sm" /></span>
                        <p>{attraction?.inversion_attraction}</p>
                        <h3>INVERSIONS</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faStopwatch} size="sm" /></span>
                        <p>{attraction?.duration_min_attraction} MIN</p>
                        <h3>DURÉE</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faGear} size="sm" /></span>
                        <p>{attraction?.type_attraction}</p>
                        <h3>TYPE</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faRulerVertical} size="sm" /></span>
                        <p>{attraction?.minimum_height_cm_attraction} CM</p>
                        <h3>TAILLE MINIMUM</h3>
                    </div>
                    <div>
                        <span><FontAwesomeIcon icon={faCalendarDays} size="sm" /></span>
                        <p>{attraction?.opening_year_attraction}</p>
                        <h3>ANNÉE D'OUVERTURE</h3>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
} 
export default AttractionsStats