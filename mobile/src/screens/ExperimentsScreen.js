import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import styles from '../utils/styles';
import ExperimentModal from '../components/ExperimentModal';

import NotificationHandler from '../utils/NotificationHandler';


import { getExperiments } from '../database/dbSenseI';

import { connect } from "react-redux";
import { setExperimentsList } from "../../context/actions/experimentActions";


const ExperimentsScreen = (props) => {

    const [showCreateModal, setShowCreateModal] = useState(false);

    const closeCreateModalHandler = () => {
        setShowCreateModal(false);
    }

    const dispatchCreateModalEvent = () => {
        setShowCreateModal(true);
    }

    useEffect(() => {
        console.log("ExperimentsScreen mounted");
        fetchData();
    }, []);

    const fetchData = async () => {
        let data;
        try {
            data = await getExperiments();
            props.setExperimentsList(data);
            console.log(props.experiments);
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <View style={styles.container}>
            <Text style={styles.header}>Meus experimentos</Text>
            <FlatList
                data={props.experiments}
                keyExtractor={(item) => item.createdTimestamp.toString()}
                renderItem={({ item }) => (
                    <View style={style.experimentItem}>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.text}>{item.incubator}</Text>
                        <Text style={styles.text}>{item.temperature}</Text>
                        <Text style={styles.text}>{item.humidity}</Text>
                        <Text style={styles.text}>{item.startTimestamp}</Text>
                        <Text style={styles.text}>{item.endTimestamp}</Text>
                        <Text style={styles.text}>{item.createdTimestamp}</Text>
                        <Text style={styles.text}>{item.status}</Text>
                        <Text style={styles.text}>{item.observation}</Text>
                    </View>
                )}
                style={{ width: '100%',}}
            />
            <TouchableOpacity onPress={dispatchCreateModalEvent}>
                <Text style={styles.modernButton}>Novo experimento</Text>
            </TouchableOpacity>
            <ExperimentModal 
                visible={showCreateModal}
                title="Novo experimento"
                onCancel={closeCreateModalHandler}
                onSubmit={closeCreateModalHandler}
                submitText="Criar"
                />
            <NotificationHandler />
        </View>
    );
};

const style = StyleSheet.create({
    text: {
        fontSize: 20,
        textAlign: 'justify',
        margin: 10,
    },
    experimentItem: {
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
        padding: 20,
    },
});

const mapStateToProps = (state) => {
    return {
        experiments: state.experiments.experiments,
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
        setExperimentsList: (experiments) => dispatch(setExperimentsList(experiments)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentsScreen);