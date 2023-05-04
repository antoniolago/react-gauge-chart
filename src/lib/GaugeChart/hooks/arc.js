import * as utils from './utils';
import {
  arc,
  pie,
  select,
  easeElastic,
  scaleLinear,
  interpolateHsl,
  interpolateNumber,
} from "d3";
import * as chartHooks from './chart';
import CONSTANTS from '../constants';
// This function update arc's datas when component is mounting or when one of arc's props is updated
// export const setArcData = (gauge) => {
//   // We have to make a decision about number of arcs to display
//   // If arcsLength is setted, we choose arcsLength length instead of nrOfLevels
//   gauge.nbArcsToDisplay.current = gauge.props.nrOfLevels ? gauge.props.nrOfLevels : gauge.props.arcs?.length;
//   var arcsLabels = [];
//   var arcsLength = [];
//   //If any arc limit of the list is undefined, set it to 0
//   // gauge.props.arcs?.forEach((arc) => arc.limit = arc.limit === undefined ? 0 : arc.limit);

//   if (gauge.props.arcs && !gauge.props.nrOfLevels) {
//     let lastArcLimit = 0;
//     let lastArcLimitPercentageAcc = 0;
//     let remainingPercentageEquallyDivided = null;
//     var arcLengthSoFarInPercent = 0;
//     let i=0;
//     gauge.props.arcs.forEach((arc, i) => {
//       var arcRange = 0;
//       arcRange = arc.limit - lastArcLimit;
//       let arcLength = 0;
//       //If ain't the first arc, it'll get the last arc percentage to calculate the current arc percentage
//       if (i != 0) {
//         arcLength = utils.calculatePercentage(gauge.props.minValue, gauge.props.maxValue, arc.limit) - lastArcLimitPercentageAcc;
//       } else {
//         arcLength = utils.calculatePercentage(gauge.props.minValue, gauge.props.maxValue, arcRange);
//       }
//       if(!arc.limit){
//         let remainingArcs = gauge.props.arcs.slice(i);
//         let remainingPercentage = (1-lastArcLimit/100)*100
//         console.log('remainingPercentage',remainingPercentage)
//         if(!remainingPercentageEquallyDivided) remainingPercentageEquallyDivided = (remainingPercentage / (remainingArcs.length > 0 ? remainingArcs.length : 1))/100;
//         arcLength = remainingPercentageEquallyDivided;
//         arc.limit = arcLength;
//       }
//       arcsLength.push(arcLength);
//       lastArcLimitPercentageAcc = arcsLength.reduce((count, curr) => count + curr, 0);
//       lastArcLimit = arc.limit;
//     });
//     arcsLabels = gauge.props.arcs.map((arc) => arc.label);
//   }
//   console.log(arcsLength)
//   gauge.colorArray.current = getColors(gauge)
//   //The data that is used to create the arc
//   // Each arc could have hiw own value width arcsLength prop
//   gauge.arcData.current = [];
//   for (var i = 0; i < gauge.nbArcsToDisplay.current; i++) {
//     var arcDatum = {
//       value:
//         arcsLength && arcsLength.length > i
//           ? arcsLength[i]
//           : 1,
//       color: gauge.colorArray.current[i],
//       label: arcsLabels ? arcsLabels[i] : null
//     };
//     gauge.arcData.current.push(arcDatum);
//   }
// };
export const setArcData = (gauge) => {
  // Determine number of arcs to display
  gauge.nbArcsToDisplay.current = gauge.props.nrOfLevels || gauge.props.arcs?.length;

  gauge.colorArray.current = getColors(gauge);
  if (gauge.props.arcs && !gauge.props.nrOfLevels) {
    let lastArcLimit = 0;
    let lastArcLimitPercentageAcc = 0;
    let remainingPercentageEquallyDivided = null;
    let arcsLength = [];
    let arcsLabels = [];


    gauge.props.arcs.forEach((arc, i) => {
      // Set arc limit to 0 if undefined
      arc.limit = arc.limit === undefined ? 0 : arc.limit;

      const arcRange = arc.limit - lastArcLimit;
      let arcLength = 0;

      // Calculate arc length based on previous arc percentage
      if (i !== 0) {
        arcLength = utils.calculatePercentage(gauge.props.minValue, gauge.props.maxValue, arc.limit) - lastArcLimitPercentageAcc;
      } else {
        arcLength = utils.calculatePercentage(gauge.props.minValue, gauge.props.maxValue, arcRange);
      }

      // Divide remaining percentage equally among remaining arcs
      if (!arc.limit) {
        const remainingArcs = gauge.props.arcs.slice(i);
        const remainingPercentage = (1 - lastArcLimit / 100) * 100;

        if (!remainingPercentageEquallyDivided) {
          remainingPercentageEquallyDivided = (remainingPercentage / Math.max(remainingArcs.length, 1)) / 100;
        }

        arcLength = remainingPercentageEquallyDivided;
        arc.limit = arcLength;
      }

      arcsLength.push(arcLength);
      lastArcLimitPercentageAcc = arcsLength.reduce((count, curr) => count + curr, 0);
      lastArcLimit = arc.limit;
      arcsLabels.push(arc.label);
    });

    gauge.arcData.current = arcsLength.map((length, i) => ({
      value: length,
      color: gauge.colorArray.current[i],
      label: arcsLabels[i],
    }));
  } else {
    const arcValue = gauge.props.maxValue / gauge.nbArcsToDisplay.current;

    gauge.arcData.current = Array.from({ length: gauge.nbArcsToDisplay.current }, (_, i) => ({
      value: arcValue,
      color: gauge.colorArray.current[i],
      label: null,
    }));
  }
};

export const setupArcs = (gauge) => {
  //Setup the arc
  gauge.arcChart.current
    .outerRadius(gauge.outerRadius.current)
    .innerRadius(gauge.innerRadius.current)
    .cornerRadius(gauge.props.cornerRadius)
    .padAngle(gauge.props.arcPadding);
  chartHooks.clearChart(gauge);
  //Draw the arc
  var arcPaths = gauge.doughnut.current
    .selectAll(".arc")
    .data(gauge.pieChart.current(gauge.arcData.current))
    .enter()
    .append("g")
    .attr("class", "arc");
  arcPaths
    .append("path")
    .attr("d", gauge.arcChart.current)
    .style("fill", (d) => d.data.color);
};
//Depending on the number of levels in the chart
//This function returns the same number of colors
export const getColors = (gauge) => {
  let arcColors = gauge.props.arcs?.map((arc) => arc.color);
  let colorsValue = arcColors?.some((color) => color != undefined) ? arcColors : CONSTANTS.defaultColors;
  //Check if the number of colors equals the number of levels
  //Otherwise make an interpolation
  let arcsEqualsColorsLength = gauge.nbArcsToDisplay.current === colorsValue.length;
  if (arcsEqualsColorsLength) return colorsValue;
  var colorScale = scaleLinear()
    .domain([1, gauge.nbArcsToDisplay.current])
    .range([colorsValue[0], colorsValue[colorsValue.length - 1]]) //Use the first and the last color as range
    .interpolate(interpolateHsl);
  var colorArray = [];
  for (var i = 1; i <= gauge.nbArcsToDisplay.current; i++) {
    colorArray.push(colorScale(i));
  }
  return colorArray;
};

export const clearArcs = (gauge) => gauge.doughnut.current.selectAll(".arc").remove();