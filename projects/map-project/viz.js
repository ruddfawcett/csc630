const WIDTH = 500,
      HEIGHT = 400,
      DRAG_FACTOR = .15,
      SCALE = Math.max(WIDTH/Math.PI, HEIGHT/Math.PI);

var active = d3.select(null);

d3.queue(2)
    .defer(d3.json, 'data/world.min.json')
    .defer(d3.csv, 'data/endangered-languages.csv')
    .await(ready);

var projection = d3.geoOrthographic().scale(SCALE).rotate([0, 0]).translate([WIDTH/2, HEIGHT/2]).clipAngle(90).precision(.5);
var path = d3.geoPath().projection(projection);
var graticule = d3.geoGraticule().step([10, 10]);

var container = d3.select('.container');
var svg = container.append('svg');
svg.attr('width', WIDTH).attr('height', HEIGHT);

function ready(error, world, languages) {
  var lines = svg.append('path');
  lines.datum(graticule()).classed('graticule', true);
  lines.attr('d', path);

  var land = svg.append('path');
  land.datum(topojson.feature(world, world.objects.land)).classed('land', true);
  land.attr('d', path);

  var mesh = svg.append('path');
  mesh.datum(topojson.mesh(world, world.objects.countries)).classed('mesh', true);
  mesh.attr('d', path);

  var drag = d3.drag().subject(function() {
    var rotation = projection.rotate();
    return {x: rotation[0]/DRAG_FACTOR, y: -rotation[1]/DRAG_FACTOR};
  })
  .on('drag', function() {
    // if (active.node() === this) return;
    var lambda = d3.event.x*DRAG_FACTOR;
    var phi = -d3.event.y*DRAG_FACTOR;

    // Restriction for rotating upside-down
    if (phi > 30) { phi = 30; }
    else { phi = phi < -30 ? -30 : phi }

    projection.rotate([lambda, phi]);
    svg.selectAll('path').attr('d', path);
  });

  var sphere = svg.append('path');
  sphere.datum({ type: 'Sphere' }).classed('sphere', true);
  sphere.attr('d', path);
  sphere.call(drag);
}
