import '../../styles/attraction/attractionDetails.scss';

function ParkAttractionSec({park}){

    return (
        <section className='secParkDetail'>
            <div className='bgImagePark' style={{backgroundImage: `url(http://localhost:3000${park?.imgbg_park})`}}>
                <div className='divTextPark'>
                    <div>
                        <p>{park?.country_park} •</p>
                        <p>{park?.place_park} •</p>
                        <p>{park?.opening_year_park}</p>
                    </div>
                    <h1>{park?.name_park}</h1>
                </div>
            </div>
            <p>{park?.description_park}</p>
        </section>
    )
}
export default ParkAttractionSec