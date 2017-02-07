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
		referenceAngle = degreeToRadian(angle - 270);
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

paper - a Raphael object to add the arc to
x - the circle center X value in pixels
y - the circle center Y value in pixels
radius - the radius from the circle center to the midpoint of the arc in pixels
startAngle - the starting position of the arc in degrees
endAngle - the ending position of the arc in degrees
width - the width of the arc
color - the color of the arc (a hex value)

Returns:

N/A

Side Effect:

Adds arc to the Rafael paper object
*/
function getArc(paper, x, y, radius, startAngle, endAngle, width, color) {
	let start,
		end,
		largeArcFlag,
		pathD,
		arc;
	
	// Need to swap the start and end angles to draw the arc properly.
	// The arc is drawn Counter-Clockwise between the points, but our angles
	// are specified according to a convention that Clockwise is the positive
	// direction.
	start = polarToCartesian(endAngle, radius, x, y);
	end = polarToCartesian(startAngle, radius, x, y);

	largeArcFlag = (endAngle - startAngle) <= 180 ? "0" : "1",
	
	pathD = [
		"M", start.x, start.y, 
		"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ");
	
	arc = paper.path(pathD);

	arc.attr({ fill: 'none', stroke: color, 'stroke-width': width });
}

/*
Generates a line segment for a tick mark. It does this by drawing a portion of 
a radius with respect to a provided circle center.

The tick will be the outer portion of the radius that you specify.

The angles are measured starting from the bottom y-axis as 0 degrees
and moving clockwise as the positive direction.

Parameters:

paper - a Raphael object to the line to
angle - the position of the arc in degrees relative to the circle center
radius - the radius from the circle center in pixels
x - the circle center X value in pixels
y - the circle center Y value in pixels
length - the percent length of the radius to draw as a tick; A number between 0 and 1
width - the width of tick in pixels
color - the color of the tick (a hex value)

Returns:

N/A

Side Effect:

Adds arc to the Rafael paper object
*/
function getTick(paper, angle, radius, x, y, length, width, color) {
	let x1,
		x2,
		y1,
		y2,
		innerRadius = (1 - length) * radius,
		coordinates,
		tick
	;
		
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
		radius,
		x,
		y
	);
	
	x2 = coordinates.x;
	y2 = coordinates.y;	
	tick = paper.path([ 'M', x1, y1, 'L', x2, y2 ]);
	tick.attr({ stroke: color, 'stroke-width': width });
}

/*
Generates a tick value reading at the location specified.

The text is position at a distance relative to a supplied
circle center.

The angles are measured starting from the bottom y-axis as 0 degrees
and moving clockwise as the positive direction.

Parameters:

paper - a Raphael object to add the text to
angle - the position of the text in degrees relative to the circle center
radius - the radius from the circle center in pixels
x - the circle center X value in pixels
y - the circle center Y value in pixels
value - the value to display (Number type)
fontSize - the size of the text in pixels
fontFamily - the font type to show the reading in

Returns:

A <text /> tag centered at the provided location.
*/
function getTickValue(paper, angle, radius, x, y, value, fontSize, fontFamily) {
	let coordinates = polarToCartesian(angle, radius, x, y);
	let text = paper.text(coordinates.x, coordinates.y, value.toFixed());
	text.attr({
		'text-anchor': 'middle',
		'alignment-baseline': 'middle',
		'font-size': fontSize,
		'font-family': fontFamily,
	});
}

/*
Generates a needle pointing directly up. The needle starts
at the coordinates of the specified circle center.

Parameters:

paper - a Raphael object to add the needle to
height - the height of the needle in pixels
width - the width of the needle in pixels,
x - the circle center X value in pixels
y - the circle center Y value in pixels
color - the color of the needle (a hex value)

Returns:

N/A

Side Effect:

Adds arc to the Rafael paper object
*/
function getNeedle(paper, height, width, x, y, color) {
	let x1 = x - (width / 2),
		y1 = y,
		x2 = x,
		y2 = y - height,
		x3 = x + (width / 2),
		y3 = y;
	
	let needle = paper.path([ 'M', x1, y1, 'L', x2, y2, 'L', x3, y3, 'Z' ]);
	needle.attr({
		id: 'gauge-needle',
		fill: color,
		stroke: color,
		'stroke-width': 1,
	});
	
	let needleBase = paper.circle(x, y, width);
	needleBase.attr({ stroke: color, fill: color });
}

module.exports = {
	degreeToRadian,
	polarToCartesian,
	getArc,
	getTick,
	getTickValue,
	getNeedle,
};