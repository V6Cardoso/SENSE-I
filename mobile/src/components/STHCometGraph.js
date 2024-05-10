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

import { getSthCometData } from "../utils/fetchData";

const STHCometGraph = (props) => {
    const [chartData, setChartData] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({x: 0, y: 0, value: 0, visible: false, index: 0});

    const [device, setDevice] = useState(null);
    const [attr, setAttr] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);

    useEffect(() => {
        if (!props.device || !props.attr || !props.dateFrom || !props.dateTo
            || (props.device == device && props.attr == attr && props.dateFrom == dateFrom && props.dateTo == dateTo)) {
            return;
        }

        console.log('querying data', props.device, props.attr, props.dateFrom, props.dateTo);

        setDevice(props.device);
        setAttr(props.attr);
        setDateFrom(props.dateFrom);
        setDateTo(props.dateTo);

        fetchData(props.device, props.attr, props.dateFrom, props.dateTo);
    }, [props.device, props.attr, props.dateFrom, props.dateTo]);

    const fetchData = async (device, attr, dateFrom, dateTo) => {
        setChartData(null);
        let data = await getSthCometData(device, attr, dateFrom, dateTo);
    
        if (data.length === 0) {
          noDataReturned();
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

      const noDataReturned = () => {
        if (props.showNoDataAlert) {
            Alert.alert('Aviso', 'Não há dados para o período selecionado');
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.chartTitle}>Não há dados para o período selecionado</Text>
                </View>
            );
        }
      }


    

    
        
    return (
        <View style={styles.container}>
            {chartData &&
                <View style={styles.chartContainer}>
                    <LineChart
                    data={chartData}
                    width={screenWidth - 0}
                    height={380}
                    verticalLabelRotation={30}
                    chartConfig={chartConfig}
                    formatXLabel={(value) => {
                        let dateHasDay = props.dateFrom.getDate() !== props.dateTo.getDate();
                        let label = "";
                        let date = new Date(value);
                        if (dateHasDay) {
                            label += date.getDate() + "/" + (date.getMonth() + 1) + " ";
                        }
                        label += ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                        return label;
                    }}
                    yAxisSuffix={props.attr === "temperature" ? "°C" : "%"}
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
    );

}

const styles = StyleSheet.create({
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
    container: {
    
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

export default STHCometGraph;