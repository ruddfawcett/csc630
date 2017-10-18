const WIDTH = 500,
  HEIGHT = 500,
  DRAG_FACTOR = .35,
  SCALE = HEIGHT / 2.1,
  SPIN_VELOCITY = [0.005, -.001];

var bounds = [document.getElementById('africa').clientWidth,
              document.getElementById('africa').clientHeight];

var refresh_bounds = function() {
  bounds[0] = document.getElementById('africa').clientWidth;
  bounds[1] = document.getElementById('africa').clientHeight;
  // maps update
}

var active = d3.select(null);

var sphere = {
  type: 'Sphere'
}

d3.queue(3)
  .defer(d3.json, '../shared/data/world.min.json')
  .defer(d3.csv, 'data/clean/endangered-languages-on-land.csv')
  .await(ready);

var rotate = [0, -30];

function ready(error, world, languages) {
  var countries = topojson.feature(world, world.objects.countries).features;

  var globe = draw_globe(countries, languages);

  return d3.queue()
    .defer(d3.json, '../shared/data/africa.min.json')
    .defer(d3.csv, 'data/clean/endangered-languages-africa.csv')
    .await(function(error, africa, languages) {
      var countries = topojson.feature(africa, africa.objects.continent_Africa_subunits).features;
      draw_africa(countries, languages);
    });
}

function draw_globe(countries, languages) {
  var projection = d3.geoOrthographic().scale(SCALE).rotate(rotate).translate([WIDTH/2, HEIGHT/2]).clipAngle(90).precision(.5);
  var path = d3.geoPath().projection(projection);

  var container = d3.select('#globe');
  var svg = container.append('svg');
  svg.attr('width', WIDTH).attr('height', HEIGHT);

  var time = d3.now();
  var constantSpin = function() {
    var dt = d3.now() - time;
    projection.rotate([rotate[0] + (SPIN_VELOCITY[0] * dt), rotate[1] + (SPIN_VELOCITY[1] * dt)]);
    svg.selectAll('path').attr('d', path);
  }
  var spin = d3.timer(constantSpin);
  var graticule = d3.geoGraticule().step([10, 10]);

  var drag = d3.drag().subject(function() {
    var rotation = projection.rotate();
    return {x: rotation[0]/DRAG_FACTOR, y: -rotation[1]/DRAG_FACTOR};
  }).on('drag', function() {
    if (active.node() === this) return;
    var lambda = d3.event.x*DRAG_FACTOR;
    var phi = -d3.event.y*DRAG_FACTOR;

    projection.rotate([lambda, phi]);
    svg.selectAll('path').attr('d', path);
  });

  var water = svg.append('path');
  water.datum(sphere).classed('water', true).attr('d', path).call(drag);;

  var lines = svg.append('path');
  lines.datum(graticule()).classed('graticule', true).attr('d', path).call(drag);;

  var land = svg.selectAll('path.land').data(countries).enter().append('path').classed('land', true).attr('d', path).call(drag);;

  var points = svg.selectAll('path.point').data(languages).enter().append('path').classed('point', true)
    .datum(function(d) {
      return {
        type: 'Point',
        coordinates: [+d.Longitude, +d.Latitude]
      }
    })
    .attr('d', path.pointRadius(1));

  svg.append('path').datum(sphere).classed('foreground pseudo', true).attr('d', path);
  svg.append('path').datum(sphere).classed('foreground actual', true).attr('d', path).call(drag);;

  svg.on('mouseover', function() {
    return spin.stop();
  }).on('mouseout', function() {
    if (active.node()) return;

    time = d3.now();
    rotate = projection.rotate();
    return spin.restart(constantSpin);
  });

  return svg;
}

function draw_africa(countries, languages) {
  var width = document.getElementById('africa').clientWidth;
  var height = document.getElementById('africa').clientWidth;
  var scale = height/1.5;
  var center = [16, 6.5];

  var projection = d3.geoChamberlinAfrica().precision(.5).scale(scale).center(center).translate([width/2, height/2]);
  var path = d3.geoPath().projection(projection);

  var container = d3.select('#africa');
  var svg = container.append('svg');
  svg.attr('width', bounds[0]).attr('height', bounds[1]);

  var graticule = d3.geoGraticule().step([10, 10]);

  var water = svg.append('path');
  water.datum(sphere).classed('water', true).attr('d', path);

  var lines = svg.append('path');
  lines.datum(graticule()).classed('graticule', true).attr('d', path);

  var tooltip = container.append('div').classed('tooltip hidden', true);

  var land = svg.selectAll('path.land').data(countries).enter().append('path').classed('land', true).attr('d', path);
  land.on('click', clickAndZoom).on('mouseover', showTooltip).on('mouseout',  function(d) {
    d3.select(this).classed('focused', false);
  });

  var offsetL = document.getElementById('africa').offsetLeft+10;
  var offsetT = document.getElementById('africa').offsetTop+10;

  function showTooltip(d) {
    d3.select(this).classed('focused', true);
    label = d.properties.geounit;
    var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
    tooltip.classed('hidden', false).attr('style', 'left:'+(mouse[0]+offsetL)+'px;top:'+(mouse[1]+offsetT)+'px').html(label);
  }

  function clickAndZoom(d) {
    if (active.node() === this) return reset();
    active.classed('active', false);
    active = d3.select(this).classed('active', true);

    var b = path.bounds(d);
    var nextScale = projection.scale() * 1 / Math.max((b[1][0] - b[0][0]) / (width/2), (b[1][1] - b[0][1]) / (height/2));
    var nextCenter = d3.geoCentroid(d);

    svg.selectAll('path').transition().attrTween('d', function(d) {
      var s = d3.interpolate(projection.scale(), nextScale);
      var c = d3.interpolate(projection.center(), nextCenter);
      return function(t) {
        projection.scale(s(t)).center(c(t));
        path.projection(projection);
        return path(d) === null ? '' : path(d);
      }
    }).duration(1000);
  }

  function reset() {
    active.classed('active', false);
    active = d3.select(null);
    svg.selectAll('path').transition().attrTween('d', function(d) {
      var s = d3.interpolate(projection.scale(), scale);
      var c = d3.interpolate(projection.center(), center);
        return function(t) {
          projection.scale(s(t)).center(c(t));
          path.projection(projection);
          return path(d) === null ? '' : path(d);
        }
     }).duration(1000);
  }

  var points = svg.selectAll('path.point').data(languages).enter().append('path').classed('point', true)
    .datum(function(d) {
      return {
        type: 'Point',
        coordinates: [+d.Longitude, +d.Latitude],
        speakers: +d['Number of speakers']
      }
    }).attr('d', path.pointRadius(function(d) {
      // return 1;
      // speakers = d['speakers'] == 0 ? 100 : d['speakers'];
      // return (100/speakers);
      return 5;
    }));

  return svg;
}

window.onresize = refresh_bounds;
