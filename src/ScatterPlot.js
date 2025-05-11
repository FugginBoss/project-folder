import React, { Component } from "react";
import * as d3 from 'd3';

class ScatterPlot extends Component{
  
  constructor(props) {
    super(props)
    this.state = {
      selectedLabel: "Validity"
    }
    
  }

  componentDidMount(){
    console.log(this.props.data1)
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  handleFilterChange = (event) => {
    this.setState({selectedLabel: event.target.value})
  }

  renderChart() {
    d3.select(".innerChart").selectAll("*").remove();
    d3.select(".scatterPlot").selectAll("text").remove();

    let data = this.props.data1

    data = data.filter(d => d.category === "Politics")
    data = data.slice(0, 300)
    console.log(data)
    
    const margin = {top: 40, right: 120, bottom: 50, left: 80};
    const width = 700;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(".scatterPlot").attr("width", width).attr("height", height);
    const chart = svg.select(".innerChart").attr("transform", `translate(${margin.left},${margin.top})`);
    
    const numShares = data.map(d => +d.num_shares)
    const numComment = data.map(d => +d.num_comments)

    const xScale = d3.scaleLinear().domain([0, d3.max(numComment)]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, d3.max(numShares)]).range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    chart.selectAll(".x-axis").data([null]).join("g").attr("transform", `translate(0, ${innerHeight})`).attr('class', 'x-axis').call(xAxis)
    chart.selectAll(".y-axis").data([null]).join("g").attr('class', 'y-axis').call(yAxis)

    chart.selectAll("circle").data(data).join("circle").attr("r", 5).attr("fill", "#69b3a2")
    .attr("cx", d => xScale(d.num_comments)).attr("cy", d => yScale(d.num_shares))
    .attr('fill', d => {
      if(this.state.selectedLabel === "Validity") {
        if (d.label === "Fake") {
          return 'orange';
        }
        else {
          return 'blue';
        }
      }
      else {
        if (d.is_satirical === "0") {
          return 'green'
        }
        else {
          return 'red'
        }
      }
    })

    chart.append("text")
      .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + 50})`)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Comments");
    

    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -50)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Shares");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .text("Assessment of Article Labels via Shares and Comments");

      const legendX = width - margin.right + 20;
      const legendY = margin.top + 100;
    
      if (data.length > 0){
        svg.append("circle").attr("cx", legendX).attr("cy", legendY).attr("r", 6).style("fill", 
          () => {
            if (this.state.selectedLabel === "Validity") {
              return "blue"
            }
            else {
              return "green"
            }
          }
        );
        svg.append("text").attr("x", legendX + 10).attr("y", legendY + 5).text(
          () => {
            if (this.state.selectedLabel === "Validity") {
              return "Real"
            }
            else {
              return "Not Satirical"
            }
          }
        )
    
        svg.append("circle").attr("cx", legendX).attr("cy", legendY + 20).attr("r", 6).style("fill", 
          () => {
            if (this.state.selectedLabel === "Validity") {
              return "Orange"
            }
            else {
              return "red"
            }
          }
        );
        svg.append("text").attr("x", legendX + 10).attr("y", legendY + 25).text(
          () => {
            if (this.state.selectedLabel === "Validity") {
              return "Fake"
            }
            else {
              return "Satirical"
            }
          }
        )
      }
  }

  render() {
    return( 
    <div style={{ position: 'relative', width: '700px', height: '400px'}}>
      <svg className="scatterPlot">
        <g className="innerChart"></g>
      </svg>
      <label htmlFor="labelFilter"
      style={{ position: 'absolute', top: '180px', left: '600px', zIndex: 10 }}>
        Filter by Label:</label><br />
      <select
        style={{ position: 'absolute', top: '230px', left: '600px', zIndex: 20 }}
        id="labelFilter"
        value={this.state.selectedLabel}
        onChange={this.handleFilterChange}
      >
        <option value="Satire">Satire</option>
        <option value="Validity">Validity</option>
      </select>
    </div>
    );
  }
}

export default ScatterPlot