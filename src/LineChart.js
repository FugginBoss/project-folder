import React, { Component } from "react";
import * as d3 from "d3";
import { sliderBottom } from "d3-simple-slider";

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredRange: null,
    };
  }

  componentDidMount() {
    this.handleSliderSetup();
  }

  componentDidUpdate(prevProps, prevState) {
    const dataChanged = prevProps.data1 !== this.props.data1;
    const rangeChanged = prevState.filteredRange !== this.state.filteredRange;

    if (dataChanged || rangeChanged) {
      this.renderChart();
    }

    if (dataChanged) {
      this.handleSliderSetup();
    }
  }

  handleSliderSetup = () => {
    const data = this.props.data1?.filter((d) => d.category === "Politics");
    if (!data || data.length === 0) return;

    const parseDate = d3.timeParse("%d-%m-%Y");
    const parsedData = data.map((d) => ({
      ...d,
      date_published: parseDate(d.date_published),
    }));

    const minDate = d3.min(parsedData, (d) => d.date_published);
    const maxDate = d3.max(parsedData, (d) => d.date_published);

    // Only set initial range once
    if (!this.state.filteredRange) {
      this.setState({ filteredRange: [minDate, maxDate] });
    }

    this.renderSlider(minDate, maxDate);
  };

  renderSlider = (minDate, maxDate) => {
    const container = d3.select(".slider-range");
    container.selectAll("*").remove(); // Clear previous slider

    const slider = sliderBottom()
      .min(minDate)
      .max(maxDate)
      .width(300)
      .tickFormat(d3.timeFormat("%b %Y"))
      .ticks(4)
      .default([minDate, maxDate])
      .fill("#85bb65")
      .on("onchange", (val) => {
        this.setState({ filteredRange: val });
      });

    const g = container
      .append("svg")
      .attr("width", 500)
      .attr("height", 90)
      .append("g")
      .attr("transform", "translate(30,30)");

    g.call(slider);
  };

  renderChart = () => {
    let data = this.props.data1?.filter((d) => d.category === "Politics");
    if (!data || data.length === 0) return;

    const parseDate = d3.timeParse("%d-%m-%Y");
    data = data.map((d) => ({
      ...d,
      date_published: parseDate(d.date_published),
      has_images: +d.has_images,
    }));

    const { filteredRange } = this.state;
    if (filteredRange) {
      data = data.filter(
        (d) =>
          d.date_published >= filteredRange[0] &&
          d.date_published <= filteredRange[1]
      );
    }

    const groupedData = d3.groups(
      data,
      (d) => d3.timeMonth(d.date_published),
      (d) => d.has_images
    );

    const chartData = groupedData.map(([month, imageGroups]) => ({
      date_published: month,
      groups: imageGroups.map(([has_images, records]) => ({
        has_images,
        avg_clickbait_score: d3.mean(records, (d) => d.clickbait_score) || 0,
      })),
    }));

    chartData.sort((a, b) => a.date_published - b.date_published);

    const margin = { top: 50, right: 200, bottom: 70, left: 80 };
    const width = 700;
    const height = 400;
    const innerWidth = width - margin.left - margin.right + 60;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#mysvg");
    svg.selectAll("*").remove();

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(chartData, (d) => d.date_published))
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(chartData, (month) =>
          d3.max(month.groups, (g) => g.avg_clickbait_score)
        ) * 1.1,
      ])
      .range([innerHeight, 0]);

    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.date_published))
      .y((d) => yScale(d.avg_clickbait_score))
      .curve(d3.curveMonotoneX);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(["0", "1"]);

    const linesData = [0, 1].map((val) => ({
      has_images: val,
      values: chartData.map((month) => ({
        date_published: month.date_published,
        avg_clickbait_score:
          month.groups.find((g) => g.has_images === val)?.avg_clickbait_score ||
          0,
      })),
    }));

    chartGroup
      .selectAll(".line")
      .data(linesData)
      .join("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", (d) => color(d.has_images))
      .attr("d", (d) => lineGenerator(d.values));

    chartGroup
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")).ticks(d3.timeYear)
      );

    chartGroup.append("g").call(d3.axisLeft(yScale));

    chartGroup
      .append("text")
      .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + 50})`)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Year");

    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Average Monthly Clickbait Score");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .text("Assessment of Article Clickbait via Images");

    // Legend
    const legendX = width - margin.right + 20;
    const legendY = margin.top + 100;

    chartGroup
      .append("circle")
      .attr("cx", legendX)
      .attr("cy", legendY)
      .attr("r", 6)
      .style("fill", color(0));

    chartGroup
      .append("text")
      .attr("x", legendX + 10)
      .attr("y", legendY + 5)
      .text("No Images");

    chartGroup
      .append("circle")
      .attr("cx", legendX)
      .attr("cy", legendY + 20)
      .attr("r", 6)
      .style("fill", color(1));

    chartGroup
      .append("text")
      .attr("x", legendX + 10)
      .attr("y", legendY + 25)
      .text("Has Images");
  };

  render() {
    return (
      <div>
        <div
          className="slider-range"
          style={{ marginBottom: "10px", marginTop: "-30px" }}
        ></div>
        <svg
          id="mysvg"
          width="700"
          height="400"
          style={{ marginTop: "-20px" }}
        />
      </div>
    );
  }
}

export default LineChart;
