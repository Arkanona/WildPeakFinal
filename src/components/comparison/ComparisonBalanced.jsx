import '../../styles/comparisonCollapse.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons';



function ComparisonBalanced(){

    return(
        <>
        <section className='secBalanced'>
            <div className='divBalanced'>
                <span><FontAwesomeIcon icon={faScaleBalanced} /></span>
                <h2>Sélectionnez minimum 2 attractions pour comparer</h2>
                <p>Sélectionnez 2 à 4 attractions dans le menu déroulant <br />ci-dessus et comparez leurs caractéristiques.</p>
            </div>
        </section>
        </>
    )
}
export default ComparisonBalanced