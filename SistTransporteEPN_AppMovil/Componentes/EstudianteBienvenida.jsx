import React from "react";
import {Text, View, StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get('window');

const EstudianteBienvenida = () => {
  return (
    <View>
      <Text style={styles.mensaje}>¡Aquí podrás ver el detalle de las rutas de los Polibuses y seguir su recorrido!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mensaje: {
    fontSize: width < 768 ? 16 : 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 70,
    justifyContent: 'center',
  },
});
export default EstudianteBienvenida;