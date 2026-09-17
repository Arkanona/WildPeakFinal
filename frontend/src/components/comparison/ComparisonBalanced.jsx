import '../../styles/comparison/comparisonCollapse.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons'
import ComparisonTable from './ComparisonTable'


function ComparisonBalanced({ selectedAttraction = [], parks = [] }) {

    return (
        <section className='secBalanced'>

            {selectedAttraction.length === 0 && (
                <div className='divBalanced'>
                    <span>
                        <FontAwesomeIcon icon={faScaleBalanced} />
                    </span>

                    <h2>
                        Sélectionnez minimum 2 attractions pour comparer
                    </h2>

                    <p>
                        Sélectionnez 2 à 4 attractions dans le menu déroulant
                        <br />
                        ci-dessus et comparez leurs caractéristiques.
                    </p>
                </div>
            )}


            {selectedAttraction.length === 1 && (
                <div className='divBalanced'>
                    <span>
                        <FontAwesomeIcon icon={faScaleBalanced} />
                    </span>

                    <h2>
                        Sélectionnez encore une attraction pour comparer
                    </h2>

                    <p>
                        Une attraction est déjà sélectionnée.
                        Choisissez-en une autre pour afficher la comparaison.
                    </p>
                </div>
            )}


            {selectedAttraction.length >= 2 && (
                <ComparisonTable
                    selectedAttraction={selectedAttraction}
                    parks={parks}
                />
            )}

        </section>
    )
}

export default ComparisonBalanced