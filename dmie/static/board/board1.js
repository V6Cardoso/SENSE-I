// Sample data (time and initial temperature)
let data = [
    { time: "00:00", temperature: 20 },
    { time: "01:00", temperature: 21 },
    { time: "02:00", temperature: 22 },
    // Add more data points here
];

// Set the dimensions of the chart
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create an SVG container
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create scales for x and y axes
const xScale = d3.scaleBand()
    .domain(data.map(d => d.time))
    .range([0, width])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.temperature)])
    .nice()
    .range([height, 0]);

// Create x and y axes
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

// Create initial bars for the chart
svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.time))
    .attr("y", d => yScale(d.temperature))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.temperature))
    .attr("fill", "steelblue");

// Function to update the chart with new data
function updateChart() {
    // Simulate new temperature data (replace with actual data retrieval)
    data = data.map(d => ({
        time: d.time,
        temperature: Math.random() * 10 + 20 // Random temperature between 20 and 30
    }));

    // Update the yScale domain with new data
    yScale.domain([0, d3.max(data, d => d.temperature)]);

    // Update the bars with new data
    svg.selectAll(".bar")
        .data(data)
        .transition()
        .duration(500) // Animation duration
        .attr("y", d => yScale(d.temperature))
        .attr("height", d => height - yScale(d.temperature));
}

// Call the updateChart function every second
setInterval(updateChart, 1000);




















// append the svg object to the body of the page
var svg2 = d3.select("#chart-container2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg2.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg2.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

})




var svg3 = d3.select("#chart-container3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


//basic api request
/* d3.json("http://20.226.95.43:1026/v2/entities", function(data) {
  
}); */


var svg4 = d3.select("#chart-container4")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var svg5 = d3.select("#chart-container5")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
