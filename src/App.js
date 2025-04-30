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
import "./App.css";

class App extends Component{
  
  constructor(props) {
    super(props)
    this.state={data:[]}
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
            <Navbar.Brand>Chart Analysis on Fake News Dataset</Navbar.Brand>
          </Container>
        </Navbar>
        <br>
        </br>
        <Container>
          <Row>
            <Col>
              <DropdownButton id="dropdown-item-button" title="Select Graph">
                <Dropdown.ItemText>Select Graph</Dropdown.ItemText>
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
          {selectedGraph === 'trust'
            && <TrustStackedBC data1={this.state.data} />}
          {selectedGraph === 'sentiment'
            && <SentimentStackedBC data2={this.state.data} />}
        </Container>

      </div>
      <div className="scatterAndLine"> 
        <ScatterPlot data1={this.state.data}> </ScatterPlot> 
      </div>
    </div>;
  }
}

export default App