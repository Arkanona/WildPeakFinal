import '/Formation/React/WildPeak/frontend/src/styles/attractionDetails.scss';
import { useParams } from 'react-router-dom';


function Attractions({datas}){


    const { id } = useParams()

    const park = datas.find((park) => 
        park.attractions.some((attraction) => String(attraction.slug) === id) )

    const attraction = park?.attractions.find(
        (attraction) => String(attraction.slug) === id
    )

    if (!park || !attraction) {
        return <p>Attraction introuvable</p>
    }

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
