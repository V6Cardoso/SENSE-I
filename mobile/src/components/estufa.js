import { Suspense } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useState } from 'react';

import { Canvas } from '@react-three/fiber/native';
import { EstufaModel } from './EstufaModel';

import FanemImage from '../assets/images/502-C sketch.png';

const EstufaComponent = (props) => {

    return (
        <Pressable
            style={styles.container}
            android_ripple={styles.ripple}
            onPress={props.onPress}>

            <Text style={styles.text}>Estufa {props.estufa.name}</Text>
            <View style={styles.infoContainer}>
                <View style={styles.data}>
                    <Text style={styles.dataText}>Temperatura</Text>
                    <Text style={styles.dataText}>🌡️ {props.estufa.temperature}°C</Text>
                    <Text style={styles.dataText}>Umidade</Text>
                    <Text style={styles.dataText}>💧 {props.estufa.humidity}%</Text>
                </View>
                {/* <Image source={FanemImage} style={{ resizeMode: 'contain', flex: 1, margin: 10, maxHeight: 120 }} /> */}
                <Canvas camera={{ position: [-2, 2.5, 5], fov: 20 }}>
                    {/* <pointLight position={[0, 0, 1]} /> */}
                    <Suspense>
                        <EstufaModel />
                    </Suspense>
                </Canvas>
                

                    
            </View>
            <View style={styles.timestamp}>
                <Text style={styles.timestampText}>Última atualização: {props.estufa.timestamp}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderWidth: 0,
        borderRadius: 15,
        margin: 10,
        padding: 10,
    },
    ripple: {
        color: 'gray',
        borderless: false,
    },
    text: {
        fontSize: 20,
    },
    timestamp: {
        width: '100%',
    },
    timestampText: {
        fontSize: 15,
        textAlign: 'left',
        margin: 10,
        color: 'gray',
        
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    data: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 20,
    },
    dataText: {
        fontSize: 18,
    },
});

export default EstufaComponent;