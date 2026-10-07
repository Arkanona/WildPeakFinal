import { useState } from 'react';
import '../../styles/attraction/attractionFilter.scss';

function AttractionFilter({ parks = [], attractions = [], setFilteredAttractions}){

    const [selectedPark, setSelectedPark] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [sortBy, setSortBy] = useState('speed')

    const types = [
        ...new Set (
            attractions.map((attraction) => attraction.type_attraction).filter(Boolean)
        )
    ]

    const handleFilters = (parkValue, typeValue, sortValue) => {
        let filtered = [...attractions]

        if(parkValue){
            filtered = filtered.filter((attraction) => 
                String(attraction.id_park) === String(parkValue))
        }

        if (typeValue) {
            filtered = filtered.filter(
                (attraction) =>
                    attraction.type_attraction === typeValue
            )
        }

        if(sortValue === 'speed') {
            filtered.sort(
                (a, b) =>
                    b.speed_max_kmh_attraction -
                    a.speed_max_kmh_attraction
            )
        }

        if (sortValue === 'height'){
            filtered.sort(
                (a, b) =>
                    b.height_m_attraction -
                    a.height_m_attraction
            )
        }

        if (sortValue === 'duration'){
            filtered.sort(
                (a, b) =>
                    b.duration_min_attraction -
                    a.duration_min_attraction
            )
        }

        setFilteredAttractions(filtered)
    }

    const handleParkChange = (e) => {
        const value = e.target.value
        setSelectedPark(value)

        handleFilters(value, selectedType, sortBy)
    }

    const handleTypeChange = (e) => {
        const value = e.target.value
        setSelectedType(value)

        handleFilters(selectedPark, value, sortBy)
    }

    const handleSortChange = (e) => {
        const value = e.target.value
        setSortBy(value)

        handleFilters(selectedPark, selectedType, value)
    }


    return (
        <section className='attractionSecFilter'>
            <div className='bgImageAttraction'>
                <div>
                    <input type="text" />
                    <div className='divFilter'>
                        <label htmlFor='park'>Parc</label>
                        <select id="park" value={selectedPark} onChange={handleParkChange}>
                            <option value="">Tous les parcs</option>
                            {parks.map((park) => (
                                <option key={park.id_park} value={park.id_park}>
                                    {park.name_park}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='divFilter'>
                        <label htmlFor='type'>Type</label>
                        <select id="type" value={selectedType} onChange={handleTypeChange}>
                            <option value="">Tous les types</option>
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='divFilter'>
                        <label htmlFor='sort'>Classer par</label>
                        <select id="sort" value={sortBy} onChange={handleSortChange}>
                            <option value='speed'>Vitesse</option>
                            <option value='height'>Hauteur</option>
                            <option value='duration'>Durée</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default AttractionFilter