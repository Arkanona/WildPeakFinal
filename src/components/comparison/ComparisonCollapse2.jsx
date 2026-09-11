import '../../styles/comparisonCollapse.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


function ComparisonCollapse2({datas}){
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
        <section className='comparator'>
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
                        id='searchInput'
                        placeholder='Rechercher une attraction...' 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}

                    />
                </div>
                <section className='allArticles'>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    <article>
                        <img src="../assets/AvengersAssemble.png" alt="" />
                        <div>
                            <h2>Avengers Assemble: Flight Force</h2>
                            <p>Disneyland Paris</p>
                        </div>
                    </article>
                    
                </section>
                </>
            )}

        </section>
    )
}
export default ComparisonCollapse2