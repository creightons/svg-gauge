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
    n = 1,
    length = 180,
    gap = 0,
    centerX = 150,
    centerY = 150,
    radius = 100,
    startAngle,
    endAngle,
    sectionAngle,
    width = 50,
    pathD,
    sector,
    sectorData = [];

sectionAngle = ( length - ( gap * (n-1) ) ) / n;
startAngle = 0;
endAngle = sectionAngle;
for (i = 0; i < n; i++) {
  pathD = describeArc(centerX, centerY, radius, startAngle, endAngle);
  sector = "<path fill='none' stroke='green' stroke-width='" + width + "' d='" + pathD + "' />";
  sectorData.push(sector);
  startAngle = endAngle + gap;
  endAngle = startAngle + sectionAngle;
}


function getTicks(x, y, radius, length, count) {
  var totalDegrees = 180,
      angle = 180 / count,
      innerRadius = radius - (length / 2),
      outerRadius = radius + (length / 2),
      currentAngle = 0,
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
    return "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' stroke='red' width='3' />";
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

var ticks = getTicks(centerX, centerY, radius, 60, 18);


var palette = document.querySelector('#palette');
palette.innerHTML = '';
palette.innerHTML += ticks;
palette.innerHTML += sectorData.join('');
