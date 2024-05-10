import React, { useCallback, useMemo, useRef, Suspense } from 'react';

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity } from "react-native";
import * as Progress from 'react-native-progress';

import styles from '../utils/styles';
import EstufaComponent from "../components/estufa";
import EstufaBottomSheetComponent from '../components/EstufaBottomSheetComponent';

import { getDevices, getOrionData } from "../utils/fetchData";

import { connect } from "react-redux";
import { setDevicesList } from "../../context/actions/deviceActions";

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { Canvas } from '@react-three/fiber/native';
import { EstufaModel } from '../components/EstufaModel';

const EstufasScreen = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [estufas, setEstufas] = useState([]);

  const [selectedEstufa, setSelectedEstufa] = useState(null);
  const [selectedEstufaValue, setSelectedEstufaValue] = useState([]);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['30%', '60%'], []);
  const handleCloseAction = () => bottomSheetRef.current?.close();
  const handlePresentModalPress = () => bottomSheetRef.current?.expand();

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    console.log("EstufasScreen mounted");
    setLoading(true);
    fetchDevices();
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
  }, []);

  async function fetchDevices() {
    let data = await getDevices();
    props.setDevices(data);
  }

  function fetchData() {
    let data;

    getOrionData()
      .then((response) => {
        data = response;
        let estufas = estufasExtractor(data)?.filter((item) => item.type === "estufa");
        setEstufas(estufas);
        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  }

  useEffect(() => {
    if (!selectedEstufa) {
      return;
    }

    let data = estufas?.filter((item) => item.name === selectedEstufa);
    if (!data) {
      return;
    }
    else
      data = data[0];
    
    setSelectedEstufaValue(data);
    
  }, [selectedEstufa, estufas]);

  const estufasExtractor = (data) => {
    if(!data)
      return;

    return data.map((item) => {
    return {
        id: item.id,
        type: item.type,
        name: item.id.substring(item.id.indexOf('dmie') + 4),
        temperature: item.temperature?.value,
        humidity: item.humidity?.value,
        timestamp: new Date(item.TimeInstant?.value).toLocaleTimeString(),
    };
    });
  }

  const handleEstufaPress = (estufa) => {
    setSelectedEstufa(estufa.name);
    handlePresentModalPress();
  }


  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text style={styles.header}>Estufas</Text>
        {estufas?.length == 0 && isLoading && !error &&
          <View style={style.centeredContent}>
            <Progress.CircleSnail color={['#F5FCFF']} size={80} />
            <Text style={{marginTop: 10, color: '#F5FCFF'}}>Carregando dados</Text>
          </View>
        }
        {error &&
          <View style={style.centeredContent}>
            <Text style={{color: 'red'}}>Ocorrreu um erro ao carregar os dados</Text>
          </View>
        }

        {estufas?.length !== 0 && !error && (
          <FlatList
            style={style.list}
            data={estufas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <EstufaComponent estufa={item} onPress={() => handleEstufaPress(item)} />
            )}
          />
        )}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: '#F5FCFF' }}
        enablePanDownToClose={true}

      >
        <BottomSheetScrollView contentContainerStyle={style.contentContainer}>
          <EstufaBottomSheetComponent value={selectedEstufaValue} />
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const style = StyleSheet.create({
  
  list: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContainer: {
    
    

  },
  contentContainer: {
    alignItems: 'center',

  },
});

const mapStateToProps = (state) => {
  return {
    devices: state.devices.devices,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDevices: (devices) => dispatch(setDevicesList(devices)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EstufasScreen);
