d3.queue()
  .defer(d3.csv, 'data/van-gogh-works-colors.csv')
  .await(ready);

function swatches(data) {
  var width = document.getElementById('swatches').clientWidth;
  var square_size = document.getElementById('swatches').clientWidth/5;
  var height = data.length * square_size/2;

  var container = d3.select('#swatches');
  var svg = container.append('svg').attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.attr('width', width).attr('height', height)
  .attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMinYMin meet');

  var rows = svg.selectAll('g').data(data).enter().append('g').attr('transform', function(d, i) {
    return `translate(0,${i*square_size/1.5})`;
  });

  var titles = rows.selectAll('text').data(function(d) {
      return [d];
    }).enter().append('a').attr('xlink:href', function(d) {
      return `data/images/${d.image}`;
    }).attr('target', '_blank');

  titles.append('text')
    .attr('width', function(d) {
      return width;
    }).attr('y', function(d) {
      return 10;
    }).text(function(d) {
      return `${d.year}: ${d.title}`;
    }).on('mouseover', function(d) {
      d3.select(this).classed('hover', true);
    }).on('mouseout', function(d) {
      d3.select(this).classed('hover', false);
    });

  var colors = rows.selectAll('rect').data(function(d) {
    return dominantColors(d);
  }).enter().append('rect').attr('width', square_size).attr('height', square_size/3).attr('x', function(d, i) {
    return i * square_size;
  }).attr('y', function(d, i) {
    return 20;
  }).attr('fill', function(d) {
    return d;
  });
}

function ready(error, data) {
  swatches(data);
}

function dominantColors(d) {
  return [d.color_1, d.color_2, d.color_3, d.color_4, d.color_5];
}
