// START - D3 margin convention
const width = 500,
  height = 270,
  margin = { top: 25, right: 50, bottom: 50, left: 50 };

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('border', '1px solid #000')
  .append("g")
    .attr("transform", `translate( ${margin.left}, ${margin.top} )`);
// END - D3 margin convention

// START - chart helpers
let totalOffset = 0;

const xScale = d3.scaleLinear()
    .range([0, width - margin.left - margin.right]),
  yScale = d3.scaleLinear()
    .range([height - margin.top - margin.bottom, 0]);

const p = d3.format(".0%");
// END - chart helpers

// START - Data driven designs
d3.json("marimekko.json", function (error, data) {

  // Compute the bar offset
  totalOffset = data.reduce(function (v, p) {
    return (p.offset = v) + p.barWidth;
  }, 0);

  xScale.domain([0, totalOffset])

  console.log(xScale(10));

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

  yScale.domain([0, d3.max(data, d => d.value)])

  // Add a group for each segment.
  var segments = svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr('x', d => xScale(d.offset))
    .attr("y", d => yScale(d.value))
    .attr("height", d => height - margin.top - margin.bottom - yScale(d.value))
    .attr("width", function (d) { return xScale(d.barWidth); })
    .style("fill", '#ccc');

});
// START - Data driven designs