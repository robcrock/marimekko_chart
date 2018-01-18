// **************************************************
// MARGIN CONVENTION ********************************

const margin = { top: 30, right: 10, bottom: 30, left: 10 },
  width = 377 - margin.left - margin.right,
  height = 3000 - margin.top - margin.bottom;

const svg = d3.select('.chart')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// MARGIN CONVENTION ********************************
// **************************************************

// **************************************************
// COMPONENTS ***************************************

const xScale = d3.scaleLinear().range([0, width]).domain([0, 44]);; // scales data along xAxis
const customAxis = d3.axisTop(xScale).ticks(16); // single scale along the top
const xAxis = d3.axisTop(xScale); // single scale along the top
const state = d => d.key; // return State name
const stateBand = d3.scaleBand().range([0, height]); // evenly distributes states
const statePosition = d => stateBand(state(d)); // positions states next to their group
const stateLabel = d3.axisLeft(stateBand); // state labels each bank
const marimekkoChartHeight = height / 50; // 50 for 50 states
const lineFunction = d3.line()
  .x(d => xScale(d.x))
  .y(d => xScale(d.y));

var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-5, 0])
  .html(d => d.label);

svg.call(tool_tip);

// COMPONENTS ***************************************
// **************************************************

d3.csv('household_income.csv', function(error, data) {

  if (error) throw error;

// **************************************************
// DATA PREP ****************************************

  // Create the data for our custom x-axis
  const customLevels = [
    {
      label: 'less than $10,000',
      income_index: 0,
      income_class: 'zero',
      offset: 0
    },
    {
      label: '$10,000 to $14,999',
      income_index: 1,
      income_class: 'one',
      offset: 0
    },
    {
      label: '$15,000 to $19,999',
      income_index: 2,
      income_class: 'two',
      offset: 0
    },
    {
      label: '$20,000 to $24,999',
      income_index: 3,
      income_class: 'three',
      offset: 0
    },
    {
      label: '$25,000 to $29,999',
      income_index: 4,
      income_class: 'four',
      offset: 0
    },
    {
      label: '$30,000 to $34,999',
      income_index: 5,
      income_class: 'five',
      offset: 0
    },
    {
      label: '$35,000 to $39,999',
      income_index: 6,
      income_class: 'six',
      offset: 0
    },
    {
      label: '$40,000 to $44,999',
      income_index: 7,
      income_class: 'seven',
      offset: 0
    },
    {
      label: '$45,000 to $49,999',
      income_index: 8,
      income_class: 'eight',
      offset: 0
    },
    {
      label: '$50,000 to $59,999',
      income_index: 9,
      income_class: 'nine',
      offset: 0
    },
    {
      label: '$60,000 to $74,999',
      income_index: 10,
      income_class: 'ten',
      offset: 0
    },
    {
      label: '$75,000 to $99,999',
      income_index: 11,
      income_class: 'eleven',
      offset: 0
    },
    {
      label: '$100,000 to $124,999',
      income_index: 12,
      income_class: 'twelve',
      offset: 0
    },
    {
      label: '$125,000 to $149,999',
      income_index: 13,
      income_class: 'thirteen',
      offset: 0
    },
    {
      label: '$150,000 to $199,999',
      income_index: 14,
      income_class: 'fourteen',
      offset: 0
    },
    {
      label: '$200,000 or more',
      income_index: 15,
      income_class: 'fifteen',
      offset: 0
    }
  ]

  // create data for our line generator that will rest below our circles
  const lineData = [
    {
      'x': 0,
      'y': -1.25
    },
    {
      'x': 44,
      'y': -1.25
    }
  ]

  // Filter to only relevant data
  const householdsIn2016 = data.filter(function (d) {
    return d.year === '2016' &&
      d.state != 'Puerto Rico' &&
      d.state != 'District of Columbia';
  });

  // Clean the data to be used in the bar charts
  householdsIn2016.forEach(function(d) {

    d.bar_width = +d.bar_width; // convert bar_width to a Number
    d.number_of_households = +d.number_of_households; // convert households to a Number
    d.percent_of_total = +d.percent_of_total; // convert percent_of_total to a Number

    switch(d.income_level) { // assign an index to each income_level to use for sorting
      case 'Less than $10,000':
        d.income_index = 0;
        d.income_class = 'zero';
        break;
      case '$10,000 to $14,999':
        d.income_index = 1;
        d.income_class = 'one';
        break;
      case '$15,000 to $19,999':
        d.income_index = 2;
        d.income_class = 'two';
        break;
      case '$20,000 to $24,999':
        d.income_index = 3;
        d.income_class = 'three';
        break;
      case '$25,000 to $29,999':
        d.income_index = 4;
        d.income_class = 'four';
        break;
      case '$30,000 to $34,999':
        d.income_index = 5;
        d.income_class = 'five';
        break;
      case '$35,000 to $39,999':
        d.income_index = 6;
        d.income_class = 'six';
        break;
      case '$40,000 to $44,999':
        d.income_index = 7;
        d.income_class = 'seven';
        break;
      case '$45,000 to $49,999':
        d.income_index = 8;
        d.income_class = 'eight';
        break;
      case '$50,000 to $59,999':
        d.income_index = 9;
        d.income_class = 'nine';
        break;
      case '$60,000 to $74,999':
        d.income_index = 10;
        d.income_class = 'ten';
        break;
      case '$75,000 to $99,999':
        d.income_index = 11;
        d.income_class = 'eleven';
        break;
      case '$100,000 to $124,999':
        d.income_index = 12;
        d.income_class = 'twelve';
        break;
      case '$125,000 to $149,999':
        d.income_index = 13;
        d.income_class = 'thirteen';
        break;
      case '$150,000 to $199,999':
        d.income_index = 14;
        d.income_class = 'fourteen';
        break;
      case '$200,000 or more':
        d.income_index = 15;
        d.income_class = 'fifteen';
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

  // sort states by the by a given index
  nested.sort(function (a, b) {
    return b.values[0].percent_of_total - a.values[0].percent_of_total;
  });

  // create a custom offset to position each rect
  nested.forEach(function (state) {
    let accumulator = 0;
    state.values.forEach(function (d) {
      d.offset = accumulator;
      accumulator += d.bar_width
    })
  });

  // set the offect for circles (customLevels)
  customLevels.forEach(function(d, i) {
    if ( i !== 15) {
      d.offset = nested[0].values[i].offset + (nested[0].values[i + 1].offset - nested[0].values[i].offset) / 2;
    } else {
      d.offset = nested[0].values[i].offset + (44 - nested[0].values[i].offset) / 2;
    }
  })

// DATA PREP ****************************************
// **************************************************

// **************************************************
// APPEND STATIC ELEMENTS ***************************

svg.append('path')
  .attr('d', lineFunction(lineData))
  .attr('stroke', '#999')
  .attr('stroke-width', '1px')
  .attr('fill', 'none');

svg
  .selectAll('.circle')
  .data(customLevels)
  .enter()
  .append('circle')
    .attr('class', d => d.income_class)
    .attr('cx', d => xScale(d.offset))
    .attr('cy', -10)
    .attr('r', 5)
    .style('fill', '#ccc')
    // .on('mouseover', tool_tip.show)
    // .on('mouseover', function (d) {
    //   d3.select(this)
    //     .style('fill', '#99CCE5');

    //   d3.selectAll(`.${d.income_class}`)
    //     .style('fill', '#99CCE5');
    // })
    // .on('mouseout', tool_tip.hide)
    // .on('mouseout', function (d) {
    //   d3.select(this)
    //     .style('fill', '#CCCCCC');
    //   d3.selectAll(`.${d.income_class}`)
    //     .style('fill', '#CCCCCC');
    // })
    .on('click', function (d) {

      // d3.select(this)
      //   .style('fill', '#3399CC');

      d3.selectAll(`.${d.income_class}`)
        .style('fill', '#3399CC');

      sortState(nested, d);

    });

// **************************************************
// ENTER SELECTION **********************************

  stateBand
    .domain(nested.map(function (d) { return d.key; }));

  const yScalePerState = d3.scaleLinear()
    .domain([0, 0.1509]) // 0.1509 = max percent from this dataset
    .range([marimekkoChartHeight, 0]);

  let stateUpdate = svg.append('g')
    .selectAll('g').data(nested);
  
  let stateEnter = stateUpdate
    .enter()
    .append('g').attr('transform', function (d) {
      let ty = statePosition(d) - stateBand.bandwidth() + marimekkoChartHeight / 2 + margin.top;
      return 'translate(0,' + ty + ')';
    });

  let stateExit = stateUpdate.exit();

  let incomeUpdate = stateEnter.selectAll('rect')
    .data(d => d.values);

  let incomeEnter = incomeUpdate.enter()
    .append("rect")
    .attr('class', d => d.income_class)
    .attr("x", (d, i) => xScale(d.offset))
    .attr("y", d => yScalePerState(d.percent_of_total))
    .attr("width", d => xScale(d.bar_width))
    .attr("height", d => yScalePerState(0) - yScalePerState(d.percent_of_total))
    .style("fill", '#ccc');

  let incomeExit = incomeUpdate
    .exit();

  let stateTicks = svg.append('g')
    .call(stateLabel)
    .attr('transform', `translate(10,${-stateBand.bandwidth() / 2 + 10})`)
    .attr('text-anchor', 'start');

  stateTicks
    .exit()

// ENTER SELECTION **********************************
// **************************************************

// **************************************************
// UPDATE SELECTION *********************************

  const sortState = function(data, incomeLevel) {

    svg.selectAll('rect').remove();

    stateTicks
      .remove();

    stateExit
      .remove();

    incomeExit
      .remove();

    data.sort(function (a, b) {
      return b.values[incomeLevel.income_index].percent_of_total - a.values[incomeLevel.income_index].percent_of_total;
    });

    stateBand
      .domain(data.map(function (d) { return d.key; }));

    stateUpdate = svg.append('g')
      .selectAll('g').data(data);

    stateEnter = stateUpdate
      .enter()
      .append('g').attr('transform', function (d) {
        let ty = statePosition(d) - stateBand.bandwidth() + marimekkoChartHeight / 2 + margin.top;
        return 'translate(0,' + ty + ')';
      });

    stateExit = stateUpdate.exit();

    incomeUpdate = stateEnter.selectAll('rect')
      .data(d => d.values);

    incomeEnter = incomeUpdate.enter()
      .append("rect")
      .attr('class', d => d.income_class)
      .attr("x", (d, i) => xScale(d.offset))
      .attr("y", d => yScalePerState(d.percent_of_total))
      .attr("width", d => xScale(d.bar_width))
      .attr("height", d => yScalePerState(0) - yScalePerState(d.percent_of_total))
      .style("fill", '#ccc');

    incomeExit = incomeUpdate
      .exit();

    stateTicks = svg.append('g')
      .call(stateLabel)
      .attr('transform', `translate(10,${-stateBand.bandwidth() / 2 + 10})`)
      .attr('text-anchor', 'start');

    stateTicks
      .exit();

  }

// UPDATE SELECTION *********************************
// **************************************************

});