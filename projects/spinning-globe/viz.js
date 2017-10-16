const WIDTH = 530,
      HEIGHT = 530,
      DRAG_FACTOR = .10,
      SCALE = HEIGHT/2,
      SPIN_VELOCITY = [-0.015, 0];

var active = d3.select(null);

var andover_coordinates = [-71.1323190, 42.6471420];

d3.queue(3)
    .defer(d3.json, '../shared/data/world.min.json')
    .defer(d3.tsv, '../shared/data/world-country-names.tsv')
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

function ready(error, world, names) {
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
