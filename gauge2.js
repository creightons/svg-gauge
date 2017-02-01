function degreeToRadian(angle) { return angle * Math.PI / 180; }

/*
Takes a radius, circle center, and rotational angle and converts
the coordinates to absolute Cartesian values.

For the Cartesian system, right is considered the positive x
direction and down is considered the positive y direction.

For the Polar system. The right side of the x axis is considered
0 degrees and the positive angle direction is counter-clockwise.

Parameters:

angle - an angle in degrees
radius - the radius of the polar coordinates
centerX - the circle center X value
centerY - the circle center Y value

Returns:

An object containing the newly calculated x and y coordinates of the
point described in the polar system, both in pixels.
{ x, y }
*/
function polarToCartesian(angle, radius, centerX, centerY) {
	var referenceAngle,
		x,
		y;
		
	if (0 < angle && angle < 90) {
		referenceAngle = degreeToRadian(angle);
		x = centerX + (radius * Math.cos(referenceAngle));
		y = centerY - (radius * Math.sin(referenceAngle));
	}
	else if (90 < angle && angle < 180) {
		referenceAngle = degreeToRadian(180 - angle);
		x = centerX - (radius * Math.cos(referenceAngle));
		y = centerY - (radius * Math.sin(referenceAngle));
	}
	else if (180 < angle && angle < 270) {
		referenceAngle = degreeToRadian(angle - 180);
		x = centerX - (radius * Math.cos(referenceAngle));
		y = centerY + (radius * Math.sin(referenceAngle));
	}
	else if (270 < angle && angle < 360) {
		referenceAngle = degreeToRadian(360 - angle);
		x = centerX + (radius * Math.cos(referenceAngle));
		y = centerY + (radius * Math.sin(referenceAngle));
	}
	else if (angle === 0 || angle === 360) {
		x = centerX + radius;
		y = centerY;
	}
	else if (angle === 90) {
		x = centerX;
		y = centerY - radius;
	}
	else if (angle === 180) {
		x = centerX - radius;
		y = centerY;
	}
	else { // if angle === 270
		x = centerX;
		y = centerY + radius;
	}
	
	return { x: x, y: y };
}

// If an angle goes over 360, reduce it back to an angle
// between 0 and 360 degrees.
function getAngle(angle) {
	return angle % 360;
}

function getTick(angle, radius, centerX, centerY) {
	var tickX1,
		tickX2,
		tickY1,
		tickY2,
		tickInnerRadius = 0.7 * radius,
		tickOuterRadius = 0.9 * radius,
		coordinates,
		width = 0.01 * radius,
		template
	;
	
	coordinates = polarToCartesian(
		angle,
		tickInnerRadius,
		centerX,
		centerY
	);
	
	tickX1 = coordinates.x;
	tickY1 = coordinates.y;
	
	coordinates = polarToCartesian(
		angle,
		tickOuterRadius,
		centerX,
		centerY
	);
	
	tickX2 = coordinates.x;
	tickY2 = coordinates.y;	
	
	template = `<line x1='${tickX1}' y1='${tickY1}' x2='${tickX2}' y2='${tickY2}' stroke='gray' stroke-width='${width}' />`;
	
	return template;
}

function Gauge(el, radius) {
	// The gauge is held in a square
	var sideLength = 2 * (radius + 10),
		outerRadius = radius,
		innerRadius = 0.95 * radius,
		centerX = centerY = radius + 10,
		needleWidth = 0.04 * innerRadius,
		needleHeight = 0.95 * innerRadius,
		needleCenterRadius = 0.04 * innerRadius,
		//needle coordinates
		x1 = centerX - (needleWidth / 2),
		y1 = centerY,
		x2 = centerX,
		y2 = centerY - needleHeight,
		x3 = centerX + (needleWidth / 2),
		y3 = centerY,
		needleCSS = {
			'transform-origin': `${centerX}px ${centerY}px`,
			'transform': 'rotate(-135deg)',
			'transition': 'rotate 0.5s',
		},
		needleStyles = '',
		readingX = centerX,
		readingY = centerY + (0.8 * innerRadius),
		readingFontSize = 0.3 * radius,
		startAngle = 225,
		degreesToTravel = 270, // cover 3/4 of a circle
		tickCount = 20,
		angleChange = (degreesToTravel / tickCount),
		currentAngle,
		ticks = [],
		tickString,
		i,
		gauge,
		tickValues = [],
		tickValueString,
		coordinates,
		textRadius = 0.55 * innerRadius,
		tickValue,
		minValue = 0,
		maxValue = 2500,
		tickFontSize = 0.08 * innerRadius,
		// Create a value for every other tick
		numValues = tickCount / 2,
		currentValue,
		valueAngleChange = degreesToTravel / numValues,
		valueStep = ( maxValue - minValue ) / numValues
	;
	
	for (key in needleCSS) {
		needleStyles += `${key}: ${needleCSS[key]};`;
	}
	
	for (i = 0; i <= tickCount; i++) {
		// Subtracting angleChange because the ticks are drawn in a clockwise
		// fashion, but the angles are measured Counter Clockwise starting from
		// the right-side x-axis. Also, negative values are converted to their
		// equivalent positional values in the range from 0 to 360 degrees.
		currentAngle = startAngle - (i * angleChange);
		if (currentAngle < 0) {
			currentAngle += 360;
		}
		
		ticks.push(getTick(
			currentAngle,
			innerRadius,
			centerX,
			centerY
		));
	}

	tickString = ticks.join('');



	for (i = 0; i <= numValues; i += 1) {
		currentAngle = startAngle - ( i * valueAngleChange );
		if (currentAngle < 0) { currentAngle += 360 };
		currentValue = minValue + ( i * valueStep );
		coordinates = polarToCartesian(currentAngle, textRadius, centerX, centerY);
		tickValue = `
			<text
				x='${coordinates.x}'
				y='${coordinates.y}'
				text-anchor='middle'
				alignment-baseline='middle'
				font-size='${tickFontSize}'
				font-family='Verdana'
			>
				${currentValue.toFixed()}
			</text>
		`;
			
		tickValues.push(tickValue);
	}
	
	tickValueString = tickValues.join('');
	
	gauge = `
		<svg width='${sideLength}' height='${sideLength}'>
			<circle cx='${centerX}' cy='${centerY}' r='${outerRadius}' fill='gray' />
			<circle cx='${centerX}' cy='${centerY}' r='${innerRadius}' fill='white' />
			<g>
				${tickString}
				${tickValueString}
			</g>
			<circle cx='${centerX}' cy='${centerY}' r='${needleCenterRadius}' fill='red' />
			<path
				id='gauge-needle'
				d='M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z'
				style='${needleStyles}'
				fill='red'
				stroke='red'
				stroke-width='1'
			/>
			<text
				id='gauge-reading'
				x='${readingX}'
				y='${readingY}'
				text-anchor='middle'
				font-size='${readingFontSize}'
				font-family='Verdana'
			>
				${minValue.toFixed()}
			</text>
		</svg>
	`;
	
	el.innerHTML = gauge;
	
	addSlider(
		el,
		minValue,
		maxValue,
		document.querySelector('#gauge-needle'),
		document.querySelector('#gauge-reading')
	);
}

function addSlider(el, min, max, needle, reading) {
	var step = (max - min) / 100;
	var sliderTemplate = `
		<input
			id='slider'
			type='range'
			value='${min}'
			min='${min}'
			max='${max}'
			step='${step}'
		/>
	`;
	
	el.insertAdjacentHTML('afterend',sliderTemplate);
	var sliderEl = document.querySelector('#slider');
	
	function handleChange(e) {
		var value = e.target.value;
		var angle = ( ( 270 * parseFloat(value) ) / (max - min) ) - 135;
		needle.style.transform = `rotate(${angle}deg)`;
		reading.innerHTML = value;
		debugger;
	}
	
	sliderEl.addEventListener('input', handleChange);
	sliderEl.addEventListener('change', handleChange);

}

Gauge(
	document.querySelector('#gauge2'),
	100
);
