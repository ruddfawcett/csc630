const POINT_RATIO = 0.005;
const margin = {
  top: 20,
  bottom: 60,
  left: 60,
  right: 20
};
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
    if (this.svg != 'undefined') {
      document.getElementById('result').innerHTML = '';
    }

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

    this.x = d3.scaleLinear().domain(this.x_range).nice();
    this.y = d3.scaleLinear().domain(this.y_range).nice();

    this.svg = d3.select('#result').append('svg');
    this.wrapper = this.svg.append('g');

    this.x_axis = this.wrapper.append('g');
    this.y_axis = this.wrapper.append('g');

    this.graph = this.wrapper.append('g');

    this.x_label = this.svg.append('text').text(key_x.split('_').join(' '));
    this.y_label = this.svg.append('text').text(key_y.split('_').join(' '));

    this.resize();

    var points = this.graph.selectAll('circle')
      .data(data);

    points.exit().remove();

    points.enter().append('circle')
      .merge(points)
      .attr('r', this.bounds.width*POINT_RATIO)
      .attr('cx', function(d) { return self.x(+d[key_x]); })
      .attr('cy', function(d) { return self.y(+d[key_y]); })
      .attr('fill', function(d) { return Helpers.colorScore(+d[key_z], key_z_max); })
      .on('mouseover', this.mouseover)
      .on('mouseout', this.mouseout);
  }

  resize() {
    var self = this;
    var width = this.bounds.width, height = this.bounds.height;
    var margin_left = margin.left;
    if (width < 600) {
      margin_left = margin.left/1.5;
    }

    this.x.range([0, width-(margin_left + margin.right)]);
    this.y.range([height-(margin.top+margin.bottom), 0]);

    this.svg.attr('width', width)
      .attr('height', height);

    this.wrapper.attr('width', width - (margin_left+margin.right))
      .attr('height', height - (margin.top + margin.bottom))
      .attr('transform', `translate(${margin_left}, ${margin.top})`);

    this.graph.attr('transform', `translate(${margin_left/4}, 0)`)
      .attr('width', this.wrapper.attr('width')-(margin_left/4))

    this.x_axis.attr('transform', `translate(0,${height-(margin.bottom*1.2)})`)
      .transition()
      .call(d3.axisBottom(self.x));

    this.y_axis.attr('transform', 'translate(0, 0)')
      .transition()
      .call(d3.axisLeft(self.y));

    this.x_label
      .attr('text-anchor', 'end')
      .attr('transform', `translate(${width / 2},${height})`);

    this.y_label
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(0, ${height / 2})rotate(-90)`);

    var points = this.wrapper.selectAll('circle')
      .transition()
      .attr('r', width*POINT_RATIO)
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

  mouseover(d) {
    d3.select(this).transition()
      .duration(500)
      .attr('r-old', d3.select(this).attr('r'))
      .attr('r', 30);

    Helpers.displayData(d);
  }

  mouseout(d) {
    d3.select(this).transition()
    .duration(500)
    .attr('r', d3.select(this).attr('r-old'))
  }
}
