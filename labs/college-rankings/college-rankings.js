var scatterplot = new Scatterplot();
var count = 200, year = 2014, random = false;
var key_x = 'world_rank', key_y = 'influence', key_z = 'quality_of_faculty';

scatterplot.load('rankings/college-rankings-all.csv', function(data) {
  var d = scatterplot.data(count, year, random);
  Helpers.addKeys(Object.keys(d[0]));

  scatterplot.render(d, key_x, key_y, key_z);
});

document.getElementById('graph_data').addEventListener('click', function() {
  count = document.getElementById('count').value;
  year = document.getElementById('year').value;
  random = document.getElementById('random_data').value === 'yes' ? true : false;
  key_x = document.getElementById('key_x').value;
  key_y = document.getElementById('key_y').value;
  key_z = document.getElementById('key_z').value;

  var key_z_span = document.getElementById('key_z_span');
  key_z_span.textContent = key_z;

  var data = scatterplot.data(count, year, random);

  scatterplot.render(data, key_x, key_y, key_z);
});
