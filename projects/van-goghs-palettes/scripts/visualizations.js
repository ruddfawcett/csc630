d3.queue()
  .defer(d3.csv, 'data/van-gogh-works-colors.csv')
  .await(ready);

function swatches(data) {
  var width = document.getElementById('swatches').clientWidth;
  var square_size = document.getElementById('swatches').clientWidth/5;
  var height = data.length * square_size/8;

  var container = d3.select('#swatches');
  var svg = container.append('svg').attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.attr('width', width).attr('height', height)
  .attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMinYMin meet');

  var tooltip = container.append('div').classed('tooltip hidden', true);

  var rows = svg.selectAll('g').data(data).enter().append('g').attr('transform', function(d, i) {
    return `translate(0,${i*square_size/3+80})`;
  }).on('mouseover', showTooltip).on('mouseout',  function(d) {
    d3.select(this).classed('focused', false);
    tooltip.classed('hidden', true);
  });

  var x = d3.scaleLinear().domain([1,5]).range([200, document.getElementById('swatches').clientWidth-200]);
  svg.append('g').attr('transform', `translate(0,60)`).attr('fill', 'black')
      .call(d3.axisTop(x).tickFormat(d3.format("d")));

  var colors = rows.selectAll('rect').data(function(d) {
    return dominantColors(d);
  }).enter().append('rect').attr('width', square_size).attr('height', square_size/3).attr('x', function(d, i) {
    return i * square_size;
  }).attr('y', function(d, i) {
    return 20;
  }).attr('fill', function(d) {
    return d;
  });

  var offsetL = document.getElementById('swatches').offsetLeft+10;
  var offsetT = document.getElementById('swatches').offsetTop+10;

  function showTooltip(d) {
    console.log(d)
    d3.select(this).classed('focused', true);
    label = `${d.year}: ${d.title}. ${d.location.length > 0 ? 'Located in ' + d.location + '.' : ''}`;
    var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
    tooltip.classed('hidden', false).attr('style', 'left:'+(mouse[0]+offsetL)+'px;top:'+(mouse[1]+offsetT)+'px').html(label);
  }
}

function ready(error, data) {
  swatches(data);
}

function dominantColors(d) {
  return [d.color_1, d.color_2, d.color_3, d.color_4, d.color_5];
}
