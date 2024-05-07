import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import styles from '../utils/styles';
import ExperimentModal from '../components/ExperimentModal';
import QRScanner from '../components/QRScanner';

import CustomModal from '../components/CustomModal';
import NotificationHandler from '../utils/NotificationHandler';

import { sendExperiment, removeExperiment } from '../utils/fetchData';
import { getExperiments, deleteExperiment, updateExperiment } from '../database/dbSenseI';

import { connect } from "react-redux";
import { setExperimentsList } from "../../context/actions/experimentActions";


const ExperimentsScreen = (props) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [notificationToken, setNotificationToken] = useState(null);

    const [openQRModal, setOpenQRModal] = useState(false);
    const [openQRScanner, setOpenQRScanner] = useState(false);

    const FanemImage = require('../../assets/icon.png');


    const closeCreateModalHandler = () => {
        setShowCreateModal(false);
    }

    const dispatchCreateModalEvent = () => {
        setShowCreateModal(true);
    }

    const dispatchOpenQRCamera = () => {
        setOpenQRScanner(true);
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

    const shareExperiment = (experiment) => {
        console.log("Compartilhando experimento", experiment);
        setOpenQRModal(true);
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
        if (serverId) {
            const response = await removeExperiment(serverId);
        }
        await deleteExperiment(id);
        fetchData();
    }

    const getCurrentTime = () => {
        return Math.floor(Date.now() / 1000);
    }

    const calculateProgress = (startTimestamp, endTimestamp) => {
        const currentTime = getCurrentTime();
        const totalDuration = endTimestamp - startTimestamp;
        const elapsedTime = currentTime - startTimestamp;
        const progress = elapsedTime / totalDuration;
        return progress;
    }



    return (
        <View style={styles.container}>
            <Text style={styles.header}>Meus experimentos</Text>
            
            <View style={style.actions}>
                <TouchableOpacity onPress={dispatchCreateModalEvent}>
                    <Text style={[styles.modernButton, {width: 305, textAlign: 'center'}]}>Novo experimento</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={dispatchOpenQRCamera}>
                    <Text style={[styles.modernButton, {padding: 13}]}>
                        <Icon name="camera" size={30} color="#4682b4" />
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={props.experiments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={style.experimentItem}>
                        <View style={style.divideContainer}>
                            <View style={style.infoContainer}>
                                <Text style={styles.text}>{item.name}</Text>
                                <Text style={styles.text}>Estufa {item.incubator.substring(item.incubator.indexOf('dmie') + 4)}</Text>
                                <Text style={styles.text}>Temperatura:{item.temperature}</Text>
                                <Text style={styles.text}>Umidade:{item.humidity}</Text>
                                <Text style={styles.text}>Início do experimento: {new Date(item.startTimestamp * 1000).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
                                <Text style={styles.text}>Fim do experimento: {new Date(item.endTimestamp * 1000).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
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
                                        <Icon name="qr-code" size={30} color="#4682b4" />
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
                        <Progress.Bar
                            progress={calculateProgress(item.startTimestamp, item.endTimestamp)}
                            width={null}
                            animated={true}
                            color="#4682b4"
                            borderRadius={20}
                            animationConfig={{ bounciness: 20 }}
                            animationType= "timing"

                        />
                        
                    </View>
                )}
                style={{ width: '100%',}}
            />


            <ExperimentModal 
                visible={showCreateModal}
                title="Novo experimento"
                onCancel={closeCreateModalHandler}
                onSubmit={closeCreateModalHandler}
                submitText="Criar"
                />
            <NotificationHandler />
            
            <CustomModal
                title={"QR Code do experimento"}
                visible={openQRModal}
                onCancel={() => setOpenQRModal(false)}
                noSubmit
                cancelColor="gray"
                cancelColorRipple="gray"
            >
                <View style={style.QRContainer}>
                    <QRCode
                        value={"https://google.com.br"}
                        size={350}
                        logo={FanemImage}
                        logoSize={70}
                        logoBackgroundColor='transparent'
                    />
                </View>
            </CustomModal>

            <CustomModal
                title={"QR Code do experimento"}
                visible={openQRScanner}
                onCancel={() => setOpenQRScanner(false)}
                noSubmit
                cancelColor="gray"
                cancelColorRipple="gray"
            >
                <View style={style.QRContainer}>
                    <QRScanner 
                        onQRCodeScanned={(data) => {
                            console.log("QR Code scanned", data);
                            setOpenQRScanner(false);
                        }
                        }
                    />
                </View>
            </CustomModal>

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
    divideContainer: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoContainer: {
        width: "85%",
        
    },
    buttonsContainer: {
        justifyContent: "space-between",
    },
    buttonContainer: {
        margin: 8,
    },
    actions: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    QRContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 500,
        width: 350,
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