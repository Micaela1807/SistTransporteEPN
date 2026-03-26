import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EstudianteSeleccionRuta = ({ navigation }) => {
  const [rutas, setRutas] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [selectedRutaId, setSelectedRutaId] = useState(null);
  const [pendingRutaId, setPendingRutaId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("usuario");
        const token = await AsyncStorage.getItem("token");

        if (!storedUser || !token) {
          navigation.navigate("Login");
          return;
        }

        const userData = JSON.parse(storedUser);
        const estudianteId = userData.id;

        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudianteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set the estudiante data and, if available, recover the previously selected route.
        setEstudiante(response.data);
        if (response.data.ruta) {
          setSelectedRutaId(response.data.ruta);
        }
      } catch (error) {
        console.error("Error al obtener datos del estudiante:", error);
        Alert.alert("Error", "No se pudo cargar la información del estudiante.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiante();
  }, [navigation]);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/rutas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRutas(response.data);
      } catch (error) {
        console.error("Error al cargar las rutas:", error);
      }
    };

    fetchRutas();
  }, []);

  const handleRutaClick = (id) => {
    if (!estudiante) {
      Alert.alert("Error", "No se encontró información del estudiante.");
      return;
    }
    // Toggle pending selection.
    setPendingRutaId(pendingRutaId === id ? null : id);
  };

  const handleAccept = async () => {
    if (!pendingRutaId) return;

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudiante.id}/ruta`, 
        { ruta: pendingRutaId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRutaId(pendingRutaId);
      setPendingRutaId(null);
      Alert.alert("Éxito", "Ruta actualizada exitosamente.");
    } catch (error) {
      console.error("Error al actualizar la ruta:", error);
      Alert.alert("Error", "Hubo un problema al actualizar la ruta. Intente nuevamente.");
    }
  };

  const handleRemoveRuta = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudiante.id}/ruta`, 
        { ruta: null }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRutaId(null);
      Alert.alert("Éxito", "Ruta eliminada exitosamente.");
    } catch (error) {
      console.error("Error al eliminar la ruta:", error);
      Alert.alert("Error", "Hubo un problema al eliminar la ruta. Intente nuevamente.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001f5b" />
        <Text>Cargando datos del estudiante...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione su ruta:</Text>
      <ScrollView style={styles.routesContainer}>
        {rutas.map((ruta) => (
          <TouchableOpacity
            key={ruta.id}
            style={[
              styles.routeCard, 
              pendingRutaId === ruta.id 
                ? styles.pending 
                : selectedRutaId === ruta.id 
                  ? styles.selected 
                  : styles.default
            ]}
            onPress={() => handleRutaClick(ruta.id)}
          >
            <Text style={styles.routeName}>{ruta.nombre}</Text>
            {pendingRutaId === ruta.id && (
              <View style={styles.actionButtons}>
                <Button title="Aceptar" onPress={handleAccept} />
                <Button title="Cancelar" onPress={() => setPendingRutaId(null)} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedRutaId && (
        <View style={styles.removeButton}>
          <Button title="Quitar Ruta" onPress={handleRemoveRuta} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  routesContainer: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  routeCard: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  default: {
    backgroundColor: '#c5b6e0',
  },
  pending: {
    backgroundColor: '#FFD700',
  },
  selected: {
    backgroundColor: '#32A94C',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  routeName: {
    fontSize: 16,
  },
  removeButton: {
    width: '100%',
  },
});

export default EstudianteSeleccionRuta;