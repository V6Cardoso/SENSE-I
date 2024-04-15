import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 

import store from "./context/store";
import { Provider } from "react-redux";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import EstufasScreen from './src/screens/EstufasScreen';
import GraphScreen from './src/screens/GraphScreen';
import ExperimentsScreen from './src/screens/ExperimentsScreen';

import { createTables } from "./src/database/dbSenseI";

export default function App() {

  let tabelasCriadas = false;

  async function createTablesHandler() {
    if (!tabelasCriadas) {
      await createTables();
      tabelasCriadas = true;
    }
  }

  useEffect(() => {
    createTablesHandler();
  }, []);



  return (
    <Provider store={store}>
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
          name="Gráficos" 
          component={GraphScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="bar-chart-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen 
        name="Meus experimentos"
        component={ExperimentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="flask-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}

      />
      </Tab.Navigator>
    </NavigationContainer>
    <StatusBar style="auto" />
    </Provider>
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
