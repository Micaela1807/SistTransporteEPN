import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView } from 'react-native';

const { width, height } = Dimensions.get('window');

const ConductorBienvenida = ({ mensaje, conductorName, conductorRole, conductorIcon }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mensaje}>{mensaje}</Text>
      <View style={styles.infoContainer}>
        <Image 
          source={typeof conductorIcon === 'string' ? { uri: conductorIcon } : conductorIcon} 
          style={styles.icon}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.nombre}>{conductorName}</Text>
          <Text style={styles.role}>{conductorRole}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

ConductorBienvenida.propTypes = {
  mensaje: PropTypes.string.isRequired,
  conductorName: PropTypes.string.isRequired,
  conductorRole: PropTypes.string.isRequired,
  conductorIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center'
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
  }
});

export default ConductorBienvenida;