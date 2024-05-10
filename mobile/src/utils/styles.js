import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#5e5e6d',
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
        color: '#F5FCFF',
    },
    modernButton: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
});

export default styles;