const margin = { top: 30, right: 10, bottom: 30, left: 300 },
  width = 700 - margin.left - margin.right,
  height = 1600 - margin.top - margin.bottom;

const svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// x = function (d) { return d.offset; },
const xScale = d3.scaleLinear().range([0, width]),
  xValue = function (d) { return xScale(x(d)); },
  xAxis = d3.axisBottom(xScale);

// var y = function (d) { return d.percent_of_total; },
const yScale = d3.scaleLinear();

const state = function (d) { return d.key; },
  stateScaleG = d3.scaleBand().range([0, height]),
  statePositionG = function (d) { return stateScaleG(state(d)); },
  stateAxisG = d3.axisLeft(stateScaleG);

// var area = d3.area()
//   .x(xValue)
//   .y1(yValue);

// mbostock example
// var area = d3.area()
//   .x(function (d) { return x(d.date); })
//   .y1(function (d) { return y(d.close); });

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
  })

  let dataFlat = d3.nest()
    .key(function (d) { return d.state; })
    .entries(households_2016);

  // *** Don't forget about this cool trick Sort states by peak income level
  // function peakIncomeLevel(d) {
  //   let i = d3.scan(d.values, function (a, b) { return y(b) - y(a); });
  //   return d.values[i];
  // };

  // dataFlat.sort(function (a, b) { return peakIncomeLevel(a) - peakIncomeLevel(b); });

  xScale
    .domain([0, 44]);

  stateScaleG
    .domain(dataFlat.map(function (d) { return d.key; }));

  // console.log(percentScale.domain())

  const marimekkoChartHeight = height / stateScaleG.domain().length;

  yScale
    // .domain([0, 1])
    .domain([0, d3.max(households_2016, d => d.percent_of_total)])
    .range([marimekkoChartHeight, 0]);

  // area.y0(yScale(0));

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

  // dataFlat.reduce(function (v, p) {
  //   console.log(p.values);
  //   return (p = v) + p.bar_width;
  // }, 0);

  // console.log(dataFlat);

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

  // console.log(dataFlat.values);

  // gState.append('path').attr('class', 'area')
  //   .datum(function (d) { return d.values; })
  //   .attr('d', area);

  // const gIncomeLevels = .selectAll('rect')
  //   .data(d => d.values).enter()
  //   .append('rect')
  //     .attr('class', 'bar')

    // .attr('x', x)
    // .attr('y', y)
    // .attr("height", d => yScale(d.percent_of_total))
    // .attr("width", d => xScale(d.barWidth) )
    // .style("fill", '#ccc');

  // console.log(dataFlat[0].values);

  //////////////////// HANDY FUNCTIONS ////////////////////

  // Compute bar offset
  function computeStateOffset(array) { //, state) {
    // console.log(array, state);

    // totalOffset will equal 42
    // let filteredArr = [];

    // filteredArr = array.filter(function(d) {
    //   return d.state === state;
    // });

    array.reduce(function (v, p) {
      return (p.offset = v) + p.bar_width;
    }, 0);

    // console.log(extendedValues);

    return extendedValues;

  }

  // Sorts stat by income_level
  function sortStatesBySelectedIncome(data, selectedIncome) {
    let statesAtLevel = [];

    statesAtLevel = data.filter(function(d) {
      return d.income_level === selectedIncome;
    })

    statesAtLevel.sort(function (a, b) { return b.percent_of_total - a.percent_of_total; });

    return statesAtLevel;
  }

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
