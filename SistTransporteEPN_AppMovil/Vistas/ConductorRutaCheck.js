import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView 
} from "react-native";
import axios from "axios";
import Encabezado from "../Componentes/Encabezado";
import ConductorRutaCheckInicio from "../Componentes/ConductorRutaCheck"; 
import MapaInteractivo from "../Componentes/MapaInteractivo";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConductorRutaCheck = () => {
  const navigation = useNavigation();
  const [conductor, setConductor] = useState(null);
  const [rutaInfo, setRutaInfo] = useState(null);
  const [paradasRecorridas, setParadasRecorridas] = useState([]);
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [loading, setLoading] = useState(true);

  const scrollViewRef = useRef(); // Referencia para ScrollView

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("usuario");
        const token = await AsyncStorage.getItem("token");
        if (!storedUser || !token) {
          console.warn("No hay conductor o token. Redirigiendo al login...");
          navigation.navigate("Login");
          return;
        }

        const userData = JSON.parse(storedUser);
        const conductorId = userData.id;

        const paradasResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/conductores/${conductorId}/paradas`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRutaInfo(paradasResponse.data);

        const conductorResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/conductores/${conductorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConductor(conductorResponse.data);

        const simulacionEnCurso = await AsyncStorage.getItem("simulacionEnCurso");
        if (simulacionEnCurso === "true") {
          setSimulacionActiva(true);
        }
      } catch (error) {
        console.error("Error al cargar la información:", error);
        Alert.alert("Error", "No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigation]);

  // Se llama cuando pasa cerca de una parada
  const handleParadaRecorrida = (nombreParada) => {
    setParadasRecorridas((prev) => {
      if (!prev.includes(nombreParada)) {
        const nuevasParadas = [...prev, nombreParada];

        // Asegurar que se haga scroll al final
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);

        return nuevasParadas;
      }
      return prev;
    });
  };

  const detenerRuta = async () => {
    try {
      await AsyncStorage.removeItem("simulacionEnCurso");
      await AsyncStorage.removeItem("paradaActual");
      setSimulacionActiva(false);
      setParadasRecorridas([]);
      Alert.alert("Ruta detenida", "La ruta ha sido detenida.");
      navigation.navigate("ConductorIniciarRuta");
    } catch (err) {
      console.error("Error al detener la ruta:", err);
    }
  };

  useEffect(() => {
    if (rutaInfo?.paradas?.length && paradasRecorridas.length === rutaInfo.paradas.length) {
      Alert.alert("Fin de la ruta", "Se han recorrido todas las paradas.");
      detenerRuta();
    }
  }, [paradasRecorridas, rutaInfo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001f5b" />
        <Text>Cargando datos de la ruta...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Encabezado />
      {conductor && rutaInfo && conductor.rutaData ? (
        <View style={styles.content}>
          <MapaInteractivo
            paradas={rutaInfo.paradas}
            onParadaRecorrida={handleParadaRecorrida}
            isActive={simulacionActiva}
          />
          <ScrollView 
            ref={scrollViewRef} 
            style={styles.scrollView} 
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <ConductorRutaCheckInicio
              titulo={conductor.rutaData.nombre}
              paradas={paradasRecorridas}
              onBotonClick={detenerRuta}
            />
          </ScrollView>
        </View>
      ) : (
        <Text>No se pudo cargar la información de la ruta</Text>
      )}
    </View>
  );
};

export default ConductorRutaCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
});
