import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from '../utils/styles';
import CustomModal from './CustomModal';

import { insertExperiment } from '../database/dbSenseI';

const ExperimentModal = (props) => {
    const [name, setName] = useState('');
    const [incubator, setIncubator] = useState('');
    const [incubators, setIncubators] = useState([{label: 'Estufa 1', value: 'estufa1'}, {label: 'Estufa 2', value: 'estufa2'}]); 
    const [temperature, setTemperature] = useState(null);
    const [temperatureLowThreshold, setTemperatureLowThreshold] = useState(null);
    const [temperatureHighThreshold, setTemperatureHighThreshold] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [humidityLowThreshold, setHumidityLowThreshold] = useState(null);
    const [humidityHighThreshold, setHumidityHighThreshold] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [startTimestamp, setStartTimestamp] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [endTimestamp, setEndTimestamp] = useState(new Date());
    const [observation, setObservation] = useState('');

    const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [openEndTimePicker, setOpenEndTimePicker] = useState(false);
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
    
    const [openPicker, setOpenPicker] = useState(false);


    const submitHandler = async () => {
        const experiment = {
            name: name,
            incubator: incubator,
            temperature: temperature,
            temperatureLowThreshold: temperatureLowThreshold,
            temperatureHighThreshold: temperatureHighThreshold,
            humidity: humidity,
            humidityLowThreshold: humidityLowThreshold,
            humidityHighThreshold: humidityHighThreshold,
            startTimestamp: Math.floor(new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                startTimestamp.getHours(),
                startTimestamp.getMinutes(),
                startTimestamp.getSeconds()
            ).getTime() / 1000),
            endTimestamp: Math.floor(new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(),
                endTimestamp.getHours(),
                endTimestamp.getMinutes(),
                endTimestamp.getSeconds()
            ).getTime() / 1000),
            status: 'active',
            createdTimestamp: Math.floor(new Date().getTime() / 1000),
            observation: observation,
        };
        console.log(JSON.stringify(experiment));
        await insertExperiment(experiment);
        props.onSubmit();
    }

  
    return (
        <CustomModal
            title={props.title}
            visible={props.visible}
            onCancel={props.onCancel}
            submitText={props.submitText}
            onSubmit={submitHandler}
            submitColorRipple="#4682b4"
            submitColor="#2b5d86"
            cancelColor="gray"
            cancelColorRipple="gray"
        >
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                <Text style={style.text}>Nome do Experimento</Text>
                <TextInput
                    style={style.input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    />
                <Text style={style.text}>Temperatura de operação</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    value={temperature}
                    keyboardType="numeric"
                    onChangeText={(text) => setTemperature(text)}
                    />
                <Text style={style.text}>Limite inferior de temperatura</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    value={temperatureLowThreshold}
                    keyboardType="numeric"
                    onChangeText={(text) => setTemperatureLowThreshold(text)}
                    />
                <Text style={style.text}>Limite superior de temperatura</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    value={temperatureHighThreshold}
                    keyboardType="numeric"
                    onChangeText={(text) => setTemperatureHighThreshold(text)}
                    />
                <Text style={style.text}>Umidade de operação</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    value={humidity}
                    keyboardType="numeric"
                    onChangeText={(text) => setHumidity(text)}
                    />
                <Text style={style.text}>Limite inferior de umidade</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    value={humidityLowThreshold}
                    keyboardType="numeric"
                    onChangeText={(text) => setHumidityLowThreshold(text)}
                    />
                <Text style={style.text}>Limite superior de umidade</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    value={humidityHighThreshold}
                    keyboardType="numeric"
                    onChangeText={(text) => setHumidityHighThreshold(text)}
                    />

                <Text style={style.text}>Início do experimento</Text>

                <TouchableOpacity onPress={() => setOpenStartDatePicker(true)}>
                    <Text>{startDate.toDateString()}</Text>
                </TouchableOpacity>
                {openStartDatePicker &&
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setOpenStartDatePicker(false);
                            setStartDate(selectedDate);
                        }}
                        />
                }
                
                <TouchableOpacity onPress={() => setOpenStartTimePicker(true)}>
                    <Text>{startTimestamp.toTimeString()}</Text>
                </TouchableOpacity>
                {openStartTimePicker && 
                    <DateTimePicker
                        value={startTimestamp}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setOpenStartTimePicker(false);
                            setStartTimestamp(selectedDate);
                        }}
                        
                        />
                }

                

                
                <Text style={style.text}>Fim do experimento</Text>
                <TouchableOpacity onPress={() => setOpenEndDatePicker(true)}>
                    <Text>{endDate.toDateString()}</Text>
                </TouchableOpacity>
                {openEndDatePicker &&
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setOpenEndDatePicker(false);
                            setEndDate(selectedDate);
                        }}
                        />
                }

                <TouchableOpacity onPress={() => setOpenEndTimePicker(true)}>
                    <Text>{endTimestamp.toTimeString()}</Text>
                </TouchableOpacity>
                {openEndTimePicker &&
                    <DateTimePicker
                        value={endTimestamp}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setOpenEndTimePicker(false);
                            setEndTimestamp(selectedDate);
                        }}
                        />
                }


                



                <Text style={style.text}>Estufa</Text>
                <DropDownPicker
                    open={openPicker}
                    value={incubator}
                    items={incubators}
                    placeholder="Selecione a estufa"
                    setOpen={setOpenPicker}
                    setValue={setIncubator}
                    style={[style.input, style.dropDownPicker]}
                    dropDownContainerStyle={style.dropDownContainerStyle}
                    />

                <Text style={style.text}>Observação</Text>
                <TextInput
                    style={[style.input, style.textArea]}
                    multiline
                    value={observation}
                    onChangeText={(text) => setObservation(text)}
                    />
            </ScrollView>
   
        
      </CustomModal>
    );
};

const style = StyleSheet.create({
    container: {
        padding: 5,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: "black",
    },
    input: {
        borderWidth: 1,
        borderColor: "lightgray",
        padding: 10,
        marginBottom: 10,
        width: 300,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlign: "left",
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: "white",
        color: "black",
        fontSize: 16,
        lineHeight: 20,
    },
    dropDownPicker: {
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    dropDownContainerStyle: {
        width: 300,
        borderRadius: 10,
        backgroundColor: "white",
        borderColor: "lightgray",
        borderWidth: 1,
    },

    textArea: {
        height: 150,
        textAlignVertical: "top",
    },
    
});

export default ExperimentModal;