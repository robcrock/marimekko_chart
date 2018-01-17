// START ----- MARGIN CONVENTION

const margin = { top: 30, right: 10, bottom: 30, left: 300 },
  width = 700 - margin.left - margin.right,
  height = 3000 - margin.top - margin.bottom;

const svg = d3.select('body')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// END ----- MARGIN CONVENTION

// START ----- COMPONENTS BEFORE DATA

const xScale = d3.scaleLinear().range([0, width]); // scales data along xAxis
const xAxis = d3.axisTop(xScale); // single scale along the top
const yScalePerState = d3.scaleLinear(); // individual yScale for each state group
const state = function (d) { return d.key; }; // return State name
const stateBand = d3.scaleBand().range([0, height]); // evenly distributes states
const statePosition = function (d) { return stateBand(state(d)); }; // positions states next to their group
const stateLabel = d3.axisLeft(stateBand); // state labels each bank

// END ----- COMPONENTS BEFORE DATA

// START ----- DATA IMPORT

d3.csv('household_income.csv', function(error, data) {

  if (error) throw error;

// STATE ----- DATA PREP

  const householdsIn2016 = data.filter(function (d) {
    return d.year === '2016';
  });

  householdsIn2016.forEach(function(d) {

    d.bar_width = +d.bar_width; // convert bar_width to a Number
    d.number_of_households = +d.number_of_households; // convert households to a Number
    d.percent_of_total = +d.percent_of_total; // convert percent_of_total to a Number

    switch(d.income_level) { // assign an index to each income_level to use for sorting
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
    };

  });

  // nest values within each state
  let nested = d3.nest()
    .key(function (d) { return d.state; })
    .entries(householdsIn2016);

  // sort income_levels by the income_index
  nested.forEach(function(state) {
    state.values.sort(function(a, b) {
      return a.income_index - b.income_index;
    })
  });

  // sort states by the "less than $10,000" income_level by default
  nested.sort(function (a, b) {
    return b.values[0].percent_of_total - a.values[0].percent_of_total;
  });

  nested.forEach(function (state) {
    let accumulator = 0;
    state.values.forEach(function (d) {
      d.offset = accumulator;
      accumulator += d.bar_width
    })
  });

// END ----- DATA PREP

// START ----- INCORPORATE DATA INTO COMPONENTS

  stateBand.domain(nested.map(function (d) { return d.key; }));

  xScale.domain([0, stateBand.domain().length]);

  const marimekkoChartHeight = height / stateBand.domain().length;

  yScalePerState
    .domain([0, d3.max(householdsIn2016, d => d.percent_of_total)])
    .range([marimekkoChartHeight, 0]);

// END ----- INCORPORATE DATA INTO COMPONENTS

// START ----- ADD ELEMENTS TO THE SCREEN

  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .call(stateLabel);

  const gState = svg.append('g')
    .selectAll('g').data(nested)
    .enter()
    .append('g').attr('transform', function (d) {
        let ty = statePosition(d) - stateBand.bandwidth() + marimekkoChartHeight/2;
        return 'translate(0,' + ty + ')';
    });
    
    gState
      .selectAll('.bar').data(d => d.values)
      .enter().append("rect")
        .attr("x", (d, i) => xScale(d.offset))
        .attr("y", d => yScalePerState(d.percent_of_total))
        .attr("width", d => xScale(d.bar_width))
        .attr("height", d => yScalePerState(0) - yScalePerState(d.percent_of_total))
        .style("fill", '#ccc');
});

// END ----- DATA IMPORT