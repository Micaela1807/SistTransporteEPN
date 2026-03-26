import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Dimensions, 
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Encabezado from '../Componentes/Encabezado';

const { width } = Dimensions.get('window');

const ConductorPantallaInicio = () => {
  const navigation = useNavigation();
  const [conductor, setConductor] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { label: "Iniciar Ruta", link: "ConductorIniciarRuta" },
    { label: "Ver Estado de la Ruta", link: "ConductorRutaCheck" },
  ];

  const mensaje = "Bienvenido al Sistema de Transporte Estudiantil";

  useEffect(() => {
    const fetchConductor = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('usuario');
        const token = await AsyncStorage.getItem('token');

        if (!storedUser || !token) {
          navigation.navigate('Login');
          return;
        }

        const userData = JSON.parse(storedUser);
        const conductorId = userData.id;

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/conductores/${conductorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setConductor(response.data);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información del conductor");
      } finally {
        setLoading(false);
      }
    };

    fetchConductor();
  }, [navigation]);

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
      <ScrollView contentContainerStyle={styles.dashboardScroll}>
        <View style={styles.dashboardContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.mensaje}>{mensaje}</Text>
            <View style={styles.infoContainer}>
              <Image 
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/1464/1464721.png" }}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.textContainer}>
                <Text style={styles.nombre}>{conductor.nombre} {conductor.apellido}</Text>
                <Text style={styles.role}>{conductor.role || "Conductor"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuButton}
                onPress={() => navigation.navigate(item.link)}
              >
                <Text style={styles.menuButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dashboardScroll: {
    flexGrow: 1,
    padding: 20,
  },
  dashboardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mensaje: {
    fontSize: width < 768 ? 24 : 32,
    fontWeight: 'bold',
    color: '#001f5b',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
  },
  icon: {
    width: width < 768 ? 60 : 80,
    height: width < 768 ? 60 : 80,
    borderRadius: (width < 768 ? 60 : 80) / 2,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: 'center',
  },
  nombre: {
    fontSize: width < 768 ? 20 : 26,
    fontWeight: 'bold',
    color: '#001f5b',
  },
  role: {
    fontSize: width < 768 ? 16 : 20,
    color: '#888',
  },
  menuContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    width: '100%',
  },
  menuButton: {
    backgroundColor: '#001f5b',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  menuButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConductorPantallaInicio;