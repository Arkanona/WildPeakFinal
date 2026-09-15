import '../../styles/attraction/attractionDetails.scss';
import { useParams } from 'react-router-dom';
// import { findAttractionBySlug } from '../../utils/findAttractionBySlug';


function Attractions({attractions = [], parks = []}){

    const { slug } = useParams()

    const attraction = attractions.find(
        (attraction) => attraction.slug_attraction === slug
    )

    if (!attraction) {
        return <p>Chargement...</p>
    }

    const park = parks.find(
        (park) => park.id_park === attraction.id_park
    )

    if (!park) {
        return <p>Parc introuvable</p>
    }

    return (
        <>
        <div className='bgImagePark' style={{backgroundImage: `url(http://localhost:3000${attraction.imgbg_attraction})`}}>
            <div className='divTextPark'>
                <h1>{attractions.name_attraction}</h1>
                <div>
                    <p>{park.name_park} •</p>
                    <p>{park.country_park} •</p>
                    <p>Ouvert en {attraction.opening_year_attraction}</p>
                </div>
            </div>
        </div>
        </>
    )
}
export default Attractions
