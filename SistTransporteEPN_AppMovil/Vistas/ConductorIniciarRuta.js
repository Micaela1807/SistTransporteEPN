import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Alert
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Encabezado from "../Componentes/Encabezado";
import ConductorRutaInicio from "../Componentes/ConductorRutaInicio";
import { useNavigation } from "@react-navigation/native";

const ConductorIniciarRuta = () => {
  const navigation = useNavigation();
  const [conductor, setConductor] = useState(null);
  const [paradas, setParadas] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { label: "Inicio", link: "ConductorInicio" },
    { label: "Iniciar Ruta", link: "ConductorIniciarRuta" },
    { label: "Ver Estado de la Ruta", link: "ConductorRutaCheck" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("usuario");
        const token = await AsyncStorage.getItem("token");
        if (!storedUser || !token) {
          console.warn("No hay conductor o token en AsyncStorage. Redirigiendo al login...");
          navigation.navigate("Login");
          return;
        }

        const userData = JSON.parse(storedUser);
        const conductorId = userData.id;

        // Obtener paradas de la ruta
        const paradasResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/conductores/${conductorId}/paradas`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (paradasResponse.data && Array.isArray(paradasResponse.data.paradas)) {
          setParadas(paradasResponse.data.paradas);
        } else {
          console.error("La respuesta no contiene un array de paradas:", paradasResponse.data);
          setParadas([]);
        }

        // Obtener datos del conductor
        const conductorResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/conductores/${conductorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConductor(conductorResponse.data);
      } catch (error) {
        console.error("Error al cargar los datos del conductor o paradas:", error);
        Alert.alert("Error", "No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  const iniciarSimulacion = async () => {
    try {
      await AsyncStorage.setItem("simulacionEnCurso", "true");
      await AsyncStorage.setItem("paradaActual", "0");
      navigation.navigate("ConductorRutaCheck");
    } catch (err) {
      console.error("Error al iniciar la simulación:", err);
    }
  };

  const tituloRuta = conductor?.rutaData
    ? `RUTA: ${conductor.rutaData.nombre}`
    : "RUTA DESCONOCIDA";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001f5b" />
        <Text>Cargando datos del conductor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Encabezado />
      <View style={styles.content}>
        <ConductorRutaInicio
          claseContenedor="ruta-personalizada"
          tituloRuta={tituloRuta}
          textoBoton="Comenzar"
          onIniciarRuta={iniciarSimulacion}
          paradas={paradas}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConductorIniciarRuta;