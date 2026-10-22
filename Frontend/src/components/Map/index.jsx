
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapClickHandler({ selection, onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect(selection, [
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return null;
}

function FitRoute({ route, pickup, destination }) {
  const map = useMap();

  useEffect(() => {
    if (route?.coordinates?.length > 0) {
      map.fitBounds(route.coordinates, {
        padding: [35, 35],
      });
    } else if (pickup && destination) {
      map.fitBounds([pickup, destination], {
        padding: [35, 35],
      });
    } else if (pickup) {
      map.setView(pickup, 14);
    } else if (destination) {
      map.setView(destination, 14);
    }
  }, [map, route, pickup, destination]);

  return null;
}

export default function MapComponent({
  pickup,
  destination,
  selection,
  onLocationSelect,
  route,
}) {
  return (
    <MapContainer
      center={[30.129, 77.267]}
      zoom={13}
      scrollWheelZoom
      style={{
        height: "100%",
        minHeight: "350px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler
        selection={selection}
        onLocationSelect={onLocationSelect}
      />

      <FitRoute
        route={route}
        pickup={pickup}
        destination={destination}
      />

      {pickup && (
        <Marker position={pickup}>
          <Popup>Pickup location</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {route?.coordinates?.length > 0 && (
        <Polyline
          positions={route.coordinates}
          pathOptions={{
            color: "#198754",
            weight: 5,
            opacity: 0.85,
          }}
        />
      )}
    </MapContainer>
  );
}