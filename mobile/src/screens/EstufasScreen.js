import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

import EstufaComponent from '../components/estufa';
import EstufaModal from '../components/estufaModal';

const EstufasScreen = () => {
    const estufas = [{name: '2'}, {name: '2'}, {name: '2'}, {name: '2'},{name: '2'}, {name: '2'},{name: '2'}, {name: '2'}];
    let [showModal, setShowModal] = useState(false);

    const closeModalHandler = () => {
        setShowModal(false);
    };

    const dispatchPressEvent = () => {
        setShowModal(true);
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
                    <EstufaComponent name={item.name} onPress={dispatchPressEvent} />
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