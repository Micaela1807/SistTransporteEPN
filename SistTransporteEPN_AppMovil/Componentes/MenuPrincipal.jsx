import React from 'react';
import PropTypes from 'prop-types';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
// Calcula un ancho responsivo: 15% de ancho en pantallas grandes o mínimo 200px en tablet/desktop; en móviles se ocupa 90% del ancho.
const containerWidth = width < 768 ? width * 0.9 : Math.max(width * 0.15, 200);

const BarraLateral = ({ userName, userRole, userIcon, menuItems }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleNavigation = (item) => {
    if (item.label === 'Inicio') {
      // Navegación basada en rol
      switch(userRole) {
        case 'Administrador':
          navigation.navigate('AdminInicio');
          break;
        case 'Conductor':
          navigation.navigate('ConductorInicio');
          break;
        case 'Estudiante':
          navigation.navigate('EstudianteInicio');
          break;
        default:
          navigation.navigate('Home');
      }
    } else {
      navigation.navigate(item.link);
    }
  };

  const isActive = (item) => {
    if (item.label === 'Inicio') {
      return [
        'AdminInicio',
        'ConductorInicio',
        'EstudianteInicio'
      ].includes(route.name);
    }
    return route.name === item.link;
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.header}>
        <Image 
          source={typeof userIcon === 'string' ? { uri: userIcon } : userIcon} 
          style={styles.icon} 
        />
        <View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.role}>{userRole}</Text>
        </View>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index > 0 && styles.menuItemBorder,
              isActive(item) && styles.activeItem
            ]}
            onPress={() => handleNavigation(item)}
          >
            <Text style={[
              styles.menuText,
              isActive(item) && styles.activeText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: containerWidth,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    width: '100%'
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25
  },
  name: {
    fontWeight: 'bold',
    color: '#001f5b',
    fontSize: 16
  },
  role: {
    color: '#888',
    fontSize: 14
  },
  menu: {
    width: '100%'
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  menuText: {
    color: '#001f5b',
    textAlign: 'center',
    fontSize: 14
  },
  activeItem: {
    backgroundColor: '#007bff',
    borderRadius: 8
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

BarraLateral.propTypes = {
  userName: PropTypes.string.isRequired,
  userRole: PropTypes.oneOf(['Administrador', 'Conductor', 'Estudiante']).isRequired,
  userIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BarraLateral;