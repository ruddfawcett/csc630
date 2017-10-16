const WIDTH = 530,
      HEIGHT = 530,
      DRAG_FACTOR = .10,
      SCALE = HEIGHT/2,
      SPIN_VELOCITY = [-0.015, 0];

var colors = {
  'Vulnerable': '#82ef34', // green
  'Definitely endangered': '#efe534', // yellow
  'Severely endangered': '#349bef', // blue
  'Critically endangered': '#ef34c3', // magenta
  'Extinct': '#EF3E36' // red
}

var active = d3.select(null);

var andover_coordinates = [-71.1323190, 42.6471420];

d3.queue(3)
    .defer(d3.json, 'data/world.min.json')
    .defer(d3.tsv, 'data/world-country-names.tsv')
    .defer(d3.csv, 'data/endangered-languages.csv')
    .await(ready);

var rotate = [0, -30];
var projection = d3.geoOrthographic().scale(SCALE).rotate(rotate).translate([WIDTH/2, HEIGHT/2]).clipAngle(90).precision(.5);
var circle = d3.geoCircle();

var time = d3.now();
var constantSpin = function() {
   var dt = d3.now() - time;
   projection.rotate([rotate[0]+(SPIN_VELOCITY[0]*dt), rotate[1]+(SPIN_VELOCITY[1]*dt)]);
   svg.selectAll('path').attr('d', path);
}

var spin = d3.timer(constantSpin);

var path = d3.geoPath().projection(projection);
var graticule = d3.geoGraticule().step([10, 10]);

var container = d3.select('.container');
var svg = container.append('svg');
svg.attr('width', WIDTH).attr('height', HEIGHT);

function ready(error, world, names, languages) {
  var labels = d3.select('ul').selectAll('li').data(d3.entries(colors)).enter().append('li').style('color', function(d) { return d.value; });
  labels.append('span').html(function(d) { return d.key; });

  var countries = topojson.feature(world, world.objects.countries).features;
  var countryById = {};

  names.forEach(function(d) {
    countryById[d.id] = d.name;
  });

  // Drawing layers.
  var water = svg.append('path');
  water.datum({ type: 'Sphere' }).classed('water', true).attr('d', path).call(drag);

  var lines = svg.append('path');
  lines.datum(graticule()).classed('graticule', true).attr('d', path).call(drag);

  var land = svg.selectAll('path.land').data(countries).enter().append('path').classed('land', true).attr('d', path).call(drag);
  land.on('click', clickAndZoom);

  // Points
  var points = svg.selectAll('path.point').data(languages).enter().append('path');
  points.attr('fill', function(d) {
    return colors[d['Degree of endangerment']];
  }).classed('point', true);

  points.datum(function(d) {
    return circle.center([+d.Longitude, +d.Latitude]).radius(0.4)();
  }).attr('d', function(d) {
    return path(circle.center([+d.Longitude, +d.Latitude]).radius(0.4)());
  });

  // Overlay
  var foreground = svg.append('path');
  foreground.datum({ type: 'Sphere' }).classed('foreground', true).attr('d', path).call(drag)

  svg.on('mouseover', function() {
    return spin.stop();
  }).on('mouseout', function() {
    if (active.node()) return;

    time = d3.now();
    rotate = projection.rotate();
    return spin.restart(constantSpin);
  });
}

var drag = d3.drag().subject(function() {
  var rotation = projection.rotate();
  return {x: rotation[0]/DRAG_FACTOR, y: -rotation[1]/DRAG_FACTOR};
}).on('drag', function() {
  if (active.node() === this) return;
  var lambda = d3.event.x*DRAG_FACTOR;
  var phi = -d3.event.y*DRAG_FACTOR;

  // Restriction for rotating upside-down
  // if (phi > 30) { phi = 30; }
  // else { phi = phi < -30 ? -30 : phi }

  projection.rotate([lambda, phi]);
  svg.selectAll('path').attr('d', path);
});

function clickAndZoom(d) {
  if (active.node() === this) return reset();
  active.classed('active', false);
  active = d3.select(this).classed('active', true);
  // Clicked on feature:
  var p = d3.geoCentroid(d);
  // Store the current rotation and scale:
  var currentRotate = projection.rotate();
  var currentScale = projection.scale();
  // Calculate the future bounding box after applying a rotation:
  projection.rotate([-p[0], -p[1]]);
  path.projection(projection);

  // calculate the scale and translate required:
  var b = path.bounds(d);
  var nextScale = SCALE*2;
  // var nextScale = currentScale * 1 / Math.max((b[1][0] - b[0][0]) / (WIDTH/2), (b[1][1] - b[0][1]) / (HEIGHT/2));
  var nextRotate = projection.rotate();

  // Update the map:
  svg.selectAll('path').transition().attrTween('d', function(d) {
    var r = d3.interpolate(currentRotate, nextRotate);
    var s = d3.interpolate(currentScale, nextScale);
    return function(t) {
      projection.rotate(r(t)).scale(s(t));
      path.projection(projection);
      return path(d) === null ? '' : path(d);
    }
  }).duration(1000);
}

function reset() {
active.classed('active', false);
active = d3.select(null);
svg.selectAll('path').transition().attrTween('d', function(d) {
  var s = d3.interpolate(projection.scale(), SCALE);
    return function(t) {
      projection.scale(s(t));
      path.projection(projection);
      return path(d) === null ? '' : path(d);
    }
 }).duration(1000);
}
