import React, { useCallback, useMemo, useRef, Suspense } from 'react';

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity } from "react-native";


import { Canvas } from '@react-three/fiber/native';
import { EstufaModel } from '../components/EstufaModel';
import STHCometGraph from './STHCometGraph';

const EstufaBottomSheetComponent = (props) => {

    const [id, setId] = useState();
    const [name, setName] = useState();
    const [currentTemperature, setCurrentTemperature] = useState();
    const [currentHumidity, setCurrentHumidity] = useState();
    const [currentDate, setCurrentDate] = useState();
    const [lastHour, setLastHour] = useState();

    useEffect(() => {
        if (!props.value) {
            return;
        }

        setName(props.value.name);
        setCurrentTemperature(props.value.temperature);
        setCurrentHumidity(props.value.humidity);
    }, [props.value]);

    useEffect(() => {
        if (!props.value || !props.value.id || (id && id === props.value.id)) {
            return;
        }

        console.log("id to fetch", props.value.id);

        setId(props.value.id);
        setCurrentDate(new Date());
        setLastHour(new Date(new Date().getTime() - (60 * 60 * 1000))); // Subtract 1 hour in milliseconds
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
                <Text style={styles.text}>Estufa {name}</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.dataText}>🌡️ {currentTemperature}°C</Text>
                    <Text style={styles.dataText}>💧 {currentHumidity}%</Text>
                </View>
                {id && lastHour && currentDate &&
                    <>
                        <STHCometGraph device={id} attr="temperature" dateFrom={lastHour} dateTo={currentDate} />
                        <STHCometGraph device={id} attr="humidity" dateFrom={lastHour} dateTo={currentDate} />
                    </>
                }
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
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 400,
        marginTop: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dataText: {
        fontSize: 20,
    },
    

});

export default EstufaBottomSheetComponent;