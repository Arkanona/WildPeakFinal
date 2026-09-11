import '../../styles/comparisonCollapse.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


function ComparisonCollapse({datas}){

    const [visibleCol, setVisibleCol] = useState(false);
    const [search, setSearch] = useState("")

    const attractions = datas.flatMap((park) => 
        park.attractions.map((attraction) => ({
            ...attraction,
            parc: park.parc
        })))

    const filteredAttractions = attractions.filter((attraction) =>
        attraction.nom.toLowerCase().includes(search.toLowerCase()) ||
        attraction.parc.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <section className='secCollapse'>
            <button onClick={() => setVisibleCol(!visibleCol)}>
                <span>Selectionner des attractions à comparer...</span>
                <div>
                    <span>0/4Test</span>
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
                    {filteredAttractions.map((attraction) => (
                    <article key={attraction.slug}>
                        <img src={attraction.img} alt={attraction.nom} />
                        <div>
                            <h2>{attraction.nom}</h2>
                            <p>{attraction.parc}</p>
                        </div>
                    </article>
                    ))}
                </section>
                </>
            )}
        </section>
    )
}
export default ComparisonCollapse