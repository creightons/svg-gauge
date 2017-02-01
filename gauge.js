

function getArc(x, y, radius, gap, width, n) {
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	function describeArc(x, y, radius, startAngle, endAngle){
		// Assume 
		startAngle -= 90;
		endAngle-= 90;
		var start = polarToCartesian(x, y, radius, endAngle);
		var end = polarToCartesian(x, y, radius, startAngle);
		var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
		var d = [
			"M", start.x, start.y, 
			"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
		].join(" ");
		return d;       
	}

	var i,
		length = 180,
		color = 'cyan',
		startAngle,
		endAngle,
		sectionAngle,
		pathD,
		sector,
		sectorData = [];

	sectionAngle = ( length - ( gap * (n-1) ) ) / n;
	startAngle = 0;
	endAngle = sectionAngle;
	for (i = 0; i < n; i++) {
		pathD = describeArc(x, y, radius, startAngle, endAngle);
		sector = "<path fill='none' stroke='" + color + "' stroke-width='" + width + "' d='" + pathD + "' />";
		sectorData.push(sector);
		startAngle = endAngle + gap;
		endAngle = startAngle + sectionAngle;
	}
	
	return sectorData.join('');
}

function getTicks(x, y, radius, length, count) {
  var totalDegrees = 180,
      angle = 180 / count,
      innerRadius = radius - (length / 2),
      outerRadius = radius + (length / 2),
      currentAngle = 0,
	  color = 'lightgray',
      calculationAngle,
      radianAngle,
      xi,
      xo,
      yi,
      yo,
      scalar,
      i,
      tickLine,
      ticks = [];
  function degreeToRad (angle) { return angle * Math.PI / 180 }

  function template(x1, y1, x2, y2) {
    return "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' stroke='" + color + "' width='3' />";
  }
  
  ticks.push(template(
    x - innerRadius,
    y,
    x - outerRadius,
    y
  ))
  for (var i = 0; i < count; i++) {
    currentAngle += angle;
    calculationAngle = currentAngle <= 90
      ? currentAngle
      : 180 - currentAngle;
    radianAngle = degreeToRad(calculationAngle);
    scalar = currentAngle <= 90 ? -1 : 1;
    
    xi = x + (scalar * innerRadius * Math.cos(radianAngle));
    xo = x + (scalar * outerRadius * Math.cos(radianAngle));
    yi = y - (innerRadius * Math.sin(radianAngle));
    yo = y - (outerRadius * Math.sin(radianAngle));
    
    tickLine = template(xi, yi, xo, yo);
  
    ticks.push(tickLine);
  } 
  
  return ticks.join('');
}

var x = 150,
	y = 150,
	radius = 100,
	arcWidth = 50,
	arcGap = 5,
	arcSections = 1,
	tickLength = 60,
	tickCount = 10;
function drawGauge(x, y, radius, arcWidth, arcGap, arcSections, tickLength, tickCount) {
	var ticks = getTicks(x, y, radius, tickLength, tickCount);
	var arc = getArc(x, y, radius, arcGap, arcWidth, arcSections);
	var triangle = "<path id='needle' d='M145 95 L150 25 L155 95 Z' fill='green' stroke='green' stroke-width='1' />";
	var reading = "<text id='reading' x='" + x + "' y='" + y + "' text-anchor='middle' font-size='35' />";
	var palette = document.querySelector('#palette');

	palette.innerHTML = '';
	palette.innerHTML += ticks;
	palette.innerHTML += arc;
	palette.innerHTML += triangle;
	palette.innerHTML += reading;
}

drawGauge(x, y, radius, arcWidth, arcGap, arcSections, tickLength, tickCount);

var needle = document.getElementById('needle'),
	reading = document.getElementById('reading');

needle.style.transform = 'rotate(-90deg)';
needle.style.transformOrigin =`${x}px ${y}px`;
needle.style.transition = 'transform 0.7s';
reading.innerHTML = '0';

function changeAngle(needle, reading) {
	// Subtract .5 from the random number to make the angle
	// vary between -90deg and 90deg.
	var angle = 180 * (Math.random() - 0.5);
	// Convert angle to a value from 0 to 100.
	// Also, need to make sure angle ranges from 0 to 180.
	var value = (angle + 90) * 100 / 180;
	needle.style.transform = `rotate(${angle}deg)`;
	reading.innerHTML = value.toFixed();
}

setInterval(function() { changeAngle(needle, reading); }, 2000);

