import '/Formation/React/WildPeak/frontend/src/styles/attractionDetails.scss';
import { useParams } from 'react-router-dom';

function ParkAttractionSec({datas}){

    const { id } = useParams()

    const park = datas.find((park) => park.id === id)


    return (
        <>
        <section className='secParkDetail'>
            <div className='bgImagePark' style={{backgroundImage: `url(${park.img})`}}>
                <div className='divTextPark'>
                    <div>
                        <p>{park.pays} •</p>
                        <p>{park.ville} •</p>
                        <p>{park.creation_date}</p>
                    </div>
                    <h1>{park.parc}</h1>
                </div>
            </div>
            <p>{park.description}</p>
        </section>
        </>
    )
}
export default ParkAttractionSec