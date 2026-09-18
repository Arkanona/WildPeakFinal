import '../../styles/comparison/comparisonCollapse.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';


function ComparisonCollapse({attractions= [], parks = [], selectedAttraction = [], setSelectedAttraction}){

    const [visibleCol, setVisibleCol] = useState(false);
    const [search, setSearch] = useState("")

    
    const handleSelect = (attraction) => {
        const alreadySelected = selectedAttraction.some(
            (item) => item.id_attraction === attraction.id_attraction
        )
    
    if (alreadySelected){
        setSelectedAttraction(
            selectedAttraction.filter(
                (item) => item.id_attraction !== attraction.id_attraction
            )
        )

        return
    }

    if(selectedAttraction.length >= 4){
        return
    }

    setSelectedAttraction([
        ...selectedAttraction,
        attraction
    ])

    if(selectedAttraction.length === 3) {
        setVisibleCol(false)
    }
    }

    const filteredAttractions = attractions.filter((attraction) =>
        attraction.name_attraction.toLowerCase().includes(search.toLowerCase()) 
        // park.name_park.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <section className='secCollapse'>
            <button onClick={() => setVisibleCol(!visibleCol)}>
                <div className='selectedAttractions'>
                {selectedAttraction.length === 0 ? (
                    <span className='emptySelection'>Selectionner des attractions à comparer...</span>

                ) : (
                    selectedAttraction.map((attraction) => (
                        <span key={attraction.id_attraction}
                            className='selectedBadge'>
                             <span className='selectedBadgeName'>
                                {attraction.name_attraction}
                            </span>
                                <span onClick={(e) => {
                                    e.stopPropagation()
                                    handleSelect(attraction)
                                }} className='removeBadge'>
                                    <FontAwesomeIcon icon={faXmark} />
                                </span>
                            </span>
                    ))
                )}
                </div>
                <div className='collapseInfo'>
                    <span>{selectedAttraction.length}/4</span>
                    <FontAwesomeIcon icon={faChevronDown} className={`fa-solid fa-arrow-down ${visibleCol ? 'rotate' : ''}`}/>
                </div>
            </button>
            {visibleCol && (
                <>
                <div className='search'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input 
                        type="text"
                        id='collapseInput'
                        placeholder='Rechercher une attraction...' 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}

                    />
                </div>
                <section className='collapseContent'>
                    {filteredAttractions.map((attraction) => {

                        const park = parks.find(
                            (park) => park.id_park === attraction.id_park

                        )

                        const isSelected = selectedAttraction.some((item) => item.id_attraction === attraction.id_attraction)

                        return (
                    
                        <article key={attraction.slug_attraction}
                            onClick={() => handleSelect(attraction)}
                            className={isSelected ? 'selected' : ''}
                        >
                            <img src={`http://localhost:3000${attraction.img_attraction}`} alt={attraction.alt_attraction} />
                            <div>
                                <h2>{attraction.name_attraction}</h2>
                                <p>{park?.name_park}</p>
                            </div>
                        </article>
                        )
                    })}
                </section>
                </>
            )}
        </section>
    )
}
export default ComparisonCollapse