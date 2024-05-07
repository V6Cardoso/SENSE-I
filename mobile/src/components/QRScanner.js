import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera/next';

import Icon from "react-native-vector-icons/Ionicons";


function QRScanner(props) {

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        console.log('Camera permissions are not granted yet');
        return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>Necessário permissão para acessar a câmera</Text>
            <Button onPress={requestPermission} title="Permitir acesso à câmera" />
        </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
      }
    

    return (
        <View style={styles.container}>
            <CameraView 
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{
                    barCodeTypes: ["qr"],
                }}
                onBarcodeScanned={({ data }) => {
                    props.onQRCodeScanned(data);
                }}
            >
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Icon name="camera-reverse" size={48} color="white" />
                </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 30,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });
export default QRScanner;