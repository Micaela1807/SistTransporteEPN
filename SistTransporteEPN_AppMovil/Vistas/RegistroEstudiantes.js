import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RegistroEstudiante from '../Componentes/RegistroEstudiante';

const RegistroEstudiantes = () => {
  const navigation = useNavigation();
  const [successMessage, setSuccessMessage] = useState('');

  const handleStudentRegistration = async (data) => {
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/estudiantes`, 
        data
      );

      setSuccessMessage('Estudiante registrado exitosamente!');
      
      setTimeout(() => {
        setSuccessMessage('');
        navigation.navigate('Login'); // Asume que tienes una pantalla llamada 'Login'
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Hubo un error al registrar al estudiante'
      );
    }
  };

  return (
    <View style={styles.container}>
      {successMessage && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
      
      <RegistroEstudiante onSubmit={handleStudentRegistration} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  successContainer: {
    backgroundColor: '#d4edda',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  successText: {
    color: '#155724',
    textAlign: 'center',
  },
});

export default RegistroEstudiantes;