import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

const InicioSesion = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const handleLogin = async () => {
    try {
      console.log("URL:", process.env.EXPO_PUBLIC_API_URL);
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        correo: email,
        password: password,
      });

      const { token, ...user } = response.data;
      
      await AsyncStorage.setItem('usuario', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);

      Alert.alert("Bienvenido", "Inicio de sesión exitoso");

      if (user.role === 'admin') {
        navigation.navigate('Administrador');
      } else if (user.role === 'conductor') {
        navigation.navigate('Conductor');
      } else if (user.role === 'estudiante') {
        navigation.navigate('Estudiante');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        "Error",
        error.response?.status === 401 
          ? "Correo o contraseña incorrectos" 
          : "Error en el servidor"
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header: Logo y Título en la misma línea */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: "https://ici2st.epn.edu.ec/eventosAnteriores/ICI2ST2023/images/ici2st2023/Logo_EPN.png" }}
              style={styles.logoEPN}
              resizeMode="contain"
            />
            <Text style={styles.tituloPrincipal}>SISTEMA DE TRANSPORTE ESTUDIANTIL</Text>
          </View>
          
          {/* Formulario de inicio de sesión centrado */}
          <View style={styles.formWrapper}>
            <View style={styles.formContainer}>
              <Text style={styles.tituloFormulario}>Iniciar Sesión</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Correo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="alguien@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder="Contraseña"
                  secureTextEntry
                  returnKeyType="go"
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={handleLogin}
                />
              </View>

              <TouchableOpacity 
                style={styles.boton}
                onPress={handleLogin}
              >
                <Text style={styles.botonTexto}>Ingresar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.registroLink}
                onPress={() => navigation.navigate("Registro")}
              >
                <Text style={styles.registroTexto}>
                  ¿No estás registrado?{" "}
                  <Text style={styles.registroLinkTexto}>Regístrate</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoEPN: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  tituloPrincipal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#001F5B",
    textAlign: "center",
  },
  formWrapper: {
    flex: 1,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  tituloFormulario: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#001F5B",
    textAlign: "center",
    marginBottom: 25,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#CCC",
    borderRadius: 30,
    padding: 15,
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#001F5B",
    borderRadius: 30,
    padding: 15,
    marginTop: 10,
    alignItems: "center",
  },
  botonTexto: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registroLink: {
    marginTop: 15,
    alignItems: "center",
  },
  registroTexto: {
    color: "#666",
  },
  registroLinkTexto: {
    color: "#001F5B",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default InicioSesion;