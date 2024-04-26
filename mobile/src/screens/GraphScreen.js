import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
  Dimensions,

} from "react-native";
import { Svg, Rect, Text as TextSVG } from 'react-native-svg';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Ionicons";

import { connect } from "react-redux";

import CustomTimePicker from "../components/CustomTimePicker";
import { getSthCometData } from "../utils/fetchData";
import styles from "../utils/styles";

const GraphScreen = (props) => {
  const [openParam, setOpenParam] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);

  const [incubators, setIncubators] = useState([]);

  const [device, setDevice] = useState(null);
  const [attr, setAttr] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);


  const [chartData, setChartData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({x: 0, y: 0, value: 0, visible: false, index: 0});

  const validateForm = () => {
    return device && attr && dateFrom && dateTo;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Preencha todos os campos para gerar o gráfico');
      return;
    }

    let data = await getSthCometData(device, attr, dateFrom, dateTo);
    console.log(data);

    if (data.length === 0) {
      Alert.alert('Aviso', 'Não há dados para o período selecionado');
      return;
    }

    let chartData = {
      labels: data.map((item) => item.date),
      datasets: [
        {
          data: data.map((item) => item.value),
        },
      ],
    };

    setChartData(chartData);

  };

  useEffect(() => {
    if (!Array.isArray(props.devices))
        return;
    
    setIncubators(props.devices.map((device) => ({label: "Estufa " + device.device_id.substring(device.device_id.indexOf('dmie') + 4), value: device.entity_name})));
  }, [props.devices]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gráficos</Text>
      <View style={style.inputContainer}>
        <View style={style.section}>
          <View style={[style.buttonContainer, {zIndex: 2 }]}>
            <Text>Estufa:</Text>
            <DropDownPicker
              placeholder="Selecione a estufa"
              items={incubators}
              defaultValue={device}
              containerStyle={{ height: 40, width: 200 }}
              style={[styles.modernButton, {marginHorizontal: 0, borderColor: 'white'}]}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownContainerStyle={[styles.modernButton, {marginHorizontal: 0, padding: 0, borderColor: 'white'}]}
              onChangeItem={(item) => setDevice(item.value)}
              open={openDevice}
              setOpen={setOpenDevice}
              value={device}
              setValue={setDevice}
            />
          </View>

          <View style={[style.buttonContainer, {zIndex: 1 }]}>
            <Text>Parâmetro:</Text>
            <DropDownPicker
              placeholder="Selecione o parâmetro"
              items={[
                { label: "Temperatura", value: "temperature" },
                { label: "Umidade", value: "humidity" },
              ]}
              defaultValue={attr}
              containerStyle={{ height: 40, width: 200 }}
              style={[styles.modernButton, {marginHorizontal: 0, borderColor: 'white'}]}
              itemStyle={{
                justifyContent: "flex-start",
              }}
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
          <View style={style.buttonContainer}>
            <Text>Data de:</Text>
            <CustomTimePicker setDate={setDateFrom} />
          </View>

          <View style={style.buttonContainer}>
            <Text>Data até:</Text>
            <CustomTimePicker setDate={setDateTo} />
          </View>
        </View>

        <TouchableOpacity style={styles.modernButton} onPress={handleSubmit}>
            <Text >Pesquisar</Text>
            <Icon name="search" size={20} color="#4682b4" />
        </TouchableOpacity>

        {chartData &&
          <View style={style.chartContainer}>
              <LineChart
                data={chartData}
                width={screenWidth - 0}
                height={380}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                formatXLabel={(value) => {
                    let dateHasDay = dateFrom.getDate() !== dateTo.getDate();
                    let label = "";
                    let date = new Date(value);
                    if (dateHasDay) {
                      label += date.getDate() + "/" + (date.getMonth() + 1) + " ";
                    }
                    label += ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                    return label;
                }}
                yAxisSuffix={attr === "temperature" ? "°C" : "%"}
                onDataPointClick={
                  (data) => {
                     let isSamePoint = (tooltipPos.x === data.x 
                                         && tooltipPos.y ===  data.y)
                   
                     isSamePoint ? setTooltipPos((previousState)=> {
                                        return {
                                             ...previousState, 
                                             value: data.value,
                                             index: data.index,
                                             visible: !previousState.visible}
                                        })
                                  : 
                                setTooltipPos({x: data.x, 
                                    y: data.y,
                                    value: data.value,
                                    index: data.index,
                                    visible: true
                                });
                   }
                }
                decorator={() => {
                    return tooltipPos.visible ? (
                    <View>
                      <Svg>
                      <Rect x={tooltipPos.x - 15} y={tooltipPos.y + 10} width="40" height="30" fill="transparent" />
                      <TextSVG
                        x={tooltipPos.x - (tooltipPos.index > 4 ? 20 : 0)}
                        y={tooltipPos.y + 30}
                        fill="#000"
                        fontSize="16"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {new Date(chartData.labels[tooltipPos.index]).toLocaleDateString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </TextSVG>
                      </Svg>
                    </View>
                    ) : null;
               }}
              />
          </View>
        }
      </View>
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#ffffff",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(70, 130, 180, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
  fillShadowGradient: "#4682b4",
  fillShadowGradientOpacity: 1,
};

const screenWidth = Dimensions.get("window").width;

const style = StyleSheet.create({
  section: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
  },
  buttonContainer: {
    marginBottom: 10,
  },
  chartContainer: {
    width: "100%",
    height: 380,
    backgroundColor: "#F5FCFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
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
