import '../../styles/attraction/attractionDetails.scss';

function Attractions({attraction, park}){

    return (
        <div className='bgImagePark' style={{backgroundImage: `url(http://localhost:3000${attraction.imgbg_attraction})`}}>
            <div className='divTextPark'>
                <h1>{attraction.name_attraction}</h1>
                <div>
                    <p>{park.name_park} •</p>
                    <p>{park.country_park} •</p>
                    <p>Ouvert en {attraction.opening_year_attraction}</p>
                </div>
            </div>
        </div>
    )
}
export default Attractions
