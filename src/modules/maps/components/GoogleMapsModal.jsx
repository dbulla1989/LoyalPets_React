import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import "../styles/GoogleMapsModal.css";

function MapPicker({ initialPosition, onLocationChange }) {
  const geocodingLib = useMapsLibrary("geocoding");
  const geocoder = useMemo(
    () => (geocodingLib ? new geocodingLib.Geocoder() : null),
    [geocodingLib]
  );

  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState("");

  // Geocoding: solo se ejecuta si la posición cambia realmente
  useEffect(() => {
    if (!geocoder || !position.lat || !position.lng) return;

    geocoder.geocode({ location: position }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const newAddress = results[0].formatted_address;
        
        // Evitar bucles: solo actualizar si la dirección es distinta
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
  }, [geocoder, position.lat, position.lng]); // Dependencias estables

  // GPS inicial solo al montar el componente
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (res) => {
        setPosition({ lat: res.coords.latitude, lng: res.coords.longitude });
      },
      () => setPosition(initialPosition)
    );
  }, []); 

  const handleIdle = useCallback((ev) => {
    const center = ev.map.getCenter();
    const newLat = center.lat();
    const newLng = center.lng();
    
    // Solo actualizar si el cambio es significativo (evita micro-actualizaciones)
    if (Math.abs(position.lat - newLat) > 0.00001 || Math.abs(position.lng - newLng) > 0.00001) {
      setPosition({ lat: newLat, lng: newLng });
    }
  }, [position.lat, position.lng]);

  return (
    <>
      <div className="google-maps-map-wrapper">
        <Map
          mapId="7c72cac55b1397797f9b70a5"
          defaultZoom={16}
          defaultCenter={initialPosition} // Usar defaultCenter en lugar de center
        //   center={position} // Usamos 'center' controlado en lugar de 'defaultCenter'
          gestureHandling="greedy"
          style={{ width: "100%", height: "100%" }}
          onIdle={handleIdle}
        >
          <AdvancedMarker position={position} />
        </Map>
      </div>

      <div className="google-maps-location-info">
        <p><strong>Dirección:</strong> {address || "Buscando dirección..."}</p>
        <p><strong>Latitud:</strong> {position?.lat.toFixed(6)}</p>
        <p><strong>Longitud:</strong> {position?.lng.toFixed(6)}</p>
      </div>
    </>
  );
}

export default function GoogleMapsModal({
  open,
  onClose,
  onConfirm,
  apiKey,
  initialPosition = { lat: 4.60971, lng: -74.08175 },
}) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Reset al abrir
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
            />
          </APIProvider>
        </div>

        <div className="google-maps-modal-actions">
          <button type="button" className="google-maps-btn google-maps-btn-cancel" onClick={onClose}>
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