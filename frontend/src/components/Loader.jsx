
import '../styles/loader.scss'

const TRACK_PATH =
    'M180 103 C132 20 55 28 55 103 C55 178 132 186 180 103 C228 20 305 28 305 103 C305 178 228 186 180 103 Z'

function Loader() {
    return (
        <div
            className="loader"
            role="status"
            aria-label="Chargement en cours"
        >
            <div className="loaderContent">

                <h2>WILDPEAK</h2>

                <div className="infiniteCoaster">
                    <svg
                        viewBox="0 0 360 220"
                        aria-hidden="true"
                    >
                        {/* Piliers de soutien */}
                        <path
                            className="support"
                            d="
                                M92 161 L80 202
                                M132 154 L120 202
                                M228 154 L240 202
                                M268 161 L280 202
                            "
                        />

                        {/* Structure extérieure des rails */}
                        <path
                            className="trackOuter"
                            d={TRACK_PATH}
                        />

                        {/* Rails rouges */}
                        <path
                            className="trackMain"
                            d={TRACK_PATH}
                        />

                        {/* Marquages des rails */}
                        <path
                            className="trackMarkings"
                            d={TRACK_PATH}
                        />

                        {/* Sol */}
                        <path
                            className="ground"
                            d="M50 202 H310"
                        />
                    </svg>

                    {/* Wagons animés */}
                    {['front', 'middle', 'rear'].map((car) => (
                        <div
                            key={car}
                            className={`coasterWagon coasterWagon--${car}`}
                            aria-hidden="true"
                        >
                            <div className="wagonBody">
                                <span className="wagonWindow" />
                            </div>

                            <span className="wagonWheel wagonWheel--left" />
                            <span className="wagonWheel wagonWheel--right" />
                        </div>
                    ))}
                </div>

                <p>Votre aventure se prépare...</p>

                <div className="loadingDots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>

            </div>
        </div>
    )
}

export default Loader
