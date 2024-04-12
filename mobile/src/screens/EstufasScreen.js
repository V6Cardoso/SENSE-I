import React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";

import EstufaComponent from "../components/estufa";
import EstufaModal from "../components/estufaModal";

import { getOrionData } from "../utils/fetchData";

const EstufasScreen = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [estufas, setEstufas] = useState([]);
  let [showModal, setShowModal] = useState(false);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const dispatchPressEvent = () => {
    setShowModal(true);
  };

  useEffect(() => {
    console.log("EstufasScreen mounted");
    setLoading(true);
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
  }, []);

  function fetchData() {
    let data;

    getOrionData()
      .then((response) => {
        data = response;
        let estufas = estufasExtractor(data).filter((item) => item.type === "estufa");
        setEstufas(estufas);
        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  }

  const estufasExtractor = (data) => {
    return data.map((item) => {
    return {
        id: item.id,
        type: item.type,
        name: item.id.substring(item.id.indexOf('dmie') + 4),
        temperature: item.temperature.value,
        humidity: item.humidity?.value,
    };
    });
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Estufas</Text>
      </View>
      {isLoading && <Text>Loading...</Text>}
      {error && 
        <Text style={{color: 'red'}}>An error occurred while fetching data</Text>
      }
      {estufas.length !== 0 && (
        <FlatList
          style={styles.list}
          data={estufas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <EstufaComponent estufa={item} onPress={dispatchPressEvent} />
          )}
        />
      )}
      <EstufaModal
        title="Sensor Estufa 1"
        visible={showModal}
        onCancel={closeModalHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  header: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    marginTop: 15,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  list: {
    width: "100%",
    height: "100%",
  },
});

export default EstufasScreen;
