let lstUpdate1 = document.getElementById('orion__device1__last_update');
let lstUpdate2 = document.getElementById('orion__device2__last_update');



function OrionTemp(value) {
  this.domain = { x: [0, 1], y: [0, 1] };
  this.value = value;
  this.title = { text: "Temperatura (°C)" };
  this.type = "indicator";
  this.mode = "gauge+number";
  this.delta = { reference: 20 };
  this.gauge = { 
    axis: { 
      range: [null, 100],
      tickvals: [0, 20, 40, 60, 80, 100],
      ticktext: ['0', '20', '40', '60', '80', '100']
    },
    bar: { color: 'steelblue' },
  };
}

function OrionHumidity(value) {
  this.domain = { x: [0, 1], y: [0, 1] };
  this.value = value;
  this.title = { text: "Umidade" };
  this.type = "indicator";
  this.mode = "gauge+number";
  this.delta = { reference: 20 };
  this.gauge = { 
    axis: { 
      range: [null, 100],
      tickvals: [0, 20, 40, 60, 80, 100],
      ticktext: ['0', '20', '40', '60', '80', '100']
    },
    bar: { color: 'steelblue' }
  };
  this.number = { suffix: "%" };
  
}

var orionDevice1Temp = [new OrionTemp(0)];
var orionDevice1Hum = [new OrionHumidity(0)];
var orionDevice2Temp = [new OrionTemp(0)];
var orionDevice2Hum = [new OrionHumidity(0)];

var layout = {  width: 400, 
                height: 300, 
                paper_bgcolor:'rgba(0,0,0,0)', 
                plot_bgcolor:'rgba(0,0,0,0)',
                font: {color: "#333"},
                transition: { duration: 500, easing: 'cubic-in-out' }
                
            };

Plotly.newPlot('orion__device1__temp', orionDevice1Temp, layout, {displayModeBar: false, responsive: true});
Plotly.newPlot('orion__device1__hum', orionDevice1Hum, layout, {displayModeBar: false});
Plotly.newPlot('orion__device2__temp', orionDevice2Temp, layout, {displayModeBar: false});
Plotly.newPlot('orion__device2__hum', orionDevice2Hum, layout, {displayModeBar: false});


function updateCharts() {
  if (callInProgress) return;
  callInProgress = true;

  getOrionData();

  if (!Array.isArray(data) || data.length == 0)
    return;
  
  data.forEach(function (item) {
    if (item.id.includes('001')) {
      orionDevice1Temp[0].value = item.temperature.value;
      orionDevice1Hum[0].value = item.humidity.value;
      Plotly.react('orion__device1__temp', orionDevice1Temp, layout);
      Plotly.react('orion__device1__hum', orionDevice1Hum, layout);
      updateLastUpdate(lstUpdate1, item.TimeInstant?.value);
      
    }
    if (item.id.includes('002')) {
      orionDevice2Temp[0].value = item.temperature.value;
      orionDevice2Hum[0].value = item.humidity.value;
      Plotly.react('orion__device2__temp', orionDevice2Temp, layout);
      Plotly.react('orion__device2__hum', orionDevice2Hum, layout);
      updateLastUpdate(lstUpdate2, item.TimeInstant?.value);
    }
  });
}

function updateLastUpdate(lstUpdate, dateStr) {
  if (dateStr) {
    let date = new Date(dateStr);
    if (date) {
      let timeStr = date.toLocaleTimeString();
      lstUpdate.innerHTML = 'Última atualização em: ' + timeStr;
    }
  }
}

setInterval(updateCharts, 1000);