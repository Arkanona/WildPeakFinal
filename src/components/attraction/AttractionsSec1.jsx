import '../../styles/attraction/attractionDetails.scss';
import { useParams } from 'react-router-dom';
import { findAttractionBySlug } from '../../utils/findAttractionBySlug';


function Attractions({datas}){

    const { slug } = useParams()
    const { park, attraction } = findAttractionBySlug(datas, slug)

    return (
        <>
        <div className='bgImagePark' style={{backgroundImage: `url(${attraction.img})`}}>
            <div className='divTextPark'>
                <h1>{attraction.nom}</h1>
                <div>
                    <p>{park.parc} •</p>
                    <p>{park.pays} •</p>
                    <p>Ouvert en {attraction.ouverture}</p>
                </div>
            </div>
        </div>
        </>
    )
}
export default Attractions
