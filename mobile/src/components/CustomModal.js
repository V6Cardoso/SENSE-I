import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Modal,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";

function CustomModal(props) {
  return (
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
        animationType="fade"
        transparent={true}
        visible={props.visible}
        onRequestClose={props.onCancel}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {props.title && <Text style={styles.modalText}>{props.title}</Text>}
            {props.children}
            {props.hideBottonButtons ? null : (
              <View style={{ height: 60 }}>
                <View style={styles.stateButtons}>
                  <Pressable
                    android_ripple={{
                      color: props.cancelColorRipple,
                      borderless: false,
                    }}
                    style={[
                      styles.button,
                      styles.buttonClose,
                      { borderColor: props.cancelColor },
                    ]}
                    onPress={props.onCancel}
                  >
                    <Text
                      style={[styles.textStyle, { color: props.cancelColor }]}
                    >
                      Voltar
                    </Text>
                  </Pressable>
                  {!props.noSubmit && (
                    <Pressable
                      android_ripple={{
                        color: props.submitColorRipple,
                        borderless: false,
                      }}
                      style={[
                        styles.button,
                        { backgroundColor: props.submitColor },
                      ]}
                      onPress={props.onSubmit}
                    >
                      <Text style={[styles.textStyle, styles.textSaveStyle]}>
                        {props.submitText ? props.submitText : "Salvar"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

export default CustomModal;

const styles = StyleSheet.create({
  opaqueBackground: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 0,
    backgroundColor: "black",
    opacity: 0.4,
    width: "100%",
    height: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  modalView: {
    margin: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
  },
  stateButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 3,
    padding: 9,
    margin: 5,
    elevation: 2,
    height: 55,
    width: 160,
    justifyContent: "center",
  },
  buttonClose: {
    backgroundColor: "white",
    borderWidth: 1,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    verticalAlign: "auto",
  },
  textSaveStyle: {
    color: "white",
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  Input: {},
  label: {
    marginLeft: 5,
    color: "gray",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 3,
    backgroundColor: "#f2f2f2",
    color: "#120438",
    width: 350,
    margin: 5,
    padding: 5,
  },
});
