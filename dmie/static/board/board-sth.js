var lastN = document.querySelector('#lastN');
var hLimit = document.querySelector('#hLimit');
var hOffset = document.querySelector('#hOffset');
var dateFrom = document.querySelector('#dateFrom');
var dateTo = document.querySelector('#dateTo');

var sthcontainer = document.querySelector('#sth_comet_container');
var formConstruct = document.getElementById('sth_comet_construct_plot');

[lastN, hLimit, hOffset, dateFrom, dateTo].forEach(function(field) {
  field.addEventListener('input', checkFields);
});

function checkFields() {
  var hLimitValue = hLimit.value;
  var hOffsetValue = hOffset.value;
  var lastNValue = lastN.value;

  if (!hLimitValue && !hOffsetValue) {
      hLimit.removeAttribute("required");
      hOffset.removeAttribute("required");
      lastN.setAttribute("required", "");
  } else if (!lastNValue && (!hLimitValue || !hOffsetValue)) {
      hLimit.setAttribute("required", "");
      hOffset.setAttribute("required", "");
      lastN.removeAttribute("required");
  } else {
      hLimit.removeAttribute("required");
      hOffset.removeAttribute("required");
      lastN.removeAttribute("required");
  }
  
}



// CREATE PLOTLY CHARTS

let allSthData = {};

function createContainer(id) {
  var container = document.createElement('div');
  container.classList.add('container__sth');

  var titleElement = document.createElement('h3');
  titleElement.textContent = id;
  container.appendChild(titleElement);

  var comet = document.createElement('div');
  comet.id = id;
  comet.classList.add('plotly');
  container.appendChild(comet);

  var button = document.createElement('button');
  button.textContent = 'Excluir gráfico';
  button.classList.add('btn__delete__sth');
  //pass the id to the function
  button.dataset.id = id;
  button.addEventListener('click', deletePlotly);
  container.appendChild(button);

  sthcontainer.appendChild(container);
}



function trace(x, y, name, color, mode) {
  this.type = 'scatter';
  this.x = x;
  this.y = y;
  this.mode = mode;
  this.name = name;
  this.line = {
    color: color,
    width: 2
  };
}

function createPlotly(data, layout, div) {
  this.data = data;
  this.layout = layout;
  this.div = div;
  createContainer(div);
  Plotly.newPlot(div, data, layout, {displayModeBar: false, responsive: true});
}

var layoutSth = {  
  paper_bgcolor:'rgba(0,0,0,0)', 
  plot_bgcolor:'rgba(0,0,0,0)',
  font: {color: "#333"},
  transition: { duration: 500, easing: 'cubic-in-out' },
  /* xaxis: {
    title: 'x-axis title'
  },
  yaxis: {
    title: 'y-axis title'
  } */
};



function ungroupData(data) {
  var x = [];
  var y = [];
  data.forEach(function(d) {
    x.push(d.recvTime);
    y.push(d.attrValue);
  });
  return {x: x, y: y};
}


function updateSthComet() {
  formConstruct.classList.add('hidden');

  var params = {};
  for (var i = 0; i < formConstruct.elements.length; i++) {
      var element = formConstruct.elements[i];
      if (element.name) {
          params[element.name] = element.value;
      }
  }

  if (!Array.isArray(sthData?.value) || sthData.value?.length == 0)
    return;

  var data = ungroupData(sthData.value);
  var newData = new trace(data.x, data.y, params.plotLineName, params.plotColor, params.plotType);

  var plot = document.getElementById(params.plotTitle);
  if (plot) {
    allSthData[params.plotTitle].push(newData);
    Plotly.react(params.plotTitle, allSthData[params.plotTitle], layoutSth);
    return;
  }

  allSthData[params.plotTitle] = [newData];
  createPlotly(allSthData[params.plotTitle], layoutSth, params.plotTitle)

}

function deletePlotly() {
  var id = this.dataset.id;
  var container = document.getElementById(id).parentElement;
  container.remove();
  delete allSthData[id];
  
}