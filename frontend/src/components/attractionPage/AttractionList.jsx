import { useState } from "react"
import AttractionCard from "./AttractionCard"

function AttractionList({ attractions, parks }) {

    const [visibleCount, setVisibleCount] = useState(9)

    const handleShowMore = () => {
        setVisibleCount(prev => prev + 9)
    }

    return (
        <>
        <section className='attractionSecCard'>
            <AttractionCard
                parks={parks}
                attractions={attractions.slice(0, visibleCount)}
            />

            {visibleCount < attractions.length && (
                <button onClick={handleShowMore}>
                    Voir plus
                </button>
            )}

        </section>
        </>
    )
}

export default AttractionList