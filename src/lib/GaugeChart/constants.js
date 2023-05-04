export const CONSTANTS = {
    startAngle: -Math.PI / 2, //Negative x-axis
    endAngle: Math.PI / 2, //Positive x-axis
    defaultStyle: {
        width: "100%",
    },
    // Props that should cause an animation on update
    animateNeedleProps:[
        "marginInPercent",
        "arcPadding",
        "value",
        "nrOfLevels",
        "animDelay",
    ],
    defaultColors: ["#5BE12C", "#F5CD19", "#EA4228"]
} 
export default CONSTANTS;