import { Icon } from "leaflet";
import React from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
const ShowMap = ({ coordsDest, coordsSource }) => {
  const SetViewOnLocationChange = () => {
    const map = useMap();
    map.flyTo(coordsSource, 13);
    return null;
  };
  const line = [coordsSource, coordsDest];
  const redOptions = { color: "red" };
  const markers = [
    {
      geocode: coordsSource,
      icon: new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/2776/2776067.png",
        iconSize: [38, 38],
      }),
    },
    {
      geocode: coordsDest,
      icon: new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/819/819814.png",
        iconSize: [38, 38],
      }),
    },
  ];
  return (
    <MapContainer
      center={coordsSource}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline pathOptions={redOptions} positions={line} />
      {markers.map((marker, index) => {
        return (
          <Marker
            icon={marker.icon}
            key={index}
            position={marker.geocode}
          ></Marker>
        );
      })}
      <SetViewOnLocationChange />
    </MapContainer>
  );
};
const MemoisedShowMap = React.memo(ShowMap);
export default MemoisedShowMap;
