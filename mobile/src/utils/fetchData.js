import Config from "react-native-config";

function sendToken(token) {
    const urlEncodedData = "pushToken=" + encodeURIComponent(token);
    console.log(urlEncodedData);
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

function sendExperiment(experiment, token) {
    return fetch("", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            experiment: experiment,
            pushToken: token})
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

function removeExperiment(id) {
    const urlEncodedData = "id=" + encodeURIComponent(id);
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
}


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

function getSthCometData(device, attr, dateFrom, dateTo) {
    return fetch("", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "device=" + encodeURIComponent(device) +
              "&attr=" + encodeURIComponent(attr) +
              "&dateFrom=" + encodeURIComponent(dateFrom) +
              "&dateTo=" + encodeURIComponent(dateTo) +
              "&samples=10"
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

export { getDevices, getOrionData, getSthCometData, sendToken, sendExperiment, removeExperiment};