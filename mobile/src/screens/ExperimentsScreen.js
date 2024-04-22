import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../utils/styles';
import ExperimentModal from '../components/ExperimentModal';


import NotificationHandler from '../utils/NotificationHandler';

import { sendExperiment, removeExperiment } from '../utils/fetchData';
import { getExperiments, deleteExperiment, updateExperiment } from '../database/dbSenseI';

import { connect } from "react-redux";
import { setExperimentsList } from "../../context/actions/experimentActions";


const ExperimentsScreen = (props) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [notificationToken, setNotificationToken] = useState(null);

    const closeCreateModalHandler = () => {
        setShowCreateModal(false);
    }

    const dispatchCreateModalEvent = () => {
        setShowCreateModal(true);
    }

    useEffect(() => {
        console.log("ExperimentsScreen mounted");
        fetchData();
        getNotificationToken();

    }, []);

    const fetchData = async () => {
        let data;
        try {
            data = await getExperiments();
            props.setExperimentsList(data);
        } catch (error) {
            console.error(error);
        }
    }

    const getNotificationToken = async () => {
        try {
            const token = await AsyncStorage.getItem("notificationToken");
            setNotificationToken(token);
        } catch (error) {
            console.error(error);
        }
    }

    const alertUploadExperiment = (experiment) => {
        Alert.alert(
            "Deseja enviar o experimento para o servidor?",
            "Ao enviar você poderá compartilhar com outros usuários e receber notificações.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Enviar",
                    onPress: () => uploadExperiment(experiment)
                }
            ]
        );
    }

    const uploadExperiment = async (experiment) => {
        try {
            console.log("Enviando experimento", experiment);
            const response = await sendExperiment(experiment, notificationToken);
            console.log("Experimento enviado", response);
            await updateExperiment(experiment.id, { serverId: parseInt(response) });
            fetchData();
        } catch (error) {
            console.error("Error uploading experiment: ", error);
        }
    }
    



    const alertRemoveExperiment = (id, serverId) => {
        Alert.alert(
            "Remover experimento",
            "Deseja remover o experimento?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Remover",
                    onPress: () => handleRemoveExperiment(id, serverId)
                }
            ]
        );
    }

    const handleRemoveExperiment = async (id, serverId) => {
        const response = await removeExperiment(serverId);
        await deleteExperiment(id);
        fetchData();
    }



    return (
        <View style={styles.container}>
            <Text style={styles.header}>Meus experimentos</Text>
            <FlatList
                data={props.experiments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={style.experimentItem}>
                        <View style={style.infoContainer}>
                            <Text style={styles.text}>{item.name}</Text>
                            <Text style={styles.text}>{item.incubator}</Text>
                            <Text style={styles.text}>{item.temperature}</Text>
                            <Text style={styles.text}>{item.humidity}</Text>
                            <Text style={styles.text}>{new Date(item.startTimestamp * 1000).toLocaleString()}</Text>
                            <Text style={styles.text}>{new Date(item.endTimestamp * 1000).toLocaleString()}</Text>
                            <Text style={styles.text}>{new Date(item.createdTimestamp * 1000).toLocaleString()}</Text>
                            <Text style={styles.text}>{item.observation}</Text>
                        </View>
                        <View style={style.buttonsContainer}>
                            {!item.serverId && notificationToken && (
                            <TouchableOpacity
                                style={style.buttonContainer}
                                onPress={() => alertUploadExperiment(item)}
                            >
                                <Icon name="cloud-upload" size={30} color="#4682b4" />
                            </TouchableOpacity>
                            )}
                            
                            {item.serverId && notificationToken && (
                                <TouchableOpacity
                                    style={style.buttonContainer}
                                    onPress={() => shareExperiment(item)}
                                >
                                    <Icon name="share-social" size={30} color="#4682b4" />
                                </TouchableOpacity>
                            )}
                            
                            <TouchableOpacity
                                style={style.buttonContainer}
                                onPress={() => alertRemoveExperiment(item.id, item.serverId)}
                            >
                                <Icon name="trash" size={30} color="red" />
                            </TouchableOpacity>
                        </View>
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
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoContainer: {
        
    },
    buttonsContainer: {
        justifyContent: "space-between",
    },
    buttonContainer: {
        margin: 8,
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