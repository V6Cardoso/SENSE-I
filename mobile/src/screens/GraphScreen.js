import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
} from "react-native";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";

import { connect } from "react-redux";

import CustomTimePicker from "../components/CustomTimePicker";
import { getOrionData } from "../utils/fetchData";

const GraphScreen = (props) => {
  const [openParam, setOpenParam] = useState(false);
  const [paramValue, setParamValue] = useState(null);
  const [openDevice, setOpenDevice] = useState(false);
  const [deviceValue, setDeviceValue] = useState(null);

  const [incubators, setIncubators] = useState([]);

  const [device, setDevice] = useState(null);
  const [attr, setAttr] = useState("temperature");


  const [openChart, setOpenChart] = useState(false);

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Form submitted!");
    setOpenChart(!openChart);
  };

  useEffect(() => {
    if (!Array.isArray(props.devices))
        return;
    
    setIncubators(props.devices.map((device) => ({label: "Estufa " + device.device_id.substring(device.device_id.indexOf('dmie') + 4), value: device.entity_name})));
  }, [props.devices]);

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, {zIndex: 2 }]}>
        <Text>Estufa:</Text>
        <DropDownPicker
          items={incubators}
          defaultValue={device}
          containerStyle={{ height: 40, width: 200 }}
          style={{ backgroundColor: "#fafafa"}}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa"}}
          onChangeItem={(item) => setDevice(item.value)}
          open={openDevice}
          setOpen={setOpenDevice}
          value={deviceValue}
          setValue={setDeviceValue}
        />
      </View>

      <View style={[styles.inputContainer, {zIndex: 1 }]}>
        <Text>Parâmetro:</Text>
        <DropDownPicker
          items={[
            { label: "Temperatura", value: "temperature" },
            { label: "Umidade", value: "humidity" },
          ]}
          defaultValue={attr}
          containerStyle={{ height: 40, width: 200 }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa"}}
          onChangeItem={(item) => setAttr(item.value)}
          open={openParam}
          setOpen={setOpenParam}
          value={paramValue}
          setValue={setParamValue}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Data de:</Text>
        <CustomTimePicker setDate={(date) => console.log(date)} />
      </View>

      <View style={styles.inputContainer}>
        <Text>Data até:</Text>
        <CustomTimePicker setDate={(date) => console.log(date)} />
      </View>

      <View>
        <Button title="Pesquisar" onPress={handleSubmit} />
      </View>

      {openChart &&
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Tela em desenvolvimento 😜</Text>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",

    padding: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
    chartContainer: {
        width: "100%",
        height: 300,
        backgroundColor: "#F5FCFF",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        margin: 10,
    },
    chartTitle: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
});

const mapStateToProps = (state) => {
  return {
      devices: state.devices.devices,
  };
};

export default connect(mapStateToProps)(GraphScreen);
