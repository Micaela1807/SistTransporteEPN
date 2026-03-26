import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const ConductorRutaCheck = ({ titulo, claseContenedor, paradas, onBotonClick }) => {
  return (
    <View style={[styles.container, styles[claseContenedor]]}>
      <Text style={styles.titulo}>{titulo}</Text>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>¡Paradas por las que ya pasó!</Text>
        <ScrollView style={styles.paradasContainer}>
          {paradas.map((parada, index) => (
            <View key={index} style={styles.parada}>
              <Text>{parada}</Text>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/8215/8215539.png" }}
                style={styles.iconoParada}
              />
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.botonDetener} onPress={onBotonClick}>
          <Text style={styles.botonDetenerTexto}>Detener Ruta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConductorRutaCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  paradasContainer: {
    marginBottom: 16,
  },
  parada: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconoParada: {
    width: 24,
    height: 24,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  botonDetener: {
    backgroundColor: '#d9534f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  botonDetenerTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});