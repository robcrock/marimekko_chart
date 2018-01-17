const margin = { top: 30, right: 10, bottom: 30, left: 300 },
  width = 700 - margin.left - margin.right,
  height = 3000 - margin.top - margin.bottom;

const svg = d3.select('body')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const xScale = d3.scaleLinear().range([0, width]),
  xValue = function (d) { return xScale(x(d)); },
  xAxis = d3.axisBottom(xScale);

// var y = function (d) { return d.percent_of_total; },
const yScale = d3.scaleLinear();

const state = function (d) { return d.key; },
  stateScaleG = d3.scaleBand().range([0, height]),
  statePositionG = function (d) { return stateScaleG(state(d)); },
  stateAxisG = d3.axisLeft(stateScaleG);

d3.csv('household_income.csv', function(error, data) {
  if (error) throw error;

  // Filter for only 2016 households
  const households_2016 = data.filter(function(d) {
    return d.year === '2016';
  })

  // Clean up data types
  households_2016.forEach(function(d) {
    d.bar_width = +d.bar_width;
    d.number_of_households = +d.number_of_households;
    d.percent_of_total = +d.percent_of_total;
    switch(d.income_level) {
      case 'Less than $10,000': d.income_index = 0
        break;
      case '$10,000 to $14,999': d.income_index = 1
        break;
      case '$15,000 to $19,999': d.income_index = 2
        break;
      case '$20,000 to $24,999': d.income_index = 3
        break;
      case '$25,000 to $29,999': d.income_index = 4
        break;
      case '$30,000 to $34,999': d.income_index = 5
        break;
      case '$35,000 to $39,999': d.income_index = 6
        break;
      case '$40,000 to $44,999': d.income_index = 7
        break;
      case '$45,000 to $49,999': d.income_index = 8
        break;
      case '$50,000 to $59,999': d.income_index = 9
        break;
      case '$60,000 to $74,999': d.income_index = 10
        break;
      case '$75,000 to $99,999': d.income_index = 11
        break;
      case '$100,000 to $124,999': d.income_index = 12
        break;
      case '$125,000 to $149,999': d.income_index = 13
        break;
      case '$150,000 to $199,999': d.income_index = 14
        break;
      case '$200,000 or more': d.income_index = 15
        break;
    }
  })

  let dataFlat = d3.nest()
    .key(function (d) { return d.state; })
    .entries(households_2016);

  dataFlat.sort(function (a, b) {
    return b.values[0].percent_of_total - a.values[0].percent_of_total;
  });

  xScale
    .domain([0, 44]);

  stateScaleG
    .domain(dataFlat.map(function (d) { return d.key; }));

  const marimekkoChartHeight = height / stateScaleG.domain().length;

  yScale
    // .domain([0, 1])
    .domain([0, d3.max(households_2016, d => d.percent_of_total)])
    .range([marimekkoChartHeight, 0]);

  svg.append('g').attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g').attr('class', 'axis axis--state')
    .call(stateAxisG);

  const gState = svg
    .append('g')
      .attr('class', 'states')
    .selectAll('.state').data(dataFlat)
    .enter().append('g')
      .attr('class', function (d) { return 'state state--' + d.key; })
      .attr('transform', function (d) {
        let ty = statePositionG(d) - stateScaleG.bandwidth() + marimekkoChartHeight/2; // <- Adjust relative position of each chart here
        return 'translate(0,' + ty + ')';
    });


  dataFlat.forEach(function (state) {
    let accumulator = 0;
    state.values.forEach(function(d) {
      d.offset = accumulator;
      accumulator += d.bar_width
    })
  });

  gState.selectAll('.bar')
    .data(d => d.values)
    .enter().append("rect")
    .attr("class", "bar")
    // .attr("x", (d, i) => xScale(i * 2.5))
    .attr("x", (d, i) => xScale(d.offset))
    .attr("width", d => xScale(d.bar_width))
    .attr("height", d => yScale(0) - yScale(d.percent_of_total))
    .attr("y", d => yScale(d.percent_of_total))
    .style("fill", '#ccc');

  //////////////////// HANDY FUNCTIONS ////////////////////

  // Sorts stat by income_level
  function sortStatesBySelectedIncome(data, selectedIncome) {
    let statesAtLevel = [];

    // statesAtLevel = data.filter(function(d) {
    //   return d.income_level === selectedIncome;
    // })

    statesAtLevel.push(data.sort(function (a, b) { return b.percent_of_total - a.percent_of_total; }));

    return statesAtLevel;
  }

  // *** Don't forget about this cool trick Sort states by peak income level
  // EXPERIMENT WITH SORTING FUNCTIONS
  
  // log whole data set
  // console.log(dataFlat);

  // log only states
  // dataFlat.forEach(function(d) {
  //   console.log(d.key);
  // })

  // log sorted states
  // dataFlat.forEach(function(d) {

  //   // console.log(d.values);

  //   d.values.sort(function (a, b) {
  //     return a.percent_of_income - b.percent_of_income;
  //   });

  // })

  console.log(dataFlat);

  // dataFlat.forEach(function (d) {
  //   sortStatesBySelectedIncome(d.values, '$200,000 or more')
  // });

  // dataFlat.sort(function (a, b) { return a.time - b.time; });

  // dataFlat.forEach(function (d) {
  //   d.values.sort(function (a, b) {
  //     return a.income_index - b.income_index;
  //   })
  // });

  // d3.scan(dataFlat[0].values, function (a, b) {
  //   return b.percent_of_total - a.percent_of_total;
  // })

  // function peakIncomeLevel(d) {
  //   let i = d3.scan(d.values, function (a, b) { return y(b.percent_of_total) - y(a.percent_of_total); });
  //   return d.values[i];
  // };

  // TEST RUNS OF HANDY FUNCTIONS
  // console.log(sortStatesBySelectedIncome(households_2016, '$10,000 to $14,999'));
  // console.log(computeOffset(households_2016, 'Alabama'));

})

//////////////////// THE CODE BELOW MAKES A SINGLE MARIMEKKO ////////////////////
////////////////////////////////////////////////////////////////////////////////.

// // START - D3 margin convention
// const width = 500,
//   height = 270,
//   margin = { top: 25, right: 50, bottom: 50, left: 50 };

// const svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .style('border', '1px solid #000')
//   .append("g")
//     .attr("transform", `translate( ${margin.left}, ${margin.top} )`);
// // END - D3 margin convention

// // START - chart helpers
// let totalOffset = 0;

// const xScale = d3.scaleLinear()
//     .range([0, width - margin.left - margin.right]),
//   yScale = d3.scaleLinear()
//     .range([height - margin.top - margin.bottom, 0]);

// const p = d3.format(".0%");
// // END - chart helpers

// // START - Data driven designs
// d3.json("marimekko.json", function (error, data) {

//   if (error) throw error;

//   // Compute the bar offset
//   totalOffset = data.reduce(function (v, p) {
//     return (p.offset = v) + p.barWidth;
//   }, 0);

//   xScale.domain([0, totalOffset])

//   console.log(xScale(10));

//   yScale.domain([0, d3.max(data, d => d.percent_of_total)])

//   // Add a group for each segment.
//   var states = svg.selectAll("rect")
//     .data(data)
//     .enter().append("rect")
//     .attr('x', d => xScale(d.offset))
//     .attr("y", d => yScale(d.percent_of_total))
//     .attr("height", d => height - margin.top - margin.bottom - yScale(d.percent_of_total))
//     .attr("width", function (d) { return xScale(d.barWidth); })
//     .style("fill", '#ccc');

/* TEXT LABELS

  // // Add x-axis ticks.
  // var xtick = svg.selectAll(".x")
  //   .data(xScale.ticks(10))
  //   .enter().append("g")
  //   .attr("class", "x")
  //   .attr("transform", d => `translate( ${xScale(d)} , ${height - margin.top - margin.bottom} )`);

  // xtick.append("text")
  //   .attr("y", 5)
  //   .attr("text-anchor", "middle")
  //   .attr("dy", ".71em")
  //   .text(p);

  // // Add y-axis ticks.
  // const ytick = svg.selectAll(".y")
  //   .data(yScale.ticks(10))
  //   .enter().append("g")
  //   .attr("class", "y")
  //   .attr("transform", d => `translate( 0, ${yScale(d)})`);

  // ytick.append("text")
  //   .attr("x", -8)
  //   .attr("text-anchor", "end")
  //   .attr("dy", ".35em")
  //   .text(p);

*/

// });
