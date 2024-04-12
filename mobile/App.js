import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import EstufasScreen from './src/screens/EstufasScreen';
import AboutScreen from './src/screens/AboutScreen';

export default function App() {
  return (
    <>
      <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Estufas" 
          component={EstufasScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="tablet-landscape-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="Sobre" 
          component={AboutScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="information-circle-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
