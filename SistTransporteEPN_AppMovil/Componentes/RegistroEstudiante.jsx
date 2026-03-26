import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const RegistroEstudiante = ({ onSubmit }) => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    codigoUnico: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (name, value) => {
    let error = "";
    let validValue = value;

    switch (name) {
      case "nombre":
      case "apellido":
        if (/\d/.test(value)) {
          error = "Este campo no puede contener números.";
          validValue = value.replace(/\d/g, "");
        }
        break;
      case "correo":
        if (value.includes("@")) {
          validValue = value.split("@")[0] + "@epn.edu.ec";
        }
        break;
      case "codigoUnico":
        if (!/^\d*$/.test(value)) {
          error = "Solo se permiten números.";
          validValue = value.replace(/\D/g, "");
        } else if (value.length > 9) {
          error = "El código único debe tener exactamente 9 números.";
          validValue = value.slice(0, 9);
        }
        break;
      case "password":
        if (
          value.length < 8 ||
          !/[A-Z]/.test(value) ||
          !/\d/.test(value) ||
          !/[!@#$%^&*(),.?":{}|<>]/.test(value)
        ) {
          error =
            "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.";
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    setFormData(prev => ({ ...prev, [name]: validValue }));
  };

  const handleSubmit = () => {
    const trimmedData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      correo: formData.correo.trim(),
      codigoUnico: formData.codigoUnico.trim(),
      password: formData.password.trim(),
    };

    const formErrors = {};
    
    if (!trimmedData.nombre) formErrors.nombre = "El nombre es requerido.";
    if (!trimmedData.apellido) formErrors.apellido = "El apellido es requerido.";
    if (!trimmedData.correo) formErrors.correo = "El correo es requerido.";
    if (!/^\d{9}$/.test(trimmedData.codigoUnico))
      formErrors.codigoUnico = "El código único debe tener 9 números.";
    if (!trimmedData.password)
      formErrors.password = "La contraseña es requerida.";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0 && onSubmit) {
      onSubmit(trimmedData);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Registro de Estudiantes</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese su nombre"
                value={formData.nombre}
                onChangeText={(text) => handleChange('nombre', text)}
              />
              {errors.nombre && <Text style={styles.error}>{errors.nombre}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese su apellido"
                value={formData.apellido}
                onChangeText={(text) => handleChange('apellido', text)}
              />
              {errors.apellido && <Text style={styles.error}>{errors.apellido}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Correo Institucional</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese su correo"
                value={formData.correo}
                onChangeText={(text) => handleChange('correo', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.correo && <Text style={styles.error}>{errors.correo}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Código Único</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese su código único"
                value={formData.codigoUnico}
                onChangeText={(text) => handleChange('codigoUnico', text)}
                keyboardType="numeric"
                maxLength={9}
              />
              {errors.codigoUnico && <Text style={styles.error}>{errors.codigoUnico}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.toggleText}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require('./polibus-logo-500h.png')} // Asegúrate de tener la imagen en tu proyecto
              style={styles.busImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    maxWidth: width > 768 ? '50%' : '100%',
    padding: 20,
  },
  title: {
    color: '#001f5b',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    padding: 15,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    position: 'absolute',
    right: 15,
  },
  toggleText: {
    color: '#001f5b',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#001f5b',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    display: width > 768 ? 'flex' : 'none',
  },
  busImage: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default RegistroEstudiante;