const width = 1000,
      height = 800,
      margin = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      sensitivity = 0.25,
      scale = Math.max(width/Math.PI, height/Math.PI);

var active = d3.select(null);

var andover_coordinates = [42.6471420, -71.1323190];

var projection = d3.geoOrthographic()
  .scale(scale)
  .rotate([0, 0])
  .translate([width / 2, height / 2])
  .clipAngle(90);

var mapPath = d3.geoPath().projection(projection);

d3.json('https://unpkg.com/world-atlas@1/world/110m.json', function(error, world_data) {
  d3.csv('data/endangered-languages.csv', function(error, language_data) {
    var svg = d3.select('.container').append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('margin', '0 auto')
      .style('display', 'block');

    var container = svg.append('g');

    var ocean = container.append('circle')
      .attr('r', scale)
      .attr('cx', width/2)
      .attr('cy', height/2)
      .attr('fill', '#65BDE8')
      .attr('stroke-color', 'black')
      .attr('stroke-width', 3);

    var world = container.append('g');

    var drag = d3.drag().subject(function() {
      var r = projection.rotate();
      return {x: r[0] / sensitivity, y: -r[1] / sensitivity};
    })
    .on('drag', function() {
      if (active.node() === this) return;

      var lambda = d3.event.x * sensitivity,
      phi = -d3.event.y * sensitivity;

      // Restriction for rotating upside-down
      if (phi > 30) { phi = 30; }
      else { phi = phi < -30 ? -30 : phi }

      projection.rotate([lambda, phi]);
      world.selectAll('path').attr('d', mapPath);
    });


    var countries = topojson.feature(world_data, world_data.objects.countries).features,
    neighbors = topojson.neighbors(world_data.objects.countries.geometries);
    var color =  d3.scaleOrdinal(d3.schemePastel1);

    country_paths = world.selectAll('path.country').data(countries);
    country_paths.exit().remove();
    country_paths.enter().append('path')
      .attr('d', mapPath)
      .attr('fill', function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); })
      .attr('stroke-width', 0.3)
      .attr('stroke', '#819680')
      .on('click', click)
      .attr('class', 'country')
      .call(drag);

    function click(d) {
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
      mapPath.projection(projection);

      // calculate the scale and translate required:
      var b = mapPath.bounds(d);
      var nextScale = currentScale * 1 / Math.max((b[1][0] - b[0][0]) / (width/2), (b[1][1] - b[0][1]) / (height/2));
      var nextRotate = projection.rotate();

      // Update the map:
      d3.selectAll('path.country').transition().attrTween('d', function(d) {
        var r = d3.interpolate(currentRotate, nextRotate);
        var s = d3.interpolate(currentScale, nextScale);
        ocean.transition().attr('r', nextScale).duration(1000);
        return function(t) {
          projection.rotate(r(t)).scale(s(t));
          mapPath.projection(projection);
          return mapPath(d);
        }
       }).duration(1000);
    }

    function reset() {
      active.classed('active', false);
      active = d3.select(null);

      d3.selectAll('path.country').transition().attrTween('d', function(d) {
        var s = d3.interpolate(projection.scale(), scale);
        ocean.transition().attr('r', scale).duration(1000);
          return function(t) {
            projection.scale(s(t));
            mapPath.projection(projection);
            return mapPath(d);
          }
       }).duration(1000);
    }

    var points = world.selectAll('path.point')
      .data(language_data);

    points.exit().remove();
    points.enter().append('path')
      .attr('fill', function(d) { return 'black' })
      .datum(function(d) {
         return {type: 'Point', coordinates: [+d.Longitude, +d.Latitude]};
      })
      .attr('d', mapPath.pointRadius(function(d) { return 1; }))
      .style('opacity', 1)
      .attr('class', 'point');
  });
});
