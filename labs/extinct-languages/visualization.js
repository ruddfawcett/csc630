const width = 1000,
      height = 600,
      margin = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }

var mapPath = d3.geoPath().projection(d3.geoAlbersUsa());

// d3.json('us_states.json', function(error, state_data) {
//   d3.csv('election_1968.csv', function(error, election_data) {
//     var svg = d3.select('.container').append('svg')
//       .attr('width', width)
//       .attr('height', height)
//       .style('margin', '0 auto')
//       .style('display', 'block');
//
//     var states = svg.selectAll('path').data(state_data.features);
//
//     states.exit().remove();
//     states.enter().append('path').attr('d', mapPath).attr('fill', function(d, i) {
//       return max_votes_color(election_data[i]);
//     }).attr('true-fill', function(d, i) {
//       return max_votes_color(election_data[i]);
//     }).on('mouseover', function(d) {
//       d3.select(this).attr('fill', '#EEE');
//     }).on('mouseout', function(d) {
//       d3.select(this).attr('fill', d3.select(this).attr('true-fill'));
//     });
//   });
// });

var map = d3.geomap()
    .geofile('us_states.json');

d3.select('.container').append('svg')
    .call(map.draw, map);

function max_votes_color(data) {
  var nixon = +data.nixon_percent;
  var wallace = +data.wallace_percent;
  var humphrey = +data.humphrey_percent;

  if (nixon > wallace && nixon > humphrey) {
    return 'HSL(5, 83%, 60%)';
  }
  if (humphrey > nixon && humphrey > wallace) {
    return 'HSL(213, 64%, 51%)';
  }
  if (wallace > nixon && wallace > humphrey) {
    return 'HSL(50, 95%, 64%)';
  }
}
