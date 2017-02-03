let {
	polarToCartesian,
	getArc,
	getTick,
	getTickValue,
	getNeedle,
} = require('./utils');

function drawGauge(radius) {
	let width = (2 * radius) + 50,
		height = width,
		centerX = width / 2,
		centerY = centerX,
		startAngle = 90,
		endAngle = 270,
		gaugeColor = '#000'
	;
	
	/***************************
	* Get Outer Arc
	***************************/

	let outerArc = getArc(
		centerX,
		centerY,
		radius,
		startAngle,
		endAngle,
		2,
		gaugeColor
	);
	
	/***************************
	* Get Tick Marks
	***************************/		
	let ticks = [],
		tickCount = 20,
		angleStep = (endAngle - startAngle) / tickCount,
		currentAngle;
	
	// Using <= because we have to draw tickCount + 1 ticks
	for (let i = 0; i <= tickCount; i++) {
		currentAngle = startAngle + (i * angleStep);
		ticks.push(getTick(
			currentAngle,
			radius,
			centerX,
			centerY,
			0.1,
			2,
			gaugeColor
		));
	}
	
	/***************************
	* Get Tick Values
	***************************/
	let tickValues = [],
		tickValueCount = tickCount / 2,
		tickValueAngleStep = (endAngle - startAngle) / tickValueCount,
		minValue = 0,
		maxValue = 5000,
		valueStep = (maxValue - minValue) / tickValueCount,
		currentValue,
		fontSize = 0.08 * radius,
		fontFamily = 'Helvetica';
	
	for (let j = 0; j <= tickValueCount; j++) {
		currentValue = minValue + (j * valueStep);
		currentAngle = startAngle + (j * tickValueAngleStep);
		tickValues.push(getTickValue(
			currentAngle,
			0.8 * radius,
			centerX,
			centerY,
			currentValue,
			fontSize,
			fontFamily
		));
	}

	/***************************
	* Get Gauge Reading
	***************************/	
	let reading = getTickValue(
		0,
		0.3 * radius,
		centerX,
		centerY,
		( (maxValue - minValue) / 2 ) + minValue,
		3 * fontSize,
		fontFamily
	);
	
	/***************************
	* Get Needle
	***************************/	
	let needle = getNeedle(
		1 * radius,
		0.05 * radius,
		centerX,
		centerY,
		'green'
	);
	
	/***************************
	* Combine the parts into a svg gauge
	***************************/	
	let gaugeTemplate = `
		<svg
			width='${width}'
			height='${height}'
		>
			${outerArc}
			${ticks.join('')}
			${tickValues.join('')}
			${reading}
			${needle}
		</svg>
	`;

	return gaugeTemplate;
}

let gaugeString = drawGauge(100);

document.querySelector('#gauge4').innerHTML = gaugeString;