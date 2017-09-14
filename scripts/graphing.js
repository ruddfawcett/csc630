var button = document.getElementById('calculate');
var canvas = document.getElementById('result');
var canvas_width = 500;
var canvas_height = 325;
var histogram_height = 300;

button.addEventListener('click', function() {
  var samples = +document.getElementById('samples').value;
  var normalcy = +document.getElementById('normalcy').value;
  var bins = +document.getElementById('bins').value;

  makeGraph(samples, normalcy, bins);
});

function generateDistribution(numSamples, normalcy) {
  var samples = [];

  // Loop through number of samples and add numbers.
  for (i=0; i < numSamples; i++) {
    var sum = 0;
    // Loop through normalcy and add random numbers.
    for (j=0; j < normalcy; j++) {
      sum += Math.random();
    }

    var sample = sum/normalcy;
    samples.push(sample);
  }

  return samples;
}

function generateCounts(distribution, numBins) {
  var range = 1/numBins;
  var counts = [];
  for (i=0; i < numBins; i++) {
    counts.push(0);
  }

  for (i = 0; i < distribution.length; i++) {
    for (j = 0; j < numBins; j++) {
      if (distribution[i] > range*j && distribution[i] < range*(j+1)) {
        counts[j] += 1;
      }
    }
  }

  return counts;
}

function makeGraph(numSamples, normalcy, numBins) {
  destroyGraph();
  var distribution = generateDistribution(numSamples, normalcy);
  var counts = generateCounts(distribution, numBins);

  var max_count = 0;

  for (i = 0; i < numBins; i++) {
    if (counts[i] > max_count) {
      max_count = counts[i];
    }
  }

  for (i = 0; i < numBins; i++) {
    var height = counts[i]/max_count;
    var width = canvas_width/numBins;
    var rect = makeRect(i, width, height);
    canvas.appendChild(rect);
    var label_text = Math.floor((1/numBins)*i*100)/100;
    canvas.appendChild(makeText(i*width, canvas_height-5, `${label_text}`));
  }

  makeAxes();
}

function makeRect(idx, width, height) {
  var scale = 500;
  height = height*histogram_height;
  var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('fill', 'black');
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);
  rect.setAttribute('x', idx*width);
  rect.setAttribute('stroke-width', 2);
  rect.setAttribute('stroke', 'white');
  rect.setAttribute('y', histogram_height-height);
  return rect;
}

function makeLine(x1, x2, y1, y2) {
  var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('fill', 'black');
  line.setAttribute('x1', x1);
  line.setAttribute('x2', x2);
  line.setAttribute('y1', y1);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke-width', 2);
  line.setAttribute('stroke', 'black');
  return line;
}

function makeText(x, y, val) {
  var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.appendChild(document.createTextNode(val));
  return text;
}

function makeAxes() {
  var x_axis = makeLine(0, canvas_width, histogram_height, histogram_height);
  var y_axis = makeLine(1, 1, 0, histogram_height);
  canvas.appendChild(makeText(canvas_width-7, canvas_height-5, '1'));

  canvas.appendChild(x_axis);
  canvas.appendChild(y_axis);
}

function destroyGraph() {
  canvas.innerHTML = '';
}

makeAxes();
makeGraph(5, 24, 10);
