import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useState } from 'react';

import FanemImage from '../assets/images/502-C.jpg';

const EstufaComponent = (props) => {

    return (
        <Pressable
            style={styles.container}
            android_ripple={styles.ripple}
            onPress={props.onPress}>

            <Text style={styles.text}>Estufa {props.name}</Text>
            <View style={styles.infoContainer}>
                <View style={styles.data}>
                    <Text style={styles.text}>Temperatura: 25°C</Text>
                    <Text style={styles.text}>Umidade: 50%</Text>
                </View>
                <Image source={FanemImage} style={{ width: 100, height: 100 }} />
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
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        maxHeight: 250,
        minHeight: 250,
        margin: 10,
    },
    ripple: {
        color: 'lightyellow',
        borderless: false,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    data: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'left',

    },
});

export default EstufaComponent;