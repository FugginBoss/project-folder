import React, { Component } from "react";
import * as d3 from 'd3';

export default class SentimentStackedBC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        console.log("SentimentStackedBC data: ", this.props.data2)
        var received_data = [];
        received_data = this.props.data2
        received_data = received_data.filter(d => d.category === "Politics")
        received_data = received_data.map(({ state, political_bias, source_reputation }) => ({ state, political_bias, source_reputation }))
        console.log("SentimentStackedBC filtered data: ", received_data)

        var data_dict = []
        /* 
        data_dict = [
            {state: ___, reputation_sum: ___, reputation_count: ___, count_left: ___, count_right: ___, count_center: ___ }
        ]
        
        */
        for (let i = 0; i < received_data.length; i++) {
            // console.log("NEVER REACHED HERE");


            if (received_data[i].state in data_dict) {
                // have seen it

                data_dict[received_data[i].state] =
                {
                    state: received_data[i].state,
                    reputation_sum: Number(data_dict[received_data[i].state].reputation_sum) + Number(received_data[i].source_reputation),
                    reputation_count: Number(data_dict[received_data[i].state].reputation_count) + 1,
                    count_left: Number(data_dict[received_data[i].state].count_left) + (received_data[i].political_bias === 'Left' ? 1 : 0),
                    count_right: Number(data_dict[received_data[i].state].count_right) + (received_data[i].political_bias === 'Right' ? 1 : 0),
                    count_center: Number(data_dict[received_data[i].state].count_center) + (received_data[i].political_bias === 'Center' ? 1 : 0)
                }

            } else {
                // haven't seen it

                data_dict[received_data[i].state] =
                {
                    state: received_data[i].state,
                    reputation_sum: Number(received_data[i].source_reputation),
                    reputation_count: 1,
                    count_left: received_data[i].political_bias === 'Left' ? 1 : 0,
                    count_right: received_data[i].political_bias === 'Right' ? 1 : 0,
                    count_center: received_data[i].political_bias === 'Center' ? 1 : 0,
                }
            }

        }

        // console.log("data_dict for Sentiment StackedBC: ", data_dict)

        const updated_dict = Object.values(data_dict).map(item => {
            return {
                state: item.state,
                reputation: item.reputation_sum / item.reputation_count || 0, // Avoid division by zero
                most_common_bias:
                    item.count_left >= item.count_right && item.count_left >= item.count_center ? 'left' :
                    item.count_right >= item.count_left && item.count_right >= item.count_center ? 'right' :
                    item.count_center >= item.count_left && item.count_center >= item.count_right ? 'center' : 'left'
                ,
            }
        })

        console.log("updated_dict for Sentiment StackedBC: ", updated_dict)
        const data = updated_dict

        /* 
        Output: 
        data = [
            {state: ___, state_avg_reputation: ___, most_common_bias: ___}
        ]

        avg = sum / count
        */

        // dummy data
        // const data = [
        //     { state: "California", reputation: 8, most_common_bias: "left" },
        //     { state: "Texas", reputation: 6, most_common_bias: "right" },
        //     { state: "Florida", reputation: 7, most_common_bias: "center" },
        //     { state: "New York", reputation: 9, most_common_bias: "left" },
        //     { state: "Illinois", reputation: 5, most_common_bias: "center" },
        //     { state: "Ohio", reputation: 4, most_common_bias: "right" },
        //     { state: "Michigan", reputation: 6, most_common_bias: "left" },
        //     { state: "Georgia", reputation: 3, most_common_bias: "right" },
        //     { state: "Virginia", reputation: 7, most_common_bias: "center" },
        //     { state: "New Jersey", reputation: 8, most_common_bias: "left" }
        // ];

        const width = 800 + 500;
        const height = 300;
        const margin = { top: 20, right: 90, bottom: 60, left: 60 };

        const svg = d3.select("svg");

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.state))
            .range([margin.left, width - margin.right])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.reputation)])
            .range([height - margin.bottom, margin.top]);

        // Drawing bars
        svg.select(".container")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("fill", d => {
                if (d.most_common_bias === "left") {
                    return "#4E79A7"
                }
                else if (d.most_common_bias === "right") {
                    return "#E15759"
                }
                else {
                    return "#A0A0A0"
                }
            })
            .append("rect")
            .attr("x", d => xScale(d.state))
            .attr("y", d => yScale(d.reputation))
            .attr("height", d => height - margin.bottom - yScale(d.reputation))
            .attr("width", xScale.bandwidth());

        // X Axis
        svg.select(".x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Y Axis
        svg.select(".y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale).ticks(5));

        d3.select("svg")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -150) // adjust based on SVG height
            .attr("y", 15)   // distance from the left edge
            .attr("text-anchor", "middle")
            .text("Average Reputation Score");  //Y-axis label here

        d3.select("svg")
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 2 + 20) // just below x-axis
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("State");  //X-axis label here

        const legendX = width - margin.right + 20;
        const legendY = margin.top + 100;

        if (data.length > 0) {
            svg.append("circle").attr("cx", legendX).attr("cy", legendY).attr("r", 6).style("fill", "#4E79A7");
            svg.append("text").attr("x", legendX + 10).attr("y", legendY + 5).text("Left")

            svg.append("circle").attr("cx", legendX).attr("cy", legendY + 20).attr("r", 6).style("fill", "#E15759");
            svg.append("text").attr("x", legendX + 10).attr("y", legendY + 25).text("Right")

            svg.append("circle").attr("cx", legendX).attr("cy", legendY + 40).attr("r", 6).style("fill", "#A0A0A0");
            svg.append("text").attr("x", legendX + 10).attr("y", legendY + 45).text("Center")
        }
    }
    // Sentiment score vs number of shares
    render() {
        return (
            <svg width={800 + 500} height={300}>
                <g className="container" />
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        )
    }
}