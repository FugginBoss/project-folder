import TrustStackedBC from './TrustStackedBC.js'
import SentimentStackedBC from './SentimentStackedBC.js';
import React, { Component } from "react";
import * as d3 from 'd3';
import dataset from './fake_news_dataset.csv'

import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ScatterPlot from "./ScatterPlot";
import LineChart from'./LineChart.js'
import "./App.css";

class App extends Component{
  
  constructor(props) {
    super(props)
    this.state={
      data:[],
      selectedGraph: 'trust'
    }
  }

  // Percy added this function to load the data from the csv file
  componentDidMount() {
    var self = this
    d3.csv(dataset, function (d) {

      return {
        state: d.state,
        category: d.category,
        source_reputation: d.source_reputation,
        political_bias: d.political_bias,
        trust_score: d.trust_score,
        num_shares: d.num_shares,
        num_comments: d.num_comments,
        label: d.label,
        is_satirical: d.is_satirical,
        date_published: d.date_published,
        has_images: d.has_images,
        has_videos: d.has_videos,
        clickbait_score: d.clickbait_score
      }
    }).then(function (csv_data) {
      self.setState({ data: csv_data })
    })
      .catch(function (err) {
        console.log(err);
      })
  }

  handleGraphSelect = (graphType) => {
    this.setState({ selectedGraph: graphType })
  }

  render() {

    const { selectedGraph } = this.state;

    return <div>
      <div className="barGraph">
      <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand className="fs-3 text-center w-100">Analysis on Fake News Dataset</Navbar.Brand>
          </Container>
        </Navbar>
        <br>
        </br>
        <Container>
          <Row>
            <Col>
              <DropdownButton id="dropdown-item-button" title="Select Credibility">
                <Dropdown.Item as="button" onClick={() => this.handleGraphSelect('sentiment')}>Length: Reputation Score</Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => this.handleGraphSelect('trust')}>Length: Trust Score</Dropdown.Item>
              </DropdownButton>
            </Col>

          </Row>
          <br></br>
          <Row>
            <Col>
              
            </Col>
            {/* <Col>2 of 3</Col>
            <Col>3 of 3</Col> */}
          </Row>

        </Container>

        <Container>
          { this.state.data.length > 0 && selectedGraph === 'trust'
            && <TrustStackedBC data1={this.state.data} />}
          {this.state.data.length > 0 && selectedGraph === 'sentiment'
            && <SentimentStackedBC data2={this.state.data} />}
        </Container>

      </div>
      <div className="scatterAndLine"> 
        <ScatterPlot data1={this.state.data}> </ScatterPlot>
        <LineChart data1={this.state.data}/>
      </div>
    </div>;
  }
}

export default App