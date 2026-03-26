import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import Encabezado from '../Componentes/Encabezado';
import MapaInteractivo from '../Componentes/MapaInteractivo';

const socket = io(`${process.env.EXPO_PUBLIC_API_URL}`);

const EstudianteRutaCheck = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [paradas, setParadas] = useState([]);
  const [rutaId, setRutaId] = useState(null);
  const [simulacionActiva, setSimulacionActiva] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      const storedUser = await AsyncStorage.getItem('usuario');
      const token = await AsyncStorage.getItem('token');
      if (!storedUser || !token) {
        console.warn('No hay estudiante o token en AsyncStorage. Redirigiendo...');
        return;
      }
      const userData = JSON.parse(storedUser);
      const estudianteId = userData.id;

      try {
        const estudianteRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudianteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const estudianteData = await estudianteRes.json();
        setEstudiante(estudianteData);
        setRutaId(estudianteData.ruta);
      } catch (error) {
        console.error('Error al cargar los datos del estudiante:', error);
      }

      try {
        const paradasRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudianteId}/paradas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paradasData = await paradasRes.json();
        setParadas(paradasData);
      } catch (error) {
        console.error('Error al cargar las paradas del estudiante:', error);
      }
    };
    obtenerDatos();
  }, []);

  useEffect(() => {
    if (rutaId) {
      socket.on(`ruta-${rutaId}`, (data) => {
        console.log('📡 Actualización en ruta:', data);
        setParadas(data.paradasRecorridas);
      });

      socket.on(`ruta-${rutaId}-finalizada`, () => {
        Alert.alert('🚏 La ruta ha finalizado.');
        AsyncStorage.setItem('simulacionEnCurso', 'false');
        setSimulacionActiva(false);
      });

      return () => {
        socket.off(`ruta-${rutaId}`);
        socket.off(`ruta-${rutaId}-finalizada`);
      };
    }
  }, [rutaId]);

  useEffect(() => {
    const checkSimulacion = async () => {
      const simulacion = await AsyncStorage.getItem('simulacionEnCurso');
      setSimulacionActiva(simulacion === 'true');
    };
    checkSimulacion();
  }, []);

  return (
    <View style={styles.container}>
      <Encabezado />
      <View style={styles.content}>
        <View style={styles.mapContainer}>
          <Text style={styles.title}>SIGA EL ESTADO DE LA RUTA</Text>
          <MapaInteractivo paradas={paradas} isActive={simulacionActiva} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    padding: 10,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default EstudianteRutaCheck;
