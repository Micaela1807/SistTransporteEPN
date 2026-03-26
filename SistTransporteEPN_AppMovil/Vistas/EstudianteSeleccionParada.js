import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function EstudianteSeleccionParada() {
    const [paradas, setParadas] = useState([]);
    const [asientosDisponibles, setAsientosDisponibles] = useState(null);
    const [selectedParadaId, setSelectedParadaId] = useState(null);
    const [pendingParadaId, setPendingParadaId] = useState(null);
    const [estudiante, setEstudiante] = useState(null);

    useEffect(() => {
        const fetchEstudiante = async () => {
            const storedUser = await AsyncStorage.getItem("usuario");
            const token = await AsyncStorage.getItem("token");
            if (!storedUser || !token) {
                Alert.alert("Error", "No hay estudiante o token. Redirigiendo...");
                return;
            }

            const userData = JSON.parse(storedUser);
            const estudianteId = userData.id;
            try {
                let response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudianteId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let data = await response.json();
                setEstudiante(data);
                setSelectedParadaId(data.parada);

                if (!data.ruta) {
                    return;
                }

                response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudianteId}/paradas`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                data = await response.json();
                setParadas(data);

                if (data.length > 0) {
                    response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/rutas/${data[0].ruta}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    data = await response.json();
                    setAsientosDisponibles(data.asientos_disponibles);
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        fetchEstudiante();
    }, []);

    const handleParadaClick = (id) => {
        setPendingParadaId(pendingParadaId === id ? null : id);
    };

    const handleAccept = async () => {
        if (!pendingParadaId) return;
        const token = await AsyncStorage.getItem("token");
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudiante.id}/paradas`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ parada: pendingParadaId }),
            });
            const data = await response.json();
            setSelectedParadaId(pendingParadaId);
            setPendingParadaId(null);
            if (!data.message.includes("Parada actualizada correctamente")) {
                setAsientosDisponibles((prev) => Math.max(0, prev - 1));
            }
            Alert.alert("Éxito", data.message);
        } catch (error) {
            Alert.alert("Error", "Hubo un problema al actualizar la parada.");
        }
    };

    const handleRemoveSelection = async () => {
        const token = await AsyncStorage.getItem("token");
        try {
            await fetch(`${process.env.EXPO_PUBLIC_API_URL}/estudiantes/${estudiante.id}/paradas`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ parada: null }),
            });
            setSelectedParadaId(null);
            setAsientosDisponibles((prev) => prev + 1);
            Alert.alert("Éxito", "Selección de parada eliminada correctamente.");
        } catch (error) {
            Alert.alert("Error", "Hubo un problema al eliminar la selección de parada.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Seleccione su parada:</Text>
            {!estudiante?.ruta ? (
                <Text style={styles.warning}>Primero debe seleccionar una ruta.</Text>
            ) : (
                paradas.map((parada) => (
                    <TouchableOpacity
                        key={parada.id}
                        style={[
                            styles.paradaCard,
                            pendingParadaId === parada.id && styles.pending,
                            selectedParadaId === parada.id && styles.selected,
                        ]}
                        onPress={() => handleParadaClick(parada.id)}
                    >
                        <Text style={styles.paradaText}>{parada.nombre}</Text>
                        {pendingParadaId === parada.id && (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={handleAccept}>
                                    <Text style={styles.buttonText}>Aceptar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => setPendingParadaId(null)}>
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                ))
            )}
            {selectedParadaId && (
                <TouchableOpacity style={styles.removeButton} onPress={handleRemoveSelection}>
                    <Text style={styles.buttonText}>Quitar Parada</Text>
                </TouchableOpacity>
            )}
            {asientosDisponibles !== null && (
                <Text style={styles.seatsAvailable}>Asientos disponibles: {asientosDisponibles}</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    warning: { color: 'red', fontSize: 16 },
    paradaCard: { padding: 15, marginVertical: 5, backgroundColor: '#c5b6e0', borderRadius: 10 },
    selected: { backgroundColor: '#32A94C' },
    pending: { backgroundColor: '#FFD700' },
    paradaText: { fontSize: 18 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    removeButton: { backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
    seatsAvailable: { fontSize: 16, marginTop: 10, fontWeight: 'bold' },
});

export default EstudianteSeleccionParada;
