import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './App.css'
import GaugeChart from './lib'

const App = () => {
  const [currentPercent, setCurrentPercent] = useState();
  const [arcs, setArcs] = useState([{ limit: 30 }, { limit: 50 }, { limit: 100 }])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPercent(Math.random());
      setArcs([{ limit: 30 }, { limit: 35 }, { limit: 100 }])
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  });
  const chartStyle = {
    height: 250,
  }
  const debugSingleGauge = false;
  return (
    debugSingleGauge ?
      <Row>
        <Col xs={12} lg={{ offset: 2, span: 8 }}>
          <h6>Single GaugeChart for debugging</h6>
          <GaugeChart
            style={chartStyle}
            // nrOfLevels={20}
            arcs={
              [
                { limit: 30 },
                { },
                { }
              ]
            }
            value={90}
            needleColor="#345243"
            fontSize="12px"
            elastic
          />
        </Col>
      </Row>
      :
      <>
        <Container fluid>
          <Row>
            <Col xs={12} lg={{ offset: 2, span: 8 }}>
              <h1>React Gauge Chart Demo</h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={3}>
              <h6>GaugeChart with default props</h6>
              <GaugeChart style={chartStyle} />
            </Col>
            <Col xs={12} lg={3}>
              <h6>GaugeChart with 20 levels</h6>
              <GaugeChart
                style={chartStyle}
                nrOfLevels={20}
                value={86}
                needleColor="#345243"
                fontSize="12px"
                elastic
              />
            </Col>
            <Col xs={12} lg={3}>
              <h6>GaugeChart with custom colors</h6>
              <GaugeChart
                style={chartStyle}
                nrOfLevels={50}
                arcPadding={0.02}
                arcs={
                  [
                    { color: "#FF5F6D" },
                    { color: "#FFC371" },
                  ]
                }
                arcWidth={0.3}
                value={50}
              />
            </Col>
            <Col xs={12} lg={3}>
              <h6>GaugeChart with larger padding between elements</h6>
              <GaugeChart
                id="gauge-chart4"
                style={chartStyle}
                nrOfLevels={10}
                arcPadding={0.1}
                cornerRadius={3}
                value={60}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={3}>
              <h6>GaugeChart with custom arcs width</h6>
              <GaugeChart
                id="gauge-chart5"
                arcWidth={0.4}
                style={chartStyle}
                nrOfLevels={80}
                value={37}
                arcPadding={0.02}
              />
            </Col>
            <Col xs={12} lg={3}>
              <h6>GaugeChart without animation</h6>
              <GaugeChart
                id="gauge-chart6"
                style={chartStyle}
                animate={false}
                nrOfLevels={15}
                value={56}
                needleColor="#345243"
              />
            </Col>
            <Col xs={12} lg={3}>
              <h6>GaugeChart with live updates</h6>
              <GaugeChart
                id="gauge-chart7"
                arcs={
                  [
                    { color: "#5BE12C", limit: 20 },
                    { color: "#F5CD19" },
                    { color: "#EA4228" }
                  ]
                }
                style={chartStyle}
                value={currentPercent * 100}
                animDelay={0}
              />
            </Col>
            <Col xs={12} lg={3}>
              <h6>Elastic GaugeChart with live updates</h6>
              <GaugeChart
                id="gauge-chart7"
                style={chartStyle}
                value={currentPercent * 100}
                elastic
              />
            </Col>
            <Col xs={12} lg={3}>
              <h6>GaugeChart with formatted text</h6>
              <GaugeChart
                id="gauge-chart8"
                style={chartStyle}
                nrOfLevels={30}
                arcs={[{ color: '#5BE12C' }, { color: '#F5CD19' }, { color: '#EA4228' }]}
                arcWidth={0.3}
                value={370}
                maxValue={400}
                formatTextValue={value => value + ' kbit/s'}
              />
            </Col>
            <Col xs={12} lg={3}>
              <h6>GaugeChart with arcs update</h6>
              <GaugeChart
                id="gauge-chart9"
                style={chartStyle}
                arcs={arcs}
                value={37}
                arcPadding={0.02}
              />
            </Col>
          </Row>
        </Container>
      </>
  )
};

export default App
