import Config from "react-native-config";

function sendToken(token) {
    const urlEncodedData = "pushToken=" + encodeURIComponent(token);
    return fetch("", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error);
            return error;
        }
    );
};

function sendExperiment(experiment) {
    return fetch(Config.EXPERIMENT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(experiment)
    })
        .then(response => response.json())
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error);
            return error;
        }
    );
};

function getDevices() {
    return fetch("",{
        method: 'GET',
        headers: {
            'Accept': 'application/json'
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
}

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

export { getDevices, getOrionData, getSthCometData, sendToken, sendExperiment};