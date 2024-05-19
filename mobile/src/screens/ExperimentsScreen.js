import React from 'react';
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import styles from '../utils/styles';
import ExperimentModal from '../components/ExperimentModal';
import QRScanner from '../components/QRScanner';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';


import CustomModal from '../components/CustomModal';
import NotificationHandler from '../utils/NotificationHandler';
import ExperimentBottomSheetComponent from '../components/ExperimentBottomSheetComponent';

import { sendExperiment, removeExperiment, getExperiment, getGraphFile } from '../utils/fetchData';
import { getExperiments, deleteExperiment, updateExperiment, insertExperiment } from '../database/dbSenseI';

import { connect } from "react-redux";
import { setExperimentsList } from "../../context/actions/experimentActions";


const ExperimentsScreen = (props) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [notificationToken, setNotificationToken] = useState(null);

    const [openQRModal, setOpenQRModal] = useState(false);
    const [qrData, setQRData] = useState(null);
    const [openQRScanner, setOpenQRScanner] = useState(false);

    const FanemImage = require('../../assets/icon.png');

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const handleCloseAction = () => bottomSheetRef.current?.close();
    const handlePresentModalPress = () => bottomSheetRef.current?.expand();

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
      }, []);

    const [selectedExperimentValue, setSelectedExperimentValue] = useState(null);


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
            await updateExperiment(experiment.id, { serverId: response });
            fetchData();
        } catch (error) {
            console.error("Error uploading experiment: ", error);
        }
    }

    const shareExperiment = (experiment) => {
        console.log("Compartilhando experimento", experiment);
        setQRData(experiment.serverId);
        setOpenQRModal(true);
    }

    const handleQRCodeScanned = async (data) => {
        setOpenQRScanner(false);
        console.log("QR Code scanned", data);
        const response = await getExperiment(data);
        console.log("Experimento recebido", response);
        if (response) {
            response.serverId = response.id;
            response.id = null;
            await insertExperiment(response);
            fetchData();
        }

        
        
    }

    const alertDownloadExperiment = (experiment) => {
        Alert.alert(
            "Escolha o formato de download",
            "",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "PDF",
                    onPress: () => downloadExperiment(experiment, "pdf")
                },
                {
                    text: "csv",
                    onPress: () => downloadExperiment(experiment, "csv")
                }
            ]
        );
    }

    const downloadExperiment = async (experiment, format) => {
        const response = await getGraphFile(experiment.serverId, format);
        const fileName = experiment.name + "." + format;
    
        // Check if response is a Blob and convert it to base64
        const base64Data = await response.blob().then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });
    
        //pdf
        if (format == "pdf") {
            const pdfUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(pdfUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
            await shareAsync(pdfUri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar PDF' });
        }
        //excel
        else if (format == "csv") {
            const csvUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(csvUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
            await shareAsync(csvUri, { mimeType: 'text/csv', dialogTitle: 'Compartilhar CSV' });
        }
    }


    



    const alertRemoveExperiment = (item) => {
        Alert.alert(
            "Remover experimento",
            "Deseja remover o experimento " + item.name + "?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Remover",
                    onPress: () => handleRemoveExperiment(item)
                }
            ]
        );
    }

    const handleRemoveExperiment = async (item) => {
        if (item.owner == notificationToken && item.serverId) { 
            const response = await removeExperiment(item.serverId);
        }
        await deleteExperiment(item.id);
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
        <GestureHandlerRootView style={styles.container}>
            <Text style={styles.header}>Meus experimentos</Text>
            
            <View style={style.actions}>
                <TouchableOpacity onPress={dispatchCreateModalEvent} style={[styles.modernButton, {width: 300}]}>
                    <Text>Novo experimento</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={dispatchOpenQRCamera} style={[styles.modernButton, {padding: 16}]}>
                    <Icon name="camera" size={30} color="#4682b4" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={props.experiments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={style.experimentItem} onPress={() => { setSelectedExperimentValue(item); handlePresentModalPress(); }}>
                        <View style={style.divideContainer}>
                            <View style={style.infoContainer}>
                                {item.name && <Text style={styles.text}>{item.name}</Text>}
                                {item.incubator && <Text style={styles.text}>Estufa {item.incubator.substring(item.incubator.indexOf('dmie') + 4)}</Text>}
                                {item.temperature && <Text style={styles.text}>Temperatura:{item.temperature}</Text>}
                                {item.humidity && <Text style={styles.text}>Umidade:{item.humidity}</Text>}
                                {item.startTimestamp && <Text style={styles.text}>Início do experimento: {new Date(item.startTimestamp * 1000).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                                {item.endTimestamp && <Text style={styles.text}>Fim do experimento: {new Date(item.endTimestamp * 1000).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
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

                                {item.serverId && notificationToken && item.endTimestamp < getCurrentTime() && (
                                    <TouchableOpacity
                                        style={style.buttonContainer}
                                        onPress={() => alertDownloadExperiment(item)}
                                    >
                                        <Icon name="download" size={30} color="#4682b4" />
                                    </TouchableOpacity>
                                )}
                                
                                <TouchableOpacity
                                    style={style.buttonContainer}
                                    onPress={() => alertRemoveExperiment(item)}
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
                        
                    </TouchableOpacity>
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
                        value={qrData}
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
                        onQRCodeScanned={handleQRCodeScanned}
                        scanOnce={true}
                    />
                </View>
            </CustomModal>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backgroundStyle={{ backgroundColor: '#F5FCFF' }}
                enablePanDownToClose={true}

            >
                <BottomSheetScrollView contentContainerStyle={style.contentContainer}>
                    <ExperimentBottomSheetComponent value={selectedExperimentValue} />
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const style = StyleSheet.create({
    text: {
        fontSize: 20,
        textAlign: 'justify',
        margin: 10,
    },
    experimentItem: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
        borderWidth: 0,
        borderRadius: 15,
        margin: 10,
        padding: 15,
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
        justifyContent: "space-between",
    },
    QRContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 500,
        width: 350,
    },
    contentContainer: {
        alignItems: 'center',
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