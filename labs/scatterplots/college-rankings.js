var scatterplot = new Scatterplot();
scatterplot.load('rankings/college-rankings-all.csv', function(data) {
  var d = scatterplot.data(200, 2014, false);
  scatterplot.render(d, 'world_rank', 'quality_of_education', 'patents');
});
