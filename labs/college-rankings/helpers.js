var Helpers = {
  addKeys: function(keys) {
    console.log(keys);

    var key_x_select = document.getElementById('key_x')
    var key_y_select = document.getElementById('key_y')
    var key_z_select = document.getElementById('key_z')

    keys.forEach(function(key) {
      var option = document.createElement('option');
      option.value = key;
      option.innerHTML = key.split('_').join(' ');
      if (key == 'world_rank') {
        option.selected = true;
      }

      key_x_select.appendChild(option);

      var option_y = option.cloneNode()
      if (key == 'influence') {
        option_y.selected = true;
      }

      option_y.innerHTML = key.split('_').join(' ');
      key_y_select.appendChild(option_y);

      var option_z = option.cloneNode()
      if (key == 'quality_of_faculty') {
        option_z.selected = true;
      }

      option_z.innerHTML = key.split('_').join(' ');
      key_z_select.appendChild(option_z);
    });
  },
  displayData: function(data) {
    var description = document.getElementById('description');
    description.innerHTML = `In ${data.year}, ${data.institution} was ranked <b>${data.world_rank} in the world</b> and <b>${data.national_rank} in ${data.country}</b>.`

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
      if (key == 'world_rank' || key == 'institution' || key == 'year' || key == 'country' || key == 'national_rank') {
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

      var info_pane = document.getElementById('info_pane');
      info_pane.scrollTop = info_pane.scrollHeight;
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
