import { Link } from 'react-router-dom'
import '../../styles/comparison/comparisonTable.scss'

function ComparisonTable({ selectedAttraction = [], parks = []}) {

    const columns = {
        gridTemplateColumns: `repeat(${selectedAttraction.length}, minmax(0, 1fr))`
    }

    const stats = [
        {
            label: 'TYPE',
            value: (attraction) => attraction.type_attraction,
            field: null
        },
        {
            label: 'VITESSE',
            value: (attraction) => `${attraction.speed_max_kmh_attraction} km/h`,
            field: 'speed_max_kmh_attraction'
        },
        {
            label: 'LONGUEUR',
            value: (attraction) => `${attraction.length_m_attraction} mètres`,
            field: 'length_m_attraction'
        },
        {
            label: 'HAUTEUR',
            value: (attraction) => `${attraction.height_m_attraction} mètres`,
            field: 'height_m_attraction'
        },
        {
            label: 'INVERSION',
            value: (attraction) => `${attraction.inversion_attraction} inversion(s)`,
            field: null
        },
        {
            label: 'DURÉE',
            value: (attraction) => `${attraction.duration_min_attraction} minute(s)`,
            field: 'duration_min_attraction'
        },
        {
            label: 'TAILLE MINIMUM',
            value: (attraction) => `${attraction.minimum_height_cm_attraction} cm`,
            field: null
        },
        {
            label: 'ANNÉE D\'OUVERTURE',
            value: (attraction) => `${attraction.opening_year_attraction}`,
            field: null
        },
    ]

    return (
        <section className='comparisonTable'>
            <div className='comparisonRow' style={columns}>
                {selectedAttraction.map((attraction) => {

                    const park = parks.find((park) => park.id_park === attraction.id_park)

                    return (
                        <Link to={`/attractions/${attraction.slug_attraction}`} key={attraction.id_attraction}>
                        <div className='comparisonCell' key={attraction.id_attraction}>
                            <img src={`http://localhost:3000${attraction.img_attraction}`} alt={attraction.alt_attraction} />
                            <h2>{attraction.name_attraction}</h2>
                            <p>{park?.name_park}</p>
                        </div>
                        </Link>
                    )
                })}
                </div>

                {stats.map((stat) => {

                    const bestValue = stat.field ? Math.max(
                        ...selectedAttraction.map((attraction) => Number(attraction[stat.field])
                        )
                    )
                    : null

                    return (
                    <div className='comparisonRow' style={columns} key={stat.label}>
                        {selectedAttraction.map((attraction) => {

                            const isBest = stat.field && Number(attraction[stat.field]) === bestValue

                            return (
                            <div className={`comparisonCell ${isBest ? 'bestStat' : ''}`} key={attraction.id_attraction}>
                                <span>{stat.label}</span>
                                <p>{stat.value(attraction)}</p>
                            </div>
                        )
                        })}
                    </div>
                    )
                })}
        </section>
    )
}
export default ComparisonTable