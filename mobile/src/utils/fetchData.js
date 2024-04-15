import Config from "react-native-config";

function getOrionData() {
    /* Config.TEST_URL  not working yet*/ 
    return fetch("",{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Fiware-Service': 'smart',
            'Fiware-ServicePath': '/'
        }
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
    };

function getSthCometData(device, attr) {
    let endpoint = Config.STHComet_URL + device + '/attrs/' + attr;
    return fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
    };

export { getOrionData, getSthCometData };