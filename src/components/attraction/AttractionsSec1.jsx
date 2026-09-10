import '/Formation/React/WildPeak/frontend/src/styles/attractionDetails.scss';
import { useParams } from 'react-router-dom';
import { findAttractionBySlug } from '../../utils/findAttractionBySlug';


function Attractions({datas}){


    const { slug } = useParams()

    // const park = datas.find((park) => 
    //     park.attractions.some((attraction) => String(attraction.slug) === slug) )

    // const attraction = park?.attractions.find(
    //     (attraction) => String(attraction.slug) === slug
    // )
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
