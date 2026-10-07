import { useState } from 'react'
import { faChartSimple, faStopwatch, faPeopleGroup, faRotate } from '@fortawesome/free-solid-svg-icons'
import CustomDropdown from './CustomDropdown'
import '../../styles/attraction/attractionSecondaryFilter.scss'

function SecondaryFilters({ onChange }) {
    const [selectedInversions, setSelectedInversions] = useState('')
    const [selectedHeight, setSelectedHeight] = useState('')
    const [selectedDuration, setSelectedDuration] = useState('')
    const [selectedMinimumHeight, setSelectedMinimumHeight] = useState('')

    const inversionOptions = [
        { value: '', label: 'Toutes' },
        { value: '0', label: 'Aucune' },
        { value: '1-3', label: '1 à 3' },
        { value: '4-6', label: '4 à 6' },
        { value: '7+', label: '7 et plus' }
    ]

    const heightOptions = [
        { value: '', label: 'Toutes' },
        { value: '0-20', label: 'Moins de 20 m' },
        { value: '20-40', label: '20 à 40 m' },
        { value: '40-60', label: '40 à 60 m' },
        { value: '60+', label: 'Plus de 60 m' }
    ]

    const durationOptions = [
        { value: '', label: 'Toutes' },
        { value: '0-2', label: 'Moins de 2 min' },
        { value: '2-3', label: '2 à 3 min' },
        { value: '3-5', label: '3 à 5 min' },
        { value: '5+', label: 'Plus de 5 min' }
    ]

    const minimumHeightOptions = [
        { value: '', label: 'Toutes' },
        { value: '80', label: '80 cm et moins' },
        { value: '90', label: '90 cm' },
        { value: '100', label: '100 cm' },
        { value: '120', label: '120 cm' },
        { value: '130', label: '130 cm et plus' }
    ]

    const updateFilters = (name, value) => {
        const filters = {
            inversions: selectedInversions,
            height: selectedHeight,
            duration: selectedDuration,
            minimumHeight: selectedMinimumHeight,
            [name]: value
        }

        onChange(filters)
    }

    const handleInversions = (value) => {
        setSelectedInversions(value)
        updateFilters('inversions', value)
    }

    const handleHeight = (value) => {
        setSelectedHeight(value)
        updateFilters('height', value)
    }

    const handleDuration = (value) => {
        setSelectedDuration(value)
        updateFilters('duration', value)
    }

    const handleMinimumHeight = (value) => {
        setSelectedMinimumHeight(value)
        updateFilters('minimumHeight', value)
    }

    return (
        <div className="secondaryFilters">
            <CustomDropdown
                label="Inversions"
                icon={faRotate}
                options={inversionOptions}
                value={selectedInversions}
                onChange={handleInversions}
            />
            <CustomDropdown
                label="Hauteur"
                icon={faChartSimple}
                options={heightOptions}
                value={selectedHeight}
                onChange={handleHeight}
            />
            <CustomDropdown
                label="Durée"
                icon={faStopwatch}
                options={durationOptions}
                value={selectedDuration}
                onChange={handleDuration}
            />
            <CustomDropdown
                label="Taille min"
                icon={faPeopleGroup}
                options={minimumHeightOptions}
                value={selectedMinimumHeight}
                onChange={handleMinimumHeight}
            />
        </div>
    )
}

export default SecondaryFilters