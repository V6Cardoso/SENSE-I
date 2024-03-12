import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>SenseI: Monitoramento Ambiental para Laboratórios</Text>
            <Text style={styles.text}>
                Desenvolvemos o SenseI, um sistema inovador que utiliza IoT e dashboards dinâmicos para monitorar
                 indicadores em laboratórios da Engenharia de Alimentos. Nossa solução integra sensores à plataforma FIWARE,
                 proporcionando um ambiente eficiente e escalável para experimentos. O SenseI visa substituir métodos analógicos
                por tecnologias modernas, otimizando processos e facilitando o acompanhamento de experimentos.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',

    },
    text: {
        fontSize: 20,
        textAlign: 'justify',
        margin: 10,
    },
});

export default AboutScreen;