// Set the dimensions of the chart
const margin = { top: 20, right: 30, bottom: 30, left: 50 };
const width = 650 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const grid = document.querySelector('.grid');

function Device(id, humidity, temperature, tempHumidity, tempTemperature) {
  this.id = id;
  this.humidity = humidity;
  this.temperature = temperature;
  this.tempHumidity = tempHumidity;
  this.tempTemperature = tempTemperature;
}

//compare two Devices
Device.prototype.equals = function (device) {
  return this.tempHumidity == device.tempHumidity && this.tempTemperature == device.tempTemperature;
}


let allData = {};

let svg = {};


//get data from Orion every second
function getData() {
  getOrionData();

  //check if data is type of array


  if (!Array.isArray(data) || data.length == 0)
    return;

  data.forEach(element => {
    element.id = element.id.split(':')[2];

    //let tempHumidity = new Date(element?.humidity?.metadata?.TimeInstant?.value);
    //let tempTemperature = new Date(element?.temperature?.metadata?.TimeInstant?.value);
    let tempHumidity = Date.now();
    let tempTemperature = Date.now();
    let humidity = element?.humidity?.value;
    let temperature = element?.temperature?.value;

    let device = new Device(element.id, humidity, temperature, tempHumidity, tempTemperature);

    //check if element.id is key in allData
    if (allData[element.id] != undefined) {
      //keeps only the last 10 values
      allData[element.id].push(device);
      if (allData[element.id].length > 10) {
        allData[element.id].shift();
      }

    }
    else {
      allData[element.id] = [];
      allData[element.id].push(device);

      const div = document.createElement('div');
      div.classList.add('container');
      const h3 = document.createElement('h3');
      h3.innerHTML = element.id;
      const p = document.createElement('p');
      p.innerHTML = 'Temperatura';
      const divChart = document.createElement('div');
      divChart.id = element.id;
      div.appendChild(h3);
      div.appendChild(p);
      div.appendChild(divChart);
      grid.appendChild(div);
        
      svg[element.id] = d3.select(`#${element.id}`)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("class", "x label")
        .append("g")
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const divHumidity = document.createElement('div');
      divHumidity.classList.add('container');
      const h3Humidity = document.createElement('h3');
      h3Humidity.innerHTML = element.id;
      const pHumidity = document.createElement('p');
      pHumidity.innerHTML = 'Umidade';
      const divChartHumidity = document.createElement('div');
      divChartHumidity.id = element.id + 'h';
      divHumidity.appendChild(h3Humidity);
      divHumidity.appendChild(pHumidity);
      divHumidity.appendChild(divChartHumidity);
      grid.appendChild(divHumidity);
        


      svg[element.id + 'h'] = d3.select(`#${element.id}h`)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    }
    updateGraph();
  });

  //console.log(JSON.stringify(allData));


}

setInterval(getData, 1000);





function updateGraph() {
  // Iterate over each element in the 'svg' object
  console.log(allData);
  for (let id in svg) {
      let auxId = id;
      if (id[id.length - 1] == 'h')
        auxId = id.substring(0, id.length - 1);


      // Remove the existing path
      svg[id].selectAll("path").remove();
      svg[id].selectAll("g").remove();

      // Define the scales
      const xScale = d3.scaleTime().range([0, width]);
      const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
      const line = d3.line();

      // Set the domains of the scales
      if (auxId == id) {
        xScale.domain(d3.extent(allData[auxId], function(d) { return d.tempTemperature; }));
        //yScale.domain([0, d3.max(allData[auxId], function(d) { return d.temperature; })]);
        line.x(function(d) { return xScale(d.tempTemperature); }) // replace 'd.x' with your actual x-value
        .y(function(d) { return yScale(d.temperature); }); // replace 'd.y' with your actual y-value
      }
      else {
        xScale.domain(d3.extent(allData[auxId], function(d) { return d.tempHumidity; }));
        //yScale.domain([0, d3.max(allData[auxId], function(d) { return d.humidity; })]);
        line.x(function(d) { return xScale(d.tempHumidity); }) // replace 'd.x' with your actual x-value
        .y(function(d) { return yScale(d.humidity); }); // replace 'd.y' with your actual y-value
      }
          

      // Create the axis generators
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M:%S"));
      const yAxis = d3.axisLeft(yScale);

      if (auxId == id) {
        svg[id].append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x",0 - (height / 2) - 20)
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .text("Temperatura");
      }
      else {
        svg[id].append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x",0 - (height / 2) - 20)
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .text("Umidade");
      }


      // Append the x-axis to the SVG
      svg[id].append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // Append the y-axis to the SVG
      svg[id].append("g")
        .call(yAxis);


      

      // Append the path and set the 'd' attribute
      svg[id].append("path")
          .datum(allData[auxId])
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);
  }
}


