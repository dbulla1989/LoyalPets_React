import React, { useEffect, useMemo, useState, useCallback } from "react";
import apiService from "../../core/resources/GlobalResource";
import {
  APIProvider,
  Map,
  InfoWindow,
  AdvancedMarker,
  useMapsLibrary,
  MapControl,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import "../styles/GoogleMapsModal.css";

function MapPicker({
  initialPosition,
  onLocationChange,
  mode = "free",
  onClinicSelect,
}) {
  const geocodingLib = useMapsLibrary("geocoding");
  const geocoder = useMemo(
    () => (geocodingLib ? new geocodingLib.Geocoder() : null),
    [geocodingLib],
  );

  const [veterinaries, setVeterinaries] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState("");
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    const fetchVeterinaries = async () => {
      try {
        const response = await apiService.get("api/veterinary/all");
        if (response.status === 200) {
          setVeterinaries(response.data);
        }
      } catch (err) {
        console.error("Error al cargar veterinarias:", err);
      }
    };
    fetchVeterinaries();
  }, []);

  useEffect(() => {
    if (mode !== "free") return;
    if (!geocoder || position?.lat == null || position?.lng == null) return;

    geocoder.geocode({ location: position }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const newAddress = results[0].formatted_address;
        if (address !== newAddress) {
          setAddress(newAddress);
          onLocationChange?.({
            lat: position.lat,
            lng: position.lng,
            address: newAddress,
          });
        }
      }
    });
  }, [geocoder, position, mode, address, onLocationChange]);

  useEffect(() => {
    if (mode !== "free") return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (res) => {
        setPosition({
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        });
      },
      () => setPosition(initialPosition),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [mode, initialPosition]);

  const handleIdle = useCallback(
    (ev) => {
      if (mode !== "free") return;

      const center = ev.map.getCenter();
      if (!center) return;

      const newLat = center.lat();
      const newLng = center.lng();

      setPosition({ lat: newLat, lng: newLng });
    },
    [mode],
  );

  const handleMarkerClick = (v) => {
    if (mode !== "select-existing") return;

    setSelectedClinic(v);
    onClinicSelect?.(v);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (res) => {
        const coords = {
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        };

        setPosition(coords);

        if (mapRef) {
          mapRef.setCenter(coords);
          mapRef.setZoom(16);
        }

        if (mode === "free") {
          setAddress("");
          onLocationChange?.({
            ...coords,
            address: "Ubicación actual",
          });
        } else {
          onLocationChange?.(coords);
        }
      },
      (err) => {
        console.error("No se pudo obtener la ubicación:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <>
      <div className="google-maps-map-wrapper">
        <Map
          mapId="7c72cac55b1397797f9b70a5"
          defaultZoom={16}
          defaultCenter={initialPosition}
          gestureHandling="greedy"
          style={{ width: "100%", height: "100%" }}
          onIdle={handleIdle}
        >

          <GeolocateControl
            mode={mode}
            onGeolocate={(coords) => {
              setPosition(coords);

              if (mode === "free") {
                setAddress("");
                onLocationChange?.({
                  ...coords,
                  address: "Ubicación actual",
                });
              } else {
                onLocationChange?.(coords);
              }
            }}
          />

          {mode === "free" && <div />}

          {mode === "select-existing" &&
            veterinaries.map((v) => (
              <React.Fragment key={v.id}>
                <AdvancedMarker
                  position={{
                    lat: Number(v.latitude),
                    lng: Number(v.longitude),
                  }}
                  onClick={() => handleMarkerClick(v)}
                />

                {selectedClinic?.id === v.id && (
                  <InfoWindow
                    position={{
                      lat: Number(v.latitude),
                      lng: Number(v.longitude),
                    }}
                    onCloseClick={() => setSelectedClinic(null)}
                  >
                    <div className="clinic-info-window">
                      <h4>{v.name}</h4>
                      <p>
                        <strong>Dir:</strong> {v.address}
                      </p>
                      <p>
                        <strong>Tel:</strong> {v.officePhone}
                      </p>
                      <p>
                        <strong>Cel:</strong> {v.cellPhone}
                      </p>
                      <p>
                        <strong>Calificación:</strong> {v.rating} ⭐
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            ))}
        </Map>

        {mode === "free" && <div className="map-center-pin" />}
      </div>

      <div className="google-maps-location-info">
        {mode === "free" ? (
          <>
            <p>
              <strong>Dirección:</strong> {address || "Buscando dirección..."}
            </p>
            <p>
              <strong>Latitud:</strong> {position?.lat.toFixed(6)}
            </p>
            <p>
              <strong>Longitud:</strong> {position?.lng.toFixed(6)}
            </p>
          </>
        ) : selectedClinic ? (
          <>
            <p>
              <strong>Nombre:</strong> {selectedClinic.name}
            </p>
            <p>
              <strong>Dirección:</strong> {selectedClinic.address}
            </p>
            <p>
              <strong>Tel:</strong> {selectedClinic.officePhone}
            </p>
            <p>
              <strong>Cel:</strong> {selectedClinic.cellPhone}
            </p>
            <p>
              <strong>Latitud:</strong> {selectedClinic.latitude}
            </p>
            <p>
              <strong>Longitud:</strong> {selectedClinic.longitude}
            </p>
          </>
        ) : (
          <p>Selecciona una veterinaria del mapa.</p>
        )}
      </div>
    </>
  );
}

function GeolocateControl({ mode, onGeolocate }) {
  const map = useMap();

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        const coords = {
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        };

        if (map) {
          map.setCenter(coords);
          map.setZoom(16);
        }

        onGeolocate?.(coords);
      },
      (err) => {
        console.error("No se pudo obtener la ubicación:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <MapControl position={ControlPosition.INLINE_END_BLOCK_START}>
      <button
        type="button"
        className="google-maps-geolocate-control"
        onClick={handleClick}
        aria-label="Mi ubicación"
        title="Mi ubicación"
      >
        <span className="material-symbols-outlined">my_location</span>
      </button>
    </MapControl>
  );
}

export default function GoogleMapsModal({
  open,
  onClose,
  onConfirm,
  apiKey,
  initialPosition = { lat: 4.60971, lng: -74.08175 },
  mode = "free",
}) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (open) setSelectedLocation(null);
  }, [open]);

  if (!open) return null;

  return (
    <div className="google-maps-modal-overlay">
      <div className="google-maps-modal">
        <div className="google-maps-modal-header">
          <h3 className="google-maps-modal-title">Selecciona la ubicación</h3>
        </div>

        <div className="google-maps-modal-body">
          <APIProvider apiKey={apiKey}>
            <MapPicker
              initialPosition={initialPosition}
              onLocationChange={setSelectedLocation}
              mode={mode}
              onClinicSelect={setSelectedLocation}
            />
          </APIProvider>
        </div>

        <div className="google-maps-modal-actions">
          <button
            type="button"
            className="google-maps-btn google-maps-btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="google-maps-btn google-maps-btn-confirm"
            onClick={() => onConfirm?.(selectedLocation)}
            disabled={!selectedLocation}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
