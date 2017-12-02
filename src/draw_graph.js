function drawGraph(data) {
  // debugger;
  
  const svg = d3.select("svg");
  svg.selectAll("g").remove();
  
  const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = Number(svg.attr("width")) - margin.left - margin.right,
    height = Number(svg.attr("height")) - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  const x = d3.scaleBand()
    .rangeRound([0, width]);
  const y = d3.scaleLinear()
    .rangeRound([height, 0]);
  
  const area = d3.area()
    .x(d => x(d.id))
    .y0(height)
    .y1(d => y(d.player1));
    
  const line = d3.line()
    .x(d => x(d.id))
    .y(d => y(d.player1));
  
  x.domain(data.map(d => d.id));
  y.domain([0, d3.max(data, d => d.player1)]);
  
  // g.append("path")
  //     .data([data])
  //     .attr("fill", "steelblue")
  //     .attr("class", "area")
  //     .attr("d", area);
      
  g.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line);

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .tickArguments([10])
      );

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Win Ratios");
}

module.exports = drawGraph;
