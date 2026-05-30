import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, X } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 10.8505,
  lng: 76.2711,
};

const mapStyles = [
  { featureType: "all", elementType: "geometry.fill", stylers: [{ weight: "2.00" }] },
  { featureType: "all", elementType: "geometry.stroke", stylers: [{ color: "#9c9c9c" }] },
  { featureType: "all", elementType: "labels.text", stylers: [{ visibility: "on" }] },
  { featureType: "landscape", elementType: "all", stylers: [{ color: "#f2f2f2" }] },
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#f6f4f0" }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#f0ede8" }] },
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "all", stylers: [{ saturation: -100 }, { lightness: 45 }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7b7b7b" }] },
  { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { lightness: 16 }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dedede" }] },
  { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "all", stylers: [{ color: "#c8d7e6" }, { visibility: "on" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#bdd4e4" }] },
];

const MapView = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-50 gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading Map...</p>
        </div>
      )}

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={() => setMapLoaded(true)}
          options={{
            styles: mapStyles,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          }}
        >
          {events.map((event) => {
            const lat = event.location?.geo?.lat;
            const lng = event.location?.geo?.lng;
            if (!lat || !lng) return null;

            return (
              <Marker
                key={event._id}
                position={{ lat, lng }}
                onClick={() => setSelectedEvent(event)}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                  fillColor: selectedEvent?._id === event._id ? "#7c3aed" : "#9333ea",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                  scale: selectedEvent?._id === event._id ? 2 : 1.6,
                  anchor: { x: 12, y: 22 },
                }}
              />
            );
          })}

          {selectedEvent && (
            <InfoWindow
              position={{
                lat: selectedEvent.location?.geo?.lat,
                lng: selectedEvent.location?.geo?.lng,
              }}
              onCloseClick={() => setSelectedEvent(null)}
              options={{ pixelOffset: { width: 0, height: -40 } }}
            >
              <div className="w-60 bg-white rounded-xl overflow-hidden" style={{ fontFamily: "inherit" }}>
                <div className="relative h-32">
                  <img
                    src={selectedEvent.images?.[0] || `https://picsum.photos/seed/${selectedEvent._id}/300/150`}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {selectedEvent.price === 0 && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">FREE</span>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                    {selectedEvent.title}
                  </h3>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={10} className="text-purple-500 shrink-0" />
                      {new Date(selectedEvent.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={10} className="text-purple-500 shrink-0" />
                      {selectedEvent.location?.city}, {selectedEvent.location?.state}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-purple-600 text-sm">
                      {selectedEvent.price === 0 ? "Free" : `₹${selectedEvent.price}`}
                    </span>
                    <Link to={`/event/${selectedEvent._id}`}>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        View →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapView;