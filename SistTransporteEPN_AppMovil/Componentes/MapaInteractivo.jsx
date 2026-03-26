import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Alert, Text, Image } from "react-native";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";

const defaultIcon = { uri: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" };
const busIcon = { uri: "https://img.freepik.com/vector-gratis/etiqueta-engomada-historieta-autobus-escolar-fondo-blanco_1308-76579.jpg" };
const visitedIcon = { uri: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" };

const MapaInteractivo = ({ paradas, onParadaRecorrida, isActive }) => {
  const mapRef = useRef(null);
  const [rutaOptima, setRutaOptima] = useState([]);
  const [posicionBus, setPosicionBus] = useState(null);
  const [indiceRuta, setIndiceRuta] = useState(0);
  const [paradasRecorridas, setParadasRecorridas] = useState([]);
  const [centrado, setCentrado] = useState(false);

  // Obtener la ruta óptima desde el backend
  useEffect(() => {
    if (paradas && paradas.length > 0) {
      const coordsParaRutaOptima = paradas.map((p) => [
        parseFloat(p.longitud),
        parseFloat(p.latitud),
      ]);
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      fetch(`${API_URL}/rutas/optima`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coordenadas: coordsParaRutaOptima }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.length > 0) {
            setRutaOptima(data);
            setPosicionBus({ lat: data[0][1], lng: data[0][0] });
            setIndiceRuta(0);
            if (!centrado && mapRef.current) {
              const coordinates = data.map(([lng, lat]) => ({
                latitude: lat,
                longitude: lng,
              }));
              mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
              });
              setCentrado(true);
            }
          } else {
            console.warn("La respuesta del backend está vacía.");
          }
        })
        .catch((error) =>
          console.error("Error al cargar la ruta óptima:", error)
        );
    }
  }, [paradas, centrado]);

  const polylineRutaOptima =
    rutaOptima.length > 0
      ? rutaOptima.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
      : paradas.map((p) => ({
          latitude: parseFloat(p.latitud),
          longitude: parseFloat(p.longitud),
        }));

  // Animar el bus a lo largo de la ruta óptima
  useEffect(() => {
    if (!isActive || rutaOptima.length <= 1) return;
    const start = rutaOptima[indiceRuta];
    const end = rutaOptima[indiceRuta + 1];
    if (!start || !end) return;
    const startTime = Date.now();
    const duracion = calcularDuracion(start, end);
    let reqId;
    const animarBus = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duracion, 1);
      const lat = start[1] + (end[1] - start[1]) * progress;
      const lng = start[0] + (end[0] - start[0]) * progress;
      setPosicionBus({ lat, lng });
      if (progress < 1) {
        reqId = requestAnimationFrame(animarBus);
      } else {
        if (indiceRuta < rutaOptima.length - 2) {
          setIndiceRuta(indiceRuta + 1);
        }
        verificarParadasRecorridas({ lat, lng });
      }
    };
    reqId = requestAnimationFrame(animarBus);
    return () => cancelAnimationFrame(reqId);
  }, [isActive, indiceRuta, rutaOptima]);

  const verificarParadasRecorridas = (posBus) => {
    paradas.forEach((parada) => {
      const dist = calcularDistancia(
        posBus.lat,
        posBus.lng,
        parseFloat(parada.latitud),
        parseFloat(parada.longitud)
      );
      if (dist < 30 && !paradasRecorridas.includes(parada.id)) {
        setParadasRecorridas((prev) => [...prev, parada.id]);
        if (onParadaRecorrida) {
          onParadaRecorrida(parada.nombre);
        }
      }
    });
  };

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {polylineRutaOptima.length > 1 && (
        <Polyline
          coordinates={polylineRutaOptima}
          strokeColor="blue"
          strokeWidth={3}
        />
      )}
      {paradas.map((parada) => {
        const yaVisitada = paradasRecorridas.includes(parada.id);
        return (
          <Marker
            key={parada.id}
            coordinate={{
              latitude: parseFloat(parada.latitud),
              longitude: parseFloat(parada.longitud),
            }}
            image={yaVisitada ? visitedIcon : defaultIcon}
          >
            <Callout>
              <View>
                <Text>{parada.nombre}</Text>
              </View>
            </Callout>
          </Marker>
        );
      })}
      {/* Mostrar el marcador del bus solo cuando la simulación esté activa y usando un icono reducido */}
      {posicionBus && isActive && (
        <Marker
          coordinate={{
            latitude: posicionBus.lat,
            longitude: posicionBus.lng,
          }}
        >
          <View style={styles.busMarker}>
            <Image source={busIcon} style={styles.busImage} />
          </View>
          <Callout>
            <View>
              <Text>🚌 Bus en movimiento</Text>
            </View>
          </Callout>
        </Marker>
      )}
    </MapView>
  );
};

function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calcularDuracion(start, end) {
  const distancia = calcularDistancia(start[1], start[0], end[1], end[0]);
  const velocidad = 400; 
  return (distancia / velocidad) * 1000;
}

export default MapaInteractivo;

const styles = StyleSheet.create({
  map: {
    height: 400,
    width: "100%",
  },
  busMarker: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  busImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});