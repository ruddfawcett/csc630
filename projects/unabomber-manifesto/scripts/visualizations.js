const WIDTH = 20000,
  HEIGHT = 552,
  INITIAL_OFFSET = 800;

d3.queue(3)
  .defer(d3.csv, 'data/section_list.csv')
  .defer(d3.csv, 'data/paragraph_list.csv')
  .defer(d3.csv, 'data/word_list.csv')
  .await(ready);

function ready(error, section_list, paragraph_list, word_list) {

  var container = d3.select('#table');
  var svg = container.append('svg');
  svg.attr('width', WIDTH).attr('height', HEIGHT);

  var tooltip = container.append('div').classed('tooltip hidden', true);

  var sections = svg.selectAll('rect').data(section_list);
  sections.exit().remove();
  sections.enter().append('rect')
    .attr('width', function(d) { return (+d.index_right-+d.index_left)*.1; })
    .attr('height', HEIGHT)
    .attr('x', function(d, i) { return +d.index_left*.1+INITIAL_OFFSET; })
    .merge(sections)
    .attr('fill', function(d, i) { return i%2 == 0 ? '#FAFAFA' : '#F2F2F2'; })
    .on('mouseover', showTooltipSection)
    .on('mouseout',  function(d) {
      d3.select(this).classed('focused', false);
      tooltip.classed('hidden', true);
    });

  var paragraphs = svg.selectAll('line').data(paragraph_list);
  paragraphs.exit().remove();
  paragraphs.enter().append('line')
    .attr('x1', function(d, i) { return +d.index_left*.1+INITIAL_OFFSET; })
    .attr('x2', function(d, i) { return +d.index_left*.1+INITIAL_OFFSET; })
    .attr('y1', 0)
    .attr('y2', HEIGHT)
    .merge(paragraphs)
    .attr('stroke', '#EBEBEB')
    .on('mouseover', showTooltipParagraph)
    .on('mouseout',  function(d) {
      d3.select(this).classed('focused', false);
      tooltip.classed('hidden', true);
    });

  var words = svg.selectAll('circle').data(word_list);
  words.exit().remove();
  words.enter().append('circle')
    .attr('cx', function(d, i) { return (+d.index*.1)+INITIAL_OFFSET; })
    .attr('cy', function(d, i) { return ((HEIGHT-2)/50)*(+d.rank+1)-3.25; })
    .attr('r', 3)
    .attr('opacity', .4)
    .attr('fill', '#black')
    .merge(words)
    .on('mouseover', showTooltipWord)
    .on('mouseout',  function(d) {
      d3.select(this).classed('focused', false);
      tooltip.classed('hidden', true);
    });

    var y = d3.scaleLinear().domain([0, 49]).range([0, HEIGHT-10]);
    svg.append('g').attr('transform', `translate(${INITIAL_OFFSET-10},5)`).call(d3.axisLeft(y));

    svg.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 6)
          .attr('dy', '.75em')
          .attr('transform', `translate(${INITIAL_OFFSET-80},${HEIGHT/2})rotate(-90)`)
          .text('Frequency Rank (high to low).');


    var offsetL = document.getElementById('table').offsetLeft+10;
    var offsetT = document.getElementById('table').offsetTop+10;

    function showTooltipSection(d) {
      d3.select(this).classed('focused', true);
      label = `Section ${+d.number+1}, <span style='text-transform: lowercase;text-transform: capitalize'>&ldquo;${d.section}&rdquo;</span>`;
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
      tooltip.classed('hidden', false).attr('style', 'left:'+(mouse[0]+offsetL)+'px;top:'+(mouse[1]+offsetT)+'px').html(label);
    }

    function showTooltipParagraph(d) {
      d3.select(this).classed('focused', true);
      label = `Paragraph ${d.paragraph}`;
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
      tooltip.classed('hidden', false).attr('style', 'left:'+(mouse[0]+offsetL)+'px;top:'+(mouse[1]+offsetT)+'px').html(label);
    }

    function showTooltipWord(d) {
      d3.select(this).classed('focused', true);
      label = `&ldquo;${d.word}&rdquo; is the ${d.rank} most used non-stopword.`;
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
      tooltip.classed('hidden', false).attr('style', 'left:'+(mouse[0]+offsetL)+'px;top:'+(mouse[1]+offsetT)+'px').html(label);
    }
}
