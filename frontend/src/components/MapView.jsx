import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow
}
  from "@react-google-maps/api";

import {
  useState
}
  from "react";

import {
  Link
}
  from "react-router-dom";

import "primeicons/primeicons.css";

const containerStyle = {
  width: "100%",
  height: "100%"
};

const center = {
  lat: 10.8505,
  lng: 76.2711
};

const MapView = ({
  events
}) => {

  const [
    selectedEvent,
    setSelectedEvent
  ] = useState(null);

  const [
    mapLoaded,
    setMapLoaded
  ] = useState(false);

  return (

    <div
      className="
                relative
                w-full
                h-full
            "
    >

      {!mapLoaded && (

        <div
          className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                        bg-white
                        z-50
                    "
        >

          <i
            className="
                            pi
                            pi-spinner
                            pi-spin
                            text-4xl
                            text-purple-600
                        "
          />

          <p
            className="
                            mt-4
                            text-gray-500
                            text-sm
                        "
          >
            Loading Map...
          </p>

        </div>

      )}

      <LoadScript
        googleMapsApiKey={
          import.meta.env
            .VITE_GOOGLE_MAPS_API_KEY
        }
      >

        <GoogleMap
          mapContainerStyle={
            containerStyle
          }
          center={center}
          zoom={7}
          onLoad={() =>
            setMapLoaded(true)
          }
        >

          {events.map((event) => {

            const lat =
              event.location
                ?.geo?.lat;

            const lng =
              event.location
                ?.geo?.lng;

            if (
              !lat ||
              !lng
            ) {
              return null;
            }

            return (

              <Marker
                key={
                  event._id
                }
                position={{
                  lat,
                  lng
                }}
                onClick={() =>
                  setSelectedEvent(
                    event
                  )
                }
              />

            );

          })}

          {selectedEvent && (

            <InfoWindow
              position={{
                lat:
                  selectedEvent
                    .location
                    ?.geo
                    ?.lat,
                lng:
                  selectedEvent
                    .location
                    ?.geo
                    ?.lng,
              }}
              onCloseClick={() =>
                setSelectedEvent(
                  null
                )
              }
            >

              <div
                className="
                                    w-64
                                    bg-white
                                    rounded-xl
                                    overflow-hidden
                                "
              >

                <img
                  src={
                    selectedEvent
                      .images?.[0]
                  }
                  alt={
                    selectedEvent.title
                  }
                  className="
                                        w-full
                                        h-32
                                        object-cover
                                    "
                />

                <div
                  className="
                                        p-4
                                    "
                >

                  <h3
                    className="
                                            font-bold
                                            text-lg
                                            mb-2
                                        "
                  >
                    {
                      selectedEvent.title
                    }
                  </h3>

                  <p
                    className="
                                            text-xs
                                            text-gray-500
                                            mb-1
                                        "
                  >
                    📅
                    {" "}
                    {new Date(
                      selectedEvent.date
                    ).toLocaleDateString()}
                  </p>

                  <p
                    className="
                                            text-xs
                                            text-gray-500
                                            mb-3
                                        "
                  >
                    📍
                    {" "}
                    {
                      selectedEvent.location
                        ?.city
                    }
                    ,
                    {" "}
                    {
                      selectedEvent.location
                        ?.state
                    }
                  </p>

                  <Link
                    to={`/event/${selectedEvent._id}`}
                  >

                    <button
                      className="
                                                w-full
                                                bg-purple-600
                                                text-white
                                                py-2
                                                rounded-lg
                                            "
                    >
                      View Event
                    </button>

                  </Link>

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