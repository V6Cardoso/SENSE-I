import { useState, useEffect } from "react";
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
  TouchableOpacity,
} from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

function CustomTimePicker(props) {
    const [date, setDate] = useState(props.date || new Date());
    const [time, setTime] = useState(props.date || new Date());

    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        setDateTime(new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes()));
        props.setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes()));
    }, [date, time]);

    

  return (
    <View style={styles.clockContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setOpenDatePicker(true)}>
            <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {openDatePicker &&
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                    setOpenDatePicker(false);
                    setDate(selectedDate);
                }}
                />
        }
        
        <TouchableOpacity style={styles.button}  onPress={() => setOpenTimePicker(true)}>
            <Text>{time.getHours()} : {time.getMinutes().toString().padStart(2, '0')}</Text>
        </TouchableOpacity>
        {openTimePicker && 
            <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                    setOpenTimePicker(false);
                    setTime(selectedDate);
                }}
                
                />
        }
    </View>
  );
}

export default CustomTimePicker;

const styles = StyleSheet.create({
    clockContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        padding: 10,
    }

});
