import Config from "react-native-config";

function getOrionData() {
    return fetch(Config.OrionAPI_URL)
        .then(response => response.json())
        .then(data => {
        return data;
        })
        .catch(error => {
        console.error(error);
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
        });
    };