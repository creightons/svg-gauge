function degreeToRadian(angle) { return angle * Math.PI / 180; }

/*
Takes a radius, circle center, and rotational angle and converts
the coordinates to absolute Cartesian values.

For the Cartesian system, right is considered the positive x
direction and down is considered the positive y direction.

For the Polar system. The right side of the x asis is considered
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
		
	if (0 < angle < 90) {
		referenceAngle = degreeToRadian(angle);
		x = centerX + (radius * Math.cos(referenceAngle));
		y = centerY - (radius * Math.sin(referenceAngle));
	}
	else if (90 < angle < 180) {
		referenceAngle = degreeToRadian(180 - angle);
		x = centerX - (radius * Math.cos(referenceAngle));
		y = centerY - (radius * Math.sin(referenceAngle));
	}
	else if (180 < angle < 270) {
		referenceAngle = degreeToRadian(angle - 180);
		x = centerX - (radius * Math.cos(referenceAngle));
		y = centerY + (radius * Math.sin(referenceAngle));
	}
	else if (270 < angle < 360) {
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