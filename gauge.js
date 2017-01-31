

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
	
var ticks = getTicks(x, y, radius, tickLength, tickCount);
var arc = getArc(x, y, radius, arcGap, arcWidth, arcSections);

var palette = document.querySelector('#palette');
palette.innerHTML = '';
palette.innerHTML += ticks;
palette.innerHTML += arc;

