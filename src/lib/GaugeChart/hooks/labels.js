import * as utils from './utils.js';
export const setupLabels = (gauge) => {
  //Add start label
  let startLabel = gauge.props.minValue ? gauge.props.minValue : 0;
  gauge.g.current
    .append("g")
    .attr("class", "text-group")
    .attr(
      "transform",
      `translate(${gauge.outerRadius.current - 120}, ${gauge.outerRadius.current - 7})`
    )
    .append("text")
    .text("___ " + startLabel)
    // this computation avoid text overflow. When formatted value is over 10 characters, we should reduce font size
    .style("font-size", () =>
      `20px`
    )
    .style("fill", gauge.props.textColor)
    .style("text-anchor", "middle");
  //Add end label
  let endLabel = gauge.props.maxValue ? gauge.props.maxValue : 100;
  gauge.g.current
    .append("g")
    .attr("class", "text-group")
    .attr(
      "transform",
      `translate(${gauge.outerRadius.current + 110}, ${gauge.outerRadius.current - 7})`
    )
    .append("text")
    .text(endLabel + " ___")
    // this computation avoid text overflow. When formatted value is over 10 characters, we should reduce font size
    .style("font-size", () =>
      `20px`
    )
    .style("fill", gauge.props.textColor)
    .style("text-anchor", "middle");
  let labelValues = [45]
  labelValues.forEach((labelValue, index) => {
    let percent = utils.calculatePercentage(gauge.props.minValue, gauge.props.maxValue, labelValue);
    let radians = utils.percentToRad(percent);
    // let x = radius * Math.cos(radians - Math.PI / 2);
    // let y = radius * Math.sin(radians - Math.PI / 2);
    let radius = gauge.outerRadius.current - 100;
    let x = radius * Math.cos(radians - Math.PI / 2);
    let y = radius * Math.sin(radians - Math.PI / 2);
    gauge.g.current
      .append("g")
      .attr("class", "text-group")

      .append("text")
      .text("___").attr(
        "transform", d =>
        `translate(${x}, ${y})`
      )
      // this computation avoid text overflow. When formatted value is over 10 characters, we should reduce font size
      .style("font-size", () => `20px`)
      .style("fill", gauge.props.textColor)
      .style("text-anchor", "middle");
  });
}

//Adds text undeneath the graft to display which percentage is the current one
export const addValueText = (gauge) => {
  const { formatTextValue, fontSize, value, minValue, maxValue } = gauge.props;
  var textPadding = 20;
  var text = formatTextValue ? formatTextValue(utils.floatingNumber(value)) : utils.floatingNumber(value);
  var isPercentage = !formatTextValue ? minValue === 0 && maxValue === 100 : false;
  if (isPercentage) text += "%";

  gauge.g.current
    .append("g")
    .attr("class", "text-group")
    .attr(
      "transform",
      `translate(${gauge.outerRadius.current}, ${gauge.outerRadius.current / 2 + textPadding
      })`
    )
    .append("text")
    .text(text)
    // this computation avoid text overflow. When formatted text is over 10 characters, we should reduce font size
    .style("font-size", () => {
      const maxLengthBeforeComputation = 8;
      const textLength = text?.length || 0;
      const fontRatio = textLength > maxLengthBeforeComputation ? maxLengthBeforeComputation / textLength : 1; // Compute the font size ratio
      const fontSize = fontSize ? fontSize : `${gauge.width.current / 11}px`; // Set the default font size
      return `${parseFloat(fontSize) * fontRatio}px`; // Apply the font size ratio to the default font size
    })
    .style("fill", gauge.props.textColor)
    .style("text-anchor", "middle");
};

export const clearLabels = (gauge) => gauge.g.current.selectAll(".text-group").remove();