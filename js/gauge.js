let utils = require('./utils');

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
  ));
  
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

function drawGauge2() {
	const x = 150,
		y = 150,
		radius = 100,
		startAngle = 90,
		stopAngle = 270,
		arcWidth = 50,
		tickCount = 10,
		length = 60
	;
		
	const arc = utils.getArc(x, y, radius, startAngle, stopAngle, arcWidth, 'cyan');
	const ticks = getTicks(x, y, radius, length, tickCount);
	const reading = `<text id='reading' x='${x}' y='${y}' text-anchor='middle' font-size='35'>0</text>`;
	const needle = `
		<path
			id='needle'
			d='M145 95 L150 25 L155 95 Z'
			fill='green'
			stroke='green'
			stroke-width='1'
			style='transform: rotate(-90deg); transform-origin: 150px 150px; transition: transform 0.7s'
		/>
	`;
	
	const svg = `
		<svg width=${2 * (x + 10)} height=${y + 10}>
			${ticks}
			${arc}
			${reading}
			${needle}
		</svg>
	`;
	
	return svg;
}

const gauge1 = document.querySelector('#gauge1');
gauge1.innerHTML = drawGauge2();

const needle = document.getElementById('needle'),
	reading = document.getElementById('reading');


function changeAngle(needle, reading) {
	// Subtract .5 from the random number to make the angle
	// vary between -90deg and 90deg.
	const angle = 180 * (Math.random() - 0.5);
	// Convert angle to a value from 0 to 100.
	// Also, need to make sure angle ranges from 0 to 180.
	const value = (angle + 90) * 100 / 180;
	needle.style.transform = `rotate(${angle}deg)`;
	reading.innerHTML = value.toFixed();
}

setInterval(function() { changeAngle(needle, reading); }, 2000);

