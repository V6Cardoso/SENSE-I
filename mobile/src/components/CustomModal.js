import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, Modal, Pressable, Alert, TextInput, ScrollView} from 'react-native';

function CustomModal(props) {

  return(
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.visible}
        onRequestClose={props.onCancel}
      >
        <View style={styles.centeredView}>
          <View style={styles.opaqueBackground}></View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={props.onCancel}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{props.title}</Text>
            {props.children}
            {props.hideBottonButtons ? null : 
              <View style={{height: 50}}>
                <View style={styles.stateButtons}>
                  <Pressable
                    android_ripple={{color: '#2196F3', borderless: false,}}
                    style={[styles.button, styles.buttonClose]}
                    onPress={props.onCancel}>
                    <Text style={[styles.textStyle, styles.textCloseStyle]}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    android_ripple={{color: '#0b4370', borderless: false,}}
                    style={[styles.button, styles.buttonSave]}
                    onPress={props.onSave}>
                    <Text style={[styles.textStyle, styles.textSaveStyle]}>Salvar</Text>
                  </Pressable>
                </View>
              </View>}
            
          </View>
        </View>
      </Modal>
    </>
    
  );
}

export default CustomModal;

const styles = StyleSheet.create({
    opaqueBackground: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      margin: 0,
      backgroundColor: 'black',
      opacity: 0.5,
      width: '100%',
      height: '100%'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
    },
    modalView: {
      margin: 8,
      backgroundColor: '#f2f2f2',
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    stateButtons: {
      flex:1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    button: {
      borderRadius: 3,
      padding: 9,
      margin: 5,
      elevation: 2,
      height: 40,
      width: 160
    },
    buttonClose: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#2196F3',
    },
    buttonSave: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
      fontWeight: 'bold',
      textAlign: 'center',
      verticalAlign: 'center',
    },
    textCloseStyle: {
      color: '#2196F3',
    },
    textSaveStyle: {
      color: 'white',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    Input: {

    },
    label: {
      marginLeft: 5,
      color: 'gray'
    },
    textInput: {
      borderWidth: 1,
      borderColor: 'lightgray',
      borderRadius: 3,
      backgroundColor: '#f2f2f2',
      color: '#120438',
      width: 350,
      margin: 5,
      padding: 5
    },
});