/*
Takes an angle in degrees and converts it to radians.

Parameters:

angle - an angle in degrees

Returns:

an angle in radians
*/
function degreeToRadian(angle) { return angle * Math.PI / 180; }

/*
Takes a radius, circle center, and rotational angle and converts
the coordinates to absolute Cartesian values.

For the Cartesian system, right is considered the positive x
direction and down is considered the positive y direction.

For the Polar system. The bottom part of the y-axis is considered
0 degrees and the positive angle direction is clockwise.

Parameters:

angle - an angle in degrees
radius - the radius of the polar coordinates in pixels
centerX - the circle center X value
centerY - the circle center Y value

Returns:

An object containing the newly calculated x and y coordinates of the
point described in the polar system, both in pixels.
{ x, y }
*/
function polarToCartesian(angle, radius, centerX, centerY) {
	let referenceAngle,
		x,
		y;
		
	if (0 < angle && angle < 90) {
		referenceAngle = degreeToRadian(90 - angle);
		x = centerX - (radius * Math.cos(referenceAngle));
		y = centerY + (radius * Math.sin(referenceAngle));
	}
	else if (90 < angle && angle < 180) {
		referenceAngle = degreeToRadian(angle - 90);
		x = centerX - (radius * Math.cos(referenceAngle));
		y = centerY - (radius * Math.sin(referenceAngle));
	}
	else if (180 < angle && angle < 270) {
		referenceAngle = degreeToRadian(270 - angle);
		x = centerX + (radius * Math.cos(referenceAngle));
		y = centerY - (radius * Math.sin(referenceAngle));
	}
	else if (270 < angle && angle < 360) {
		referenceAngle = degreeToRadian(angle - 360
		x = centerX + (radius * Math.cos(referenceAngle));
		y = centerY + (radius * Math.sin(referenceAngle));
	}
	else if (angle === 0 || angle === 360) {
		x = centerX;
		y = centerY + radius;
	}
	else if (angle === 90) {
		x = centerX - radius;
		y = centerY;
	}
	else if (angle === 180) {
		x = centerX;
		y = centerY - radius;
	}
	else { // if angle === 270
		x = centerX + radius;
		y = centerY;
	}
	
	return { x, y };
}


/*
Creates an svg path tag drawing a circular arc.

The angles are measured starting from the bottom y-axis as 0 degrees
and moving clockwise as the positive direction.

Parameters:

x - the circle center X value in pixels
y - the circle center Y value in pixels
radius - the radius from the circle center to the midpoint of the arc in pixels
startAngle - the starting position of the arc in degrees
endAngle - the ending position of the arc in degrees
width - the width of the arc
color - the color of the arc (a hex value)

Returns:

An svg <path /> tag describing the arc
*/
function getArc(x, y, radius, startAngle, endAngle, width, color) {
	let start,
		end,
		largeArcFlag,
		pathD,
		arc;
	
	start = polarToCartesian(x, y, radius, endAngle);
	end = polarToCartesian(x, y, radius, startAngle);

	argeArcFlag = (endAngle - startAngle) <= 180 ? "0" : "1",
	
	pathD = [
		"M", start.x, start.y, 
		"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ");

	arc = `
		<path
			fill='none'
			stroke='${color}'
			stroke-width='${width}'
			d='${pathD}'
		/>
	`;
}

/*
Generates a line segment for a tick mark. It does this by drawing a portion of 
a radius with respect to a provided circle center.

The tick will be the outer portion of the radius that you specify.

The angles are measured starting from the bottom y-axis as 0 degrees
and moving clockwise as the positive direction.

Parameters:

angle - the position of the arc in degrees relative to the circle center
radius - the radius from the circle center in pixels
x - the circle center X value in pixels
y - the circle center Y value in pixels
length - the percent length of the radius to draw as a tick; A number between 0 and 1
width - the width of tick in pixels
color - the color of the tick (a hex value)

Returns:

A <line /> tag describing a tick mark on a gauge
*/
function getTick(angle, radius, x, y, length, width, color) {
	let x1,
		x2,
		y1,
		y2,
		innerRadius = (1 - length) * radius,
		coordinates,
		template
	;
	
	innerRadius = major
		? tickInnerRadiusMajor
		: tickInnerRadiusMinor;
	
	coordinates = polarToCartesian(
		angle,
		innerRadius,
		x,
		y
	);
	
	x1 = coordinates.x;
	y1 = coordinates.y;
	
	coordinates = polarToCartesian(
		angle,
		tickOuterRadius,
		x,
		y
	);
	
	x2 = coordinates.x;
	y2 = coordinates.y;	
	
	template = `
		<line
			x1='${x1}'
			y1='${y1}'
			x2='${x2}'
			y2='${y2}'
			stroke='gray'
			stroke-width='${width}'
		/>
	`;
	
	return template;
}

module.exports = {
	degreeToRadian,
	polarToCartesian,
	getArc,
	getTick,
}