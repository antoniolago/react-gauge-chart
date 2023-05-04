import * as utils from './utils';
import * as labelsHooks from './labels';
import {
  arc,
  pie,
  select,
  easeElastic,
  easeExpOut,  
  scaleLinear,
  interpolateHsl,
  interpolateNumber,
} from "d3";
//If 'resize' is true then the animation does not play
export const drawNeedle = (resize, gauge) => {
  const { needleColor, needleBaseColor, hideText, animate, value, minValue, maxValue } = gauge.props;
  var needleRadius = 15 * (gauge.width.current / 500), // Make the needle radius responsive
    centerPoint = [0, -needleRadius / 2];
  let currentPercent = utils.calculatePercentage(minValue, maxValue, value);
  var prevPercent = utils.calculatePercentage(minValue, maxValue, gauge.prevProps?.current.value || minValue);
  var pathStr = calculateRotation(prevPercent || gauge.valueInPercent.current, gauge);
  gauge.needle.current.append("path").attr("d", pathStr).attr("fill", needleColor);
  //Add a circle at the bottom of needle
  gauge.needle.current
    .append("circle")
    .attr("cx", centerPoint[0])
    .attr("cy", centerPoint[1])
    .attr("r", needleRadius)
    .attr("fill", needleBaseColor);
  //Translate the needle starting point to the middle of the arc
  gauge.needle.current.attr(
    "transform",
    "translate(" + gauge.outerRadius.current + ", " + gauge.outerRadius.current + ")"
  );
  if (!hideText) labelsHooks.addValueText(gauge);
  if(prevPercent == currentPercent) return;
  //Rotate the needle
  if (!resize && animate) {
    gauge.needle.current
      .transition()
      .delay(gauge.props.animDelay)
      .ease(gauge.props.elastic ? easeElastic : easeExpOut)
      .duration(gauge.props.animateDuration)
      .tween("progress",  () => {
        const currentInterpolatedPercent = interpolateNumber(prevPercent, currentPercent);
        return function (percentOfPercent) {
          const progress = currentInterpolatedPercent(percentOfPercent);
          return gauge.container.current
            .select(`.needle path`)
            .attr("d", calculateRotation(progress, gauge));
        };
      });
  } else {
    gauge.container.current
      .select(`.needle path`)
      .attr("d", calculateRotation(gauge.valueInPercent.current, gauge));
  }
};

export const calculateRotation = (percent, gauge) => {
  var needleLength = gauge.outerRadius.current * 0.55, //TODO: Maybe it should be specified as a percentage of the arc radius?
    needleRadius = 15 * (gauge.width.current / 500),
    theta = utils.percentToRad(percent),
    centerPoint = [0, -needleRadius / 2],
    topPoint = [
      centerPoint[0] - needleLength * Math.cos(theta),
      centerPoint[1] - needleLength * Math.sin(theta),
    ],
    leftPoint = [
      centerPoint[0] - needleRadius * Math.cos(theta - Math.PI / 2),
      centerPoint[1] - needleRadius * Math.sin(theta - Math.PI / 2),
    ],
    rightPoint = [
      centerPoint[0] - needleRadius * Math.cos(theta + Math.PI / 2),
      centerPoint[1] - needleRadius * Math.sin(theta + Math.PI / 2),
    ];
  var pathStr = `M ${leftPoint[0]} ${leftPoint[1]} L ${topPoint[0]} ${topPoint[1]} L ${rightPoint[0]} ${rightPoint[1]}`;
  return pathStr;
};

export const addNeedleElement = (gauge) => gauge.needle.current = gauge.g.current.append("g").attr("class", "needle");
export const clearNeedleElement = (gauge) => gauge.needle.current.selectAll("*").remove();
