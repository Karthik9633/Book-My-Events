import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import { useState } from "react";
import "primeicons/primeicons.css"; // ✅ make sure this is imported

const containerStyle = {
  width: "100%",
  height: "100%"
};

const center = {
  lat: 9.9312,
  lng: 76.2673
};

const MapView = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // ✅ loading state

  return (
    <div className="relative w-full h-full">

      {/* 🔥 PREMIUM SPINNER OVERLAY */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50">
          <i className="pi pi-spinner pi-spin text-4xl text-purple-600"></i>
          <p className="mt-4 text-gray-500 text-sm">Loading Map...</p>
        </div>
      )}

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={() => setMapLoaded(true)} // ✅ hide spinner when loaded
        >
          {events.map((event) => (
            <Marker
              key={event.id}
              position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setSelectedEvent(event)}
              label={{
                text: event.title,
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
              }}
            />
          ))}

          {selectedEvent && (
            <InfoWindow
              position={{
                lat: selectedEvent.lat,
                lng: selectedEvent.lng
              }}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <div className="w-64 bg-white rounded-xl overflow-hidden shadow-lg">

                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-32 object-cover"
                />

                <div className="p-4">

                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {selectedEvent.title}
                  </h3>

                  <p className="text-xs text-gray-500 mb-1">
                    📅 {selectedEvent.date}
                  </p>

                  <p className="text-xs text-gray-500 mb-2">
                    📍 {selectedEvent.location}
                  </p>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedEvent.lat},${selectedEvent.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Open in Google Maps
                  </a>

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