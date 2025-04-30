import React, { Component } from "react";
import * as d3 from 'd3';

class ScatterPlot extends Component{
  
  constructor(props) {
    super(props)
    this.state = {}
    
  }

  componentDidMount(){
    console.log(this.props.data1)
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    let data = this.props.data1
    
    const margin = {top: 40, right: 120, bottom: 50, left: 80};
    const width = 800;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(".scatterPlot").attr("width", width).attr("height", height);
    const chart = d3.select(".innerChart").attr("transform", `translate(${margin.left},${margin.top})`);

    const numShares = data.map(d => d.num_shares)
    const numComment = data.map(d => d.num_comments)

    const xScale = d3.scaleLinear().domain([0, d3.max(numShares)]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, d3.max(numComment)]).range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    chart.selectAll(".x-axis").data([null]).join("g").attr("transform", `translate(0, ${innerHeight})`).attr('class', 'x-axis').call(xAxis)
    chart.selectAll(".y-axis").data([null]).join("g").attr('class', 'y-axis').call(yAxis)

    chart.selectAll("circle").data(data).join("circle").attr("r", 5).attr("fill", "#69b3a2")
    .attr("cx", d => xScale(d.num_shares)).attr("cy", d => yScale(d.num_comments))
    .attr('fill', d => {
      if (d.label === "fake") {
        return 'purple';
      }
      else {
        return 'blue';
      }
    })

    chart.append("text")
      .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + 50})`)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Shares");
    

    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Comments");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2 + 10)
      .style("text-anchor", "middle")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .text("Assessment of Article Labels via Shares and Comments");

      const legendX = width - margin.right + 20;
      const legendY = margin.top + 100;
    
      if (data.length > 0){
        svg.append("circle").attr("cx", legendX).attr("cy", legendY).attr("r", 6).style("fill", "blue");
        svg.append("text").attr("x", legendX + 10).attr("y", legendY + 5).text("Real")
    
        svg.append("circle").attr("cx", legendX).attr("cy", legendY + 20).attr("r", 6).style("fill", "purple");
        svg.append("text").attr("x", legendX + 10).attr("y", legendY + 25).text("Fake")
      }
  }

  render() {
    return( 
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
      <svg className="scatterPlot">
        <g className="innerChart"></g>
      </svg>

      <div style={{ marginTop: '40px' }}>
        <label htmlFor="labelFilter">Filter by Label:</label><br />
        <select
          id="labelFilter"
          value={this.state.selectedLabel}
          onChange={this.handleFilterChange}
        >
          <option value="Satire">Satire</option>
          <option value="Validity">Validity</option>
        </select>
      </div>
    </div>
    );
  }
}

export default ScatterPlot