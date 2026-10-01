import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

const markerSvg = icon(faLocationDot).html.join("");

const customIcon = L.divIcon({
  html: markerSvg,
  className: "customMarker",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function ContactLocation() {
    const position = [43.4057, 6.0616];

    return (
        <div className="contactLocation">
            <h2>Notre localisation</h2>
            <MapContainer center={position} zoom={9} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={position} icon={customIcon}>
                <Tooltip permanent direction="right" offset={[10, 0]}>
                    <strong>Brignoles</strong>
                    <br />
                    France
                </Tooltip>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default ContactLocation