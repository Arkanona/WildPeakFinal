import { useState } from 'react';
import '../../styles/attraction/attractionFilter.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBolt, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import SecondaryFilter from './SecondaryFilter'

function AttractionFilter({ parks = [], attractions = [], filteredAttractions = [], setFilteredAttractions}){

    const [selectedPark, setSelectedPark] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [sortBy, setSortBy] = useState('speed')
    const [secondaryFilters, setSecondaryFilters] = useState({
        inversions: '',
        height: '',
        duration: '',
        minimumHeight: ''
    })
    const [resetKey, setResetKey] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const handleReset = () => {
        setSelectedPark('')
        setSelectedType('')
        setSortBy('speed')
        setSearchTerm('')

        setSecondaryFilters({
            inversions: '',
            height: '',
            duration: '',
            minimumHeight: ''
        })

        setFilteredAttractions(
            [...attractions].sort(
                (a, b) =>
                    b.speed_max_kmh_attraction -
                    a.speed_max_kmh_attraction
            )
        )

        setResetKey((prev) => prev + 1)
    }

    const handleSearchChange = (e) => {
        const value = e.target.value

        setSearchTerm(value)

        handleFilters(
            selectedPark,
            selectedType,
            sortBy,
            secondaryFilters,
            value
        )
    }

    const getAttractionCategory = (type) => {

        if (!type) return 'Autres'

        const normalizedType = type.toLowerCase()

        if (
            normalizedType.includes('montagne russe') ||
            normalizedType.includes('montagnes russes') ||
            normalizedType.includes('coaster') ||
            normalizedType.includes('hypercoaster')
        ) {
            return 'Montagnes russes'
        }

        if (
            normalizedType.includes('tour de chute') ||
            normalizedType.includes('drop')
        ) {
            return 'Attractions à sensations'
        }

        if (
            normalizedType.includes('aquatique') ||
            normalizedType.includes('water')
        ) {
            return 'Attractions aquatiques'
        }

        if (
            normalizedType.includes('dark ride') ||
            normalizedType.includes('intérieur')
        ) {
            return 'Attractions intérieures'
        }

        return 'Attractions familiales'
    }

    const types = [
        ...new Set (
            attractions.map((attraction) => getAttractionCategory(attraction.type_attraction)
            )
        )
    ]

    const handleFilters = (
        parkValue,
        typeValue,
        sortValue,
        secondary = secondaryFilters,
        searchValue = searchTerm
    ) => {
        let filtered = [...attractions]

        if (searchValue) {
            filtered = filtered.filter((attraction) =>
                attraction.name_attraction
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            )
        }

        if (parkValue) {
            filtered = filtered.filter(
                (attraction) =>
                    String(attraction.id_park) === String(parkValue)
            )
        }

        if (typeValue) {
            filtered = filtered.filter(
                (attraction) =>
                    getAttractionCategory(attraction.type_attraction) === typeValue
            )
        }

        if (secondary.inversions) {
            filtered = filtered.filter((attraction) => {
                const value = Number(attraction.inversion_attraction)

                if (secondary.inversions === '0') {
                    return value === 0
                }

                if (secondary.inversions === '1-3') {
                    return value >= 1 && value <= 3
                }

                if (secondary.inversions === '4-6') {
                    return value >= 4 && value <= 6
                }

                if (secondary.inversions === '7+') {
                    return value >= 7
                }

                return true
            })
        }

        if (secondary.height) {
            filtered = filtered.filter((attraction) => {
                const value = Number(attraction.height_m_attraction)

                if (secondary.height === '0-20') {
                    return value < 20
                }

                if (secondary.height === '20-40') {
                    return value >= 20 && value < 40
                }

                if (secondary.height === '40-60') {
                    return value >= 40 && value < 60
                }

                if (secondary.height === '60+') {
                    return value >= 60
                }

                return true
            })
        }

        if (secondary.duration) {
            filtered = filtered.filter((attraction) => {
                const value = Number(attraction.duration_min_attraction)

                if (secondary.duration === '0-2') {
                    return value < 2
                }

                if (secondary.duration === '2-3') {
                    return value >= 2 && value < 3
                }

                if (secondary.duration === '3-5') {
                    return value >= 3 && value < 5
                }

                if (secondary.duration === '5+') {
                    return value >= 5
                }

                return true
            })
        }

        if (secondary.minimumHeight) {
            filtered = filtered.filter((attraction) => {
                const value = Number(
                    attraction.minimum_height_cm_attraction
                )

                if (secondary.minimumHeight === '80') {
                    return value <= 80
                }

                if (secondary.minimumHeight === '90') {
                    return value <= 90
                }

                if (secondary.minimumHeight === '100') {
                    return value <= 100
                }

                if (secondary.minimumHeight === '120') {
                    return value <= 120
                }

                if (secondary.minimumHeight === '130') {
                    return value >= 130
                }

                return true
            })
        }

        if (sortValue === 'speed') {
            filtered.sort(
                (a, b) =>
                    b.speed_max_kmh_attraction -
                    a.speed_max_kmh_attraction
            )
        }

        if (sortValue === 'height') {
            filtered.sort(
                (a, b) =>
                    b.height_m_attraction -
                    a.height_m_attraction
            )
        }

        if (sortValue === 'duration') {
            filtered.sort(
                (a, b) =>
                    b.duration_min_attraction -
                    a.duration_min_attraction
            )
        }

        if (sortValue === 'inversion') {
            filtered.sort(
                (a, b) =>
                    b.inversion_attraction -
                    a.inversion_attraction
            )
        }

        if (sortValue === 'length') {
            filtered.sort(
                (a, b) =>
                    b.length_m_attraction -
                    a.length_m_attraction
            )
        }

        setFilteredAttractions(filtered)
    }

    const handleSecondaryFilters = (filters) => {
        setSecondaryFilters(filters)

        handleFilters(
            selectedPark,
            selectedType,
            sortBy,
            filters
        )
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

    const handleFatest = () => {
        setSortBy('speed')

        handleFilters(selectedPark, selectedType, 'speed', secondaryFilters)
    }


    return (
        <section className='attractionSecFilter'>
            <div className='firstDivFilter'>
                <div className='firstFilterLine'>
                    <div className='inputFilter'>
                        <label htmlFor="search"><FontAwesomeIcon icon={faMagnifyingGlass} /></label>
                        <input type="text" id='search' value={searchTerm} onChange={(e) => handleSearchChange(e)} placeholder="Rechercher une attraction..."/>
                    </div>
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
                            <option value='inversion'>Inversion</option>
                            <option value='length'>Longueur</option>
                        </select>
                    </div>
                </div>
                <div className='secondFilterLine'>
                    <SecondaryFilter key={resetKey} onChange={handleSecondaryFilters}/>
                    <button className='fastestButton' onClick={handleFatest}>
                        <FontAwesomeIcon icon={faBolt} /> Les plus rapides
                    </button>
                    <span className='attractionCount'>
                        {filteredAttractions.length}{''}
                        {filteredAttractions.length > 1 ? 'attractions' : 'attraction'}
                    </span>
                    <button className='resetButton' onClick={handleReset}>
                        <FontAwesomeIcon icon={faRotateRight} /> Réinitialiser
                    </button>
                </div>
            </div>
        </section>
    )
}
export default AttractionFilter