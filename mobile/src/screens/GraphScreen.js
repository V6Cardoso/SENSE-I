import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

import CustomTimePicker from "../components/CustomTimePicker";
import STHCometGraph from '../components/STHCometGraph';

import styles from "../utils/styles";

const GraphScreen = (props) => {
  const [openParam, setOpenParam] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);

  const [incubators, setIncubators] = useState([]);

  const [device, setDevice] = useState(null);
  const [attr, setAttr] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const [search, setSearch] = useState(false);

  const validateForm = () => {
    return device && attr && dateFrom && dateTo;
  };

  const handleSearch = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Preencha todos os campos para gerar o gráfico');
      return;
    }

    setSearch(true);
  };

  useEffect(() => {
    setSearch(false);
  }, [device, attr, dateFrom, dateTo]);

  useEffect(() => {
    if (!Array.isArray(props.devices))
      return;

    setIncubators(props.devices.map((device) => ({
      label: "Estufa " + device.device_id.substring(device.device_id.indexOf('dmie') + 4),
      value: device.entity_name
    })));
  }, [props.devices]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gráficos</Text>
      <View style={style.inputContainer}>
        <View style={style.section}>
          <View style={[style.dropdownContainer, { zIndex: 2 }]}>
            <Text style={style.textLabel}>Estufa:</Text>
            <DropDownPicker
              placeholder="Selecione a estufa"
              items={incubators}
              defaultValue={device}
              containerStyle={style.dropdown}
              style={[styles.modernButton, {marginHorizontal: 0, borderColor: 'white'}]}
              dropDownContainerStyle={[styles.modernButton, {marginHorizontal: 0, padding: 0, borderColor: 'white'}]}
              onChangeItem={(item) => setDevice(item.value)}
              open={openDevice}
              setOpen={setOpenDevice}
              value={device}
              setValue={setDevice}
            />
          </View>

          <View style={[style.dropdownContainer, { zIndex: 1 }]}>
            <Text style={style.textLabel}>Parâmetro:</Text>
            <DropDownPicker
              placeholder="Selecione o parâmetro"
              items={[
                { label: "Temperatura", value: "temperature" },
                { label: "Umidade", value: "humidity" },
              ]}
              defaultValue={attr}
              containerStyle={style.dropdown}
              style={[styles.modernButton, {marginHorizontal: 0, borderColor: 'white'}]}
              dropDownContainerStyle={[styles.modernButton, {marginHorizontal: 0, padding: 0, borderColor: 'white'}]}
              onChangeItem={(item) => setAttr(item.value)}
              open={openParam}
              setOpen={setOpenParam}
              value={attr}
              setValue={setAttr}
            />
          </View>
        </View>

        <View style={style.section}>
          <View style={style.inputWrapper}>
            <Text style={style.textLabel}>Data de:</Text>
            <CustomTimePicker setDate={setDateFrom} />
          </View>

          <View style={style.inputWrapper}>
            <Text style={style.textLabel}>Data até:</Text>
            <CustomTimePicker setDate={setDateTo} />
          </View>
        </View>

        <TouchableOpacity style={styles.modernButton} onPress={handleSearch}>
          <Text >Pesquisar</Text>
          <Icon name="search" size={20} color="#4682b4" />
        </TouchableOpacity>

        {search && (
          <STHCometGraph device={device} attr={attr} dateFrom={dateFrom} dateTo={dateTo} />
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdown: {
    height: 40,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  textLabel: {
    fontSize: 16,
    color: "#F5FCFF",
    marginBottom: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    devices: state.devices.devices,
  };
};

export default connect(mapStateToProps)(GraphScreen);
