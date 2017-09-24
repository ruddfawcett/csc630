const POINT_RATIO = 0.005;
class Scatterplot {
  constructor() {
    var self = this;
    d3.select(window).on('resize', function() {
      // Less expensive then resizing continuously (all be it a bit jagged -- todo: add transitions)
      clearTimeout(window.didResize);
      window.didResize = setTimeout(function() {
        self.resize();
      }, 250);
    });
  }

  load(data_path, callback) {
    var self = this;
    d3.csv(data_path, function(error, csv_data) {
      if (error) {
        console.error(error);
      }

      self.data_store = csv_data;
      callback(csv_data);
    });
  }

  render(data, key_x, key_y, key_z) {
    this.working_data = data, this.key_x = key_x, this.key_y = key_y, this.key_z = key_z;
    var self = this;

    var key_z_max = 0;
    data.forEach(function(row) {
      if (+row[key_z] > key_z_max) {
        key_z_max = row[key_z];
      }
    });

    this.x_range = d3.extent(data, function(d) { return +d[key_x]; });
    this.y_range = d3.extent(data, function(d) { return +d[key_y]; });

    this.x = d3.scaleLinear().domain(this.x_range);
    this.y = d3.scaleLinear().domain(this.y_range);

    this.svg = d3.select('#result').append('svg');
    this.resize();

    var points = this.svg.selectAll('circle')
      .data(data);

    points.exit().remove();

    points.enter().append('circle')
      .merge(points)
      .attr('r', this.bounds.width*POINT_RATIO)
      .attr('cx', function(d) { return self.x(+d[key_x]); })
      .attr('cy', function(d) { return self.y(+d[key_y]); })
      .attr('fill', function(d) { return Helpers.colorScore(+d[key_z], key_z_max); })
      .on('mouseover', Helpers.mouseover)
      .on('mouseout', Helpers.mouseout);
  }

  resize() {
    var self = this;

    this.x.range([0, this.bounds.width]);
    this.y.range([this.bounds.height, 0]);

    this.svg.attr('width', this.bounds.width)
      .attr('height', this.bounds.height);

    var points = this.svg.selectAll('circle')
      .transition()
      .attr('r', this.bounds.width*POINT_RATIO)
      .attr('cx', function(d) { return self.x(+d[self.key_x]); })
      .attr('cy', function(d) { return self.y(+d[self.key_y]); });
  }

  get bounds() {
    var result_div = document.getElementById('result');
    return {
      width: result_div.clientWidth,
      height: result_div.clientHeight
    }
  }

  data(count, year, random) {
    var working_data = [];
    this.data_store.forEach(function(row) {
      if (+row.year == year) {
        if (!random) {
          if (working_data.length < count) {
            working_data.push(row);
          }
          else {
            return false;
          }
        }
        else {
          working_data.push(row);
        }
      }
    });

    if (random) {
      Helpers.shuffle(working_data);
      working_data.splice(count);
    }

    return working_data;
  }
}
