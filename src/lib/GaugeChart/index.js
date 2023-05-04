import React, { useCallback, useEffect, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import {
  arc,
  pie,
  select,
  easeElastic,
  scaleLinear,
  interpolateHsl,
  interpolateNumber,
} from "d3";
import useDeepCompareEffect from "./hooks/customHooks";
import CONSTANTS from './constants';
import * as arcHooks from "./hooks/arc";
import * as chartHooks from "./hooks/chart";
import * as labelsHooks from "./hooks/labels";
import * as needleHooks from "./hooks/needle";
/*
GaugeChart creates a gauge chart using D3
The chart is responsive and will have the same width as the "container"
The radius of the gauge depends on the width and height of the container
It will use whichever is smallest of width or height
The svg element surrounding the gauge will always be square
"container" is the div where the chart should be placed
*/

const GaugeChart = (props) => {
  const svg = useRef({});
  const g = useRef({});
  const width = useRef({});
  const height = useRef({});
  const doughnut = useRef({});
  const needle = useRef({});
  const outerRadius = useRef({});
  const innerRadius = useRef({});
  const margin = useRef({}); // = {top: 20, right: 50, bottom: 50, left: 50},
  const container = useRef({});
  const nbArcsToDisplay = useRef(0);
  const colorArray = useRef([]);
  const arcChart = useRef(arc());
  const arcData = useRef([]);
  const pieChart = useRef(pie());
  const valueInPercent = useRef(0);
  const prevProps = useRef({});
  let selectedRef = useRef({});

  const gauge = {
    props,
    prevProps,
    svg,
    g,
    width,
    height,
    doughnut,
    needle,
    outerRadius,
    innerRadius,
    margin,
    container,
    nbArcsToDisplay,
    colorArray,
    arcChart,
    arcData,
    pieChart,
    selectedRef,
    valueInPercent
  };
  const initChartCallback = useCallback(chartHooks.initChart, [props]);


  useLayoutEffect(() => {
    arcHooks.setArcData(gauge);
    container.current = select(selectedRef);
    //Initialize chart
    initChartCallback(false, gauge);
  }, [props, initChartCallback]);

  useDeepCompareEffect(() => {
    let arcsPropsChanged = props.nrOfLevels || (JSON.stringify(prevProps.current.arcs) === JSON.stringify(props.arcs));
    if (arcsPropsChanged) arcHooks.setArcData(gauge)
    // Always redraw the chart, but potentially do not animate it
    const resize = !CONSTANTS.animateNeedleProps.some((key) => prevProps.current[key] !== props[key]);
    if(gauge.prevProps.current.value != props.value) initChartCallback(true, gauge, resize);
    gauge.prevProps.current = props;
  }, [
    props.nrOfLevels,
    props.arcsLength,
    props.colors,
    props.percent,
    props.value,
    props.minValue,
    props.maxValue,
    props.arcs,
    props.needleColor,
    props.needleBaseColor,
  ]);

  useEffect(() => {
    const handleResize = () => {
      var resize = true;
      chartHooks.renderChart(resize, gauge);
    };
    //Set up resize event listener to re-render the chart everytime the window is resized
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [props]);

  const { id, style, className } = props;
  return (
    <div
      id={id}
      className={className}
      style={style}
      ref={(svg) => (selectedRef = svg)}
    />
  );
};

export default GaugeChart;

GaugeChart.defaultProps = {
  style: CONSTANTS.defaultStyle,
  marginInPercent: 0.05,
  cornerRadius: 6,
  nrOfLevels: null,
  arcPadding: 0.05, //The padding between arcs, in rad
  arcWidth: 0.2, //The width of the arc given in percent of the radius
  textColor: "#fff",
  needleColor: "#464A4F",
  needleBaseColor: "#464A4F",
  hideText: false,
  animate: true,
  animDelay: 500,
  formatTextValue: null,
  fontSize: null,
  animateDuration: 3000,
  value: 50,
  minValue: 0,
  maxValue: 100,
  elastic: false,
  arcs:
    [
      { color: '#00FF00', limit: 33},
      { color: 'yellow', limit: 66 },
      { color: 'red', limit: 100 },
    ],
  marks: [0, 100]
};

GaugeChart.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  marginInPercent: PropTypes.number,
  cornerRadius: PropTypes.number,
  nrOfLevels: PropTypes.number,
  percent: PropTypes.number,
  value: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  arcs: PropTypes.array,
  arcPadding: PropTypes.number,
  arcWidth: PropTypes.number,
  arcsLength: PropTypes.array,
  colors: PropTypes.array,
  textColor: PropTypes.string,
  needleColor: PropTypes.string,
  needleBaseColor: PropTypes.string,
  hideText: PropTypes.bool,
  animate: PropTypes.bool,
  formatTextValue: PropTypes.func,
  fontSize: PropTypes.string,
  animateDuration: PropTypes.number,
  animDelay: PropTypes.number,
  elastic: PropTypes.bool,
  marks: PropTypes.array
};
