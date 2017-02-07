let {
	polarToCartesian,
	getArc,
	getTick,
	getTickValue,
	getNeedle,
} = require('./utils');

let utils = require('./utils-raphael');
let Raphael = require('raphael');

function drawGauge(radius) {
	let width = (2 * radius) + 50,
		height = width,
		centerX = width / 2,
		centerY = centerX,
		startAngle = 45,
		endAngle = 315,
		gaugeColor = 'gray',
		needleColor = '#000'
	;
	
	let paper = new Raphael(
		document.getElementById('gauge7'),
		width,
		height
	);
	
	paper.circle(centerX, centerY, 1.1 * radius).attr({ fill: 'black' });
	paper.circle(centerX, centerY, 1.08 * radius).attr({ fill: 'white' });

	
	/***************************
	* Get Arc for Ticks
	***************************/
	utils.getArc(
		paper,
		centerX,
		centerY,
		radius,
		startAngle,
		endAngle,
		2,
		gaugeColor
	);
	
	let innerAngleStep = (endAngle - startAngle) / 3,
		red = '#FFAAAA',
		yellow = '#F2F200',
		green = '#62D800',
		innerArcRadius = 0.948 * radius,
		innerArcWidth = 0.09 * radius;
	
	utils.getArc(
		paper,
		centerX,
		centerY,
		innerArcRadius,
		startAngle,
		startAngle + innerAngleStep,
		innerArcWidth,
		green
	);
	
	utils.getArc(
		paper,
		centerX,
		centerY,
		innerArcRadius,
		startAngle + innerAngleStep,
		startAngle + (2 * innerAngleStep),
		innerArcWidth,
		yellow
	);
	
	utils.getArc(
		paper,
		centerX,
		centerY,
		innerArcRadius,	
		startAngle + (2 * innerAngleStep),
		endAngle,
		innerArcWidth,
		red
	);
	
	/***************************
	* Get Tick Marks
	***************************/		
	let tickCount = 20,
		angleStep = (endAngle - startAngle) / tickCount,
		currentAngle;
	
	// Using <= because we have to draw tickCount + 1 ticks
	for (let i = 0; i <= tickCount; i++) {
		currentAngle = startAngle + (i * angleStep);
		utils.getTick(
			paper,
			currentAngle,
			radius,
			centerX,
			centerY,
			0.1,
			2,
			gaugeColor
		);
	}
	
	/***************************
	* Get Tick Values
	***************************/
	let tickValueCount = tickCount / 4,
		tickValueAngleStep = (endAngle - startAngle) / tickValueCount,
		minValue = 0,
		maxValue = 5000,
		valueStep = (maxValue - minValue) / tickValueCount,
		currentValue,
		fontSize = 0.1 * radius,
		fontFamily = 'Helvetica';
	
	for (let j = 0; j <= tickValueCount; j++) {
		currentValue = minValue + (j * valueStep);
		currentAngle = startAngle + (j * tickValueAngleStep);
		utils.getTickValue(
			paper,
			currentAngle,
			0.7 * radius,
			centerX,
			centerY,
			currentValue,
			fontSize,
			fontFamily
		);
	}

	/***************************
	* Get Gauge Reading
	***************************/	
	utils.getTickValue(
		paper,
		0,
		0.6 * radius,
		centerX,
		centerY,
		( (maxValue - minValue) / 2 ) + minValue,
		3 * fontSize,
		fontFamily
	);
	
	/***************************
	* Get Needle
	***************************/	
	utils.getNeedle(
		paper,
		1 * radius,
		0.05 * radius,
		centerX,
		centerY,
		needleColor
	);
}

drawGauge(200);

