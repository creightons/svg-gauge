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
		startAngle = 45,
		endAngle = 315,
		gaugeColor = 'gray',
		needleColor = '#000'
	;
	
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
	* Get Arc for Ticks
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
	
	let innerAngleStep = (endAngle - startAngle) / 3,
		red = '#FFAAAA',
		yellow = '#F2F200',
		green = '#62D800',
		innerArcRadius = 0.948 * radius,
		innerArcWidth = 0.09 * radius;
	
	let innerArc1 = getArc(
		centerX,
		centerY,
		innerArcRadius,
		startAngle,
		startAngle + innerAngleStep,
		innerArcWidth,
		green
	);
	
	let innerArc2 = getArc(
		centerX,
		centerY,
		innerArcRadius,
		startAngle + innerAngleStep,
		startAngle + (2 * innerAngleStep),
		innerArcWidth,
		yellow
	);
	
	let innerArc3 = getArc(
		centerX,
		centerY,
		innerArcRadius,	
		startAngle + (2 * innerAngleStep),
		endAngle,
		innerArcWidth,
		red
	);
	
	/***************************
	* Get Tick Values
	***************************/
	let tickValues = [],
		tickValueCount = tickCount / 4,
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
		tickValues.push(getTickValue(
			currentAngle,
			0.7 * radius,
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
	let needle = getNeedle(
		1 * radius,
		0.05 * radius,
		centerX,
		centerY,
		needleColor
	);
	
	/***************************
	* Combine the parts into a svg gauge
	***************************/	
	let gaugeTemplate = `
		<svg
			width='${width}'
			height='${height}'
		>
		
			<circle
				cx='${centerX}'
				cy='${centerY}'
				r='${1.1 * radius}'
				fill='black'
			/>
			<circle
				cx='${centerX}'
				cy='${centerY}'
				r='${1.08 * radius}'
				fill='white'
			/>
			${outerArc}
			${innerArc1}
			${innerArc2}
			${innerArc3}
			${ticks.join('')}
			${tickValues.join('')}
			${reading}
			${needle}
		</svg>
	`;

	return gaugeTemplate;
}

let gaugeString = drawGauge(150);

document.querySelector('#gauge6').innerHTML = gaugeString;