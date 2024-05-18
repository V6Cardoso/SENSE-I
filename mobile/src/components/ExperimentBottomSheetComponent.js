import React, { useCallback, useMemo, useRef, Suspense } from 'react';

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity } from "react-native";
import * as Progress from 'react-native-progress';

import { Canvas } from '@react-three/fiber/native';
import { EstufaModel } from '../components/EstufaModel';
import STHCometGraph from './STHCometGraph';

const ExperimentBottomSheetComponent = (props) => {

    const [name, setName] = useState('');
    const [incubator, setIncubator] = useState('');
    const [temperature, setTemperature] = useState('');
    const [temperatureLowThreshold, setTemperatureLowThreshold] = useState('');
    const [temperatureHighThreshold, setTemperatureHighThreshold] = useState('');
    const [humidity, setHumidity] = useState('');
    const [humidityLowThreshold, setHumidityLowThreshold] = useState('');
    const [humidityHighThreshold, setHumidityHighThreshold] = useState('');
    const [startTimestamp, setStartTimestamp] = useState('');
    const [endTimestamp, setEndTimestamp] = useState('');
    const [createdTimestamp, setCreatedTimestamp] = useState('');
    const [observation, setObservation] = useState('');
    

    useEffect(() => {
        if (!props.value) {
            return;
        }

        setName(props.value.name);
        setIncubator(props.value.incubator);
        setTemperature(props.value.temperature);
        setTemperatureLowThreshold(props.value.temperatureLowThreshold);
        setTemperatureHighThreshold(props.value.temperatureHighThreshold);
        setHumidity(props.value.humidity);
        setHumidityLowThreshold(props.value.humidityLowThreshold);
        setHumidityHighThreshold(props.value.humidityHighThreshold);
        setStartTimestamp(props.value.startTimestamp);
        setEndTimestamp(props.value.endTimestamp);
        setCreatedTimestamp(props.value.createdTimestamp);
        setObservation(props.value.observation);

        
    }, [props.value]);


    return (
        <>
            <Canvas camera={{ position: [-2, 2.5, 5], fov: 20 }} style={{ height:100, width:100 }}>
                <ambientLight intensity={0.5} />
                <Suspense>
                <EstufaModel />
                </Suspense>
            </Canvas>
            <View style={styles.container}>
                {name && <Text style={styles.text}>Experimento {name}</Text>}
                <View style={styles.infoContainer}>
                    <View style={styles.data}>
                        {incubator && <Text style={styles.dataText}>Estufa {incubator.substring(incubator.indexOf('dmie') + 4)}</Text>}
                        {temperature && <Text style={styles.dataText}>Temperatura 🌡️ {temperature}°C</Text>}
                        {humidity && <Text style={styles.dataText}>Umidade 💧 {humidity}%</Text>}
                        {startTimestamp && <Text style={styles.dataText}>Início do experimento: {new Date(startTimestamp * 1000).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                        {endTimestamp && <Text style={styles.dataText}>Fim do experimento: {new Date(endTimestamp * 1000).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                    </View>
                    <View style={styles.data}>
                        {temperatureLowThreshold && temperatureHighThreshold && <Text style={styles.dataText}>Limite de Temperatura</Text>}
                        {temperatureLowThreshold && temperatureHighThreshold && <Text style={styles.dataText}>🌡️ {temperatureLowThreshold}°C - {temperatureHighThreshold}°C</Text>}
                        {temperatureLowThreshold && <Text style={styles.dataText}>Limite Inferior de Temperatura</Text>}
                        {temperatureLowThreshold && <Text style={styles.dataText}>🌡️ {temperatureLowThreshold}°C</Text>}
                        {temperatureHighThreshold && <Text style={styles.dataText}>Limite Superior de Temperatura</Text>}
                        {temperatureHighThreshold && <Text style={styles.dataText}>🌡️ {temperatureHighThreshold}°C</Text>}

                        {humidityLowThreshold && humidityHighThreshold && <Text style={styles.dataText}>Limite de Umidade</Text>}
                        {humidityLowThreshold && humidityHighThreshold && <Text style={styles.dataText}>💧 {humidityLowThreshold}% - {humidityHighThreshold}%</Text>}
                        {humidityLowThreshold && <Text style={styles.dataText}>Limite Inferior de Umidade</Text>}
                        {humidityLowThreshold && <Text style={styles.dataText}>💧 {humidityLowThreshold}%</Text>}
                        {humidityHighThreshold && <Text style={styles.dataText}>Limite Superior de Umidade</Text>}
                        {humidityHighThreshold && <Text style={styles.dataText}>💧 {humidityHighThreshold}%</Text>}

                        

                    </View>
                    <View style={styles.data}>
                        {observation && <Text style={styles.dataText}>Observação: {observation}</Text>}
                        {createdTimestamp && <Text style={styles.dataText}>Criado em {new Date(createdTimestamp * 1000).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                    </View>
                </View>
            </View>
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderWidth: 0,
        width: '100%',
    },
    infoContainer: {
        marginTop: 20,
    },
    data: {
        margin: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dataText: {
        fontSize: 20,
    },
    

});

export default ExperimentBottomSheetComponent;