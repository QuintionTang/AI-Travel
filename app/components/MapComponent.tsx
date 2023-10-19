"use client";
import dynamic from "next/dynamic";
const MapContainer = dynamic(() => import("react-leaflet").then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((module) => module.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((module) => module.Popup), { ssr: false });

const MapComponent = ({ points }) => {
    const middleTrip = points[Math.ceil(points.length / 2)];
    return (
        <MapContainer
            {...({ center: middleTrip || [51.505, -0.09], zoom: 4, style: { height: "36vh", width: "100%" } } as any)}>
            <TileLayer
                {...({
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                } as any)}
            />
            {points.map((point, index) => {
                if (!point || point.length !== 2) {
                    return null;
                }
                return (
                    <div key={index}>
                        <Marker
                            {...({
                                position: point,
                            } as any)}>
                            <Popup>{point.join(", ")}</Popup>
                        </Marker>
                    </div>
                );
            })}
        </MapContainer>
    );
};

export default MapComponent;
