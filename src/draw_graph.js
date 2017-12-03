const ORDERED_ARR = [];
for (var i = 0; i < 200; i++) {
  ORDERED_ARR.push(i);
}

function drawGraph(data) {
  const svg = d3.select("svg");
  svg.selectAll("g").remove();
  
  const margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = Number(svg.attr("width")) - margin.left - margin.right,
    height = Number(svg.attr("height")) - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + 40 + "," + margin.top + ")");
  
  const x = d3.scaleBand()
    .rangeRound([0, width]);
  const y = d3.scaleLinear()
    .rangeRound([height, 0]);
  
  const area1 = d3.area()
    .x(d => x(d.id))
    .y0(height)
    .y1(d => y(d.player1));
    
  const line1 = d3.line()
    .x(d => x(d.id))
    .y(d => y(d.player1));
  
  const area2 = d3.area()
    .x(d => x(d.id))
    .y0(d => y(d.player1))
    .y1(d => y(d.ties + d.player1));
    
  const line2 = d3.line()
    .x(d => x(d.id))
    .y(d => y(d.ties + d.player1));
  
  const area3 = d3.area()
    .x(d => x(d.id))
    .y0(d => y(d.ties + d.player1))
    .y1(d => y(1));
    
  const line3 = d3.line()
    .x(d => x(d.id))
    .y(d => y(1));
  
  let xArr;
  if (data.length < 200) {
    xArr = ORDERED_ARR;
  } else {
    xArr = data.map(d => d.id);
  }
  
  x.domain(xArr);
  y.domain([0, 1]);
  
  g.append("path")
    .data([data])
    .attr("class", "area area3")
    .attr("d", area3);
  
  g.append("path")
    .data([data])
    .attr("class", "line line3")
    .attr("d", line3);
  
  g.append("path")
    .data([data])
    .attr("class", "area area2")
    .attr("d", area2);
      
  g.append("path")
    .data([data])
    .attr("class", "line line2")
    .attr("d", line2);
    
  g.append("path")
    .data([data])
    .attr("class", "area area1")
    .attr("d", area1);
    
  g.append("path")
    .data([data])
    .attr("class", "line line1")
    .attr("d", line1);

  // g.append("g")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x))
  //     .ticks(10);
  
  g.append("g")
      .call(d3.axisLeft(y))
      .attr("transform", "translate(0," + -1 + ")")
    .attr("class", "axis-y")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Win Ratios");
}

module.exports = drawGraph;
