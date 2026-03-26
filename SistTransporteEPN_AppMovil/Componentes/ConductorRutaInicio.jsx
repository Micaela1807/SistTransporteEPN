import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapaInteractivo from './MapaInteractivo';

const ConductorRutaInicio = ({ claseContenedor, tituloRuta, textoBoton, onIniciarRuta, paradas }) => {
  const [isActive, setIsActive] = useState(false);

  const handlePress = () => {
    setIsActive(true);
    if (onIniciarRuta) onIniciarRuta();
  };

  return (
    <View style={[styles.contenedor, styles[claseContenedor]]}>
      <View style={styles.maxAncho}>
        <Text style={styles.titulo}>{tituloRuta}</Text>
        <TouchableOpacity style={styles.boton} onPress={handlePress}>
          <Text style={styles.botonTexto}>{textoBoton}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapaContenedor}>
        <MapaInteractivo paradas={paradas} isActive={isActive} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  rutaPersonalizada: {},
  maxAncho: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#001f5b',
  },
  boton: {
    backgroundColor: '#001f5b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapaContenedor: {
    flex: 1,
  },
});

export default ConductorRutaInicio;