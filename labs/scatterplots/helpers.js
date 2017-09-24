var Helpers = {
  mouseover: function(d, i) {
    Helpers.displayData(d);
    d3.select(this)
      .transition()
      .duration(500)
      .attr('r', 15);
  },
  mouseout: function(d, i) {
    d3.select(this)
    .transition()
    .duration(500)
    .attr('r', 3);
  },
  displayData: function(data) {
    var description = document.getElementById('description');
    description.textContent = `${data.institution} was ranked ${data.world_rank} in the world in ${data.year}.`

    var table = document.getElementById('info-table');
    table.innerHTML = '';

    var headers = ['Category', 'Rank'];
    var header_row = document.createElement('tr');

    headers.forEach(function(header) {
      var th = document.createElement('th');
      th.textContent = header;
      header_row.appendChild(th);
    });

    table.appendChild(header_row);

    for (key in data) {
      if (key == 'world_rank' || key == 'institution') {
        continue;
      }

      var tr = document.createElement('tr');
      var category_td = document.createElement('td');
      category_td.textContent = key.split('_').join(' ');
      var rank_td = document.createElement('td');
      rank_td.textContent = data[key];
      tr.appendChild(category_td);
      tr.appendChild(rank_td);
      table.appendChild(tr);
    }
  },
  colorScore: function(criteria, criteria_max) {
    // var colorScore = function(x, x_max, y, y_max) {
    // var x_score = x/x_max;
    // var y_score = y/y_max;
    // var score = (x_score+y_score)/2;
    criteria /= criteria_max;
    // green = 0 to red = 1 -- use 1-score
    // red = 0 to green = 1 -- use score
    var hue = (criteria*120).toString(10);
    return `hsl(${hue},100%,61%)`;
  },
  // https://bost.ocks.org/mike/shuffle/
  shuffle: function(array) {
    var m = array.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);

      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
};
