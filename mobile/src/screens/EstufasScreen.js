import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

import EstufaComponent from '../components/estufa';
import EstufaModal from '../components/estufaModal';

import { getOrionData } from '../utils/fetchData';

const EstufasScreen = () => {
    const [estufas, setEstufas] = useState([]);
    let [showModal, setShowModal] = useState(false);

    const closeModalHandler = () => {
        setShowModal(false);
    };

    const dispatchPressEvent = () => {
        setShowModal(true);
    }

    useEffect(() => {
        console.log('EstufasScreen mounted');
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    async function fetchData() {
        let data = await getOrionData();
        console.log("data -> " + JSON.stringify(data));
        setEstufas(data);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text}>Estufas</Text>
            </View>
            <FlatList
                style={styles.list}
                data={estufas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) =>
                    <EstufaComponent estufa={item} onPress={dispatchPressEvent} />
                }
            />
            <EstufaModal title='Sensor Estufa 1' visible={showModal} onCancel={closeModalHandler}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 15,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    list: {
        width: '100%',
        height: '100%',
    }
});

export default EstufasScreen;