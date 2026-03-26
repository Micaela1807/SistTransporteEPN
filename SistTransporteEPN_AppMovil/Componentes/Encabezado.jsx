import React from 'react';
import PropTypes from 'prop-types';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Encabezado = ({ logoSrc, text }) => {
  const navigation = useNavigation();
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuario');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Image 
          source={{ uri: logoSrc }} 
          style={styles.logo} 
          resizeMode="contain"
        />
        

        <Text style={styles.text}>{text}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  logo: {
    width: 125,
    height: 50,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001f5b',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  button: {
    padding: 5,
  },
  icon: {
    width: 35,
    height: 35,
  },
});

Encabezado.defaultProps = {
  logoSrc: 'https://ici2st.epn.edu.ec/eventosAnteriores/ICI2ST2023/images/ici2st2023/Logo_EPN.png',
  text: 'SISTEMA DE TRANSPORTE ESTUDIANTIL',
};

Encabezado.propTypes = {
  logoSrc: PropTypes.string,
  text: PropTypes.string,
};

export default Encabezado;