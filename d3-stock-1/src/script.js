/* global d3, _ */

(function() {
  var margin = {top: 30, right: 20, bottom: 100, left: 50},
    margin2  = {top: 210, right: 20, bottom: 20, left: 50},
    width    = 764 - margin.left - margin.right,
    height   = 283 - margin.top - margin.bottom,
    height2  = 283 - margin2.top - margin2.bottom;

  var parseDate = d3.time.format('%d/%m/%Y').parse,
    bisectDate = d3.bisector(function(d) { return (new Date(d.date*1000)); }).left,
    legendFormat = d3.time.format('%b %d, %Y');

  var x = d3.time.scale().range([0, width]),
    x2  = d3.time.scale().range([0, width]),
    y   = d3.scale.linear().range([height, 0]),
    y1  = d3.scale.linear().range([height, 0]),
    y2  = d3.scale.linear().range([height2, 0]),
    y3  = d3.scale.linear().range([60, 0]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom'),
    xAxis2  = d3.svg.axis().scale(x2).orient('bottom'),
    yAxis   = d3.svg.axis().scale(y).orient('left');

  var priceLine = d3.svg.line()
    .interpolate('linear')
    .x(function(d) { return x(new Date(d.date*1000)); })
    .y(function(d) { return y(d.price); });

  // var avgLine = d3.svg.line()
  //   .interpolate('linear')
  //   .x(function(d) { return x(new Date(d.date*1000)); })
  //   .y(function(d) { return y(d.average); });

  var area2 = d3.svg.area()
    .interpolate('linear')
    .x(function(d) { return x2(new Date(d.date*1000)); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

  var svg = d3.select('body').append('svg')
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + 60);

  var svg1 = d3.select('body').append('p');
    // .attr('class', 'chart1')
    // .attr('width', width + margin.left + margin.right)
    // .attr('height', height + margin.top + margin.bottom + 60);

  // svg1.append('defs').append('clipPath')
  //   .attr('id', 'clip')
  // .append('rect')
  //   .attr('width', width)
  //   .attr('height', height);
  // svg1.append('circle').attr('cy', 25).attr('r', 25);

  svg.append('defs').append('clipPath')
    .attr('id', 'clip')
  .append('rect')
    .attr('width', width)
    .attr('height', height);

  var make_y_axis = function () {
    return d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(3);
  };
  // The first chart
  var focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // The second chart
  var barsGroup = svg.append('g')
    .attr('class', 'volume')
    .attr('clip-path', 'url(#clip)')
    .attr('transform', 'translate(' + margin.left + ',' + (margin.top + 60 + 20) + ')');

  // The thrid selecting chart
  var context = svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + (margin2.top + 60) + ')');

  // legend above all the charts
  var legend = svg.append('g')
    .attr('class', 'chart__legend')
    .attr('width', width)
    .attr('height', 30)
    .attr('transform', 'translate(' + margin2.left + ', 10)');
  
  // attach text to legend
  legend.append('text')
    .attr('class', 'chart__symbol')
    .text('NASDAQ: StarBucks')

  // interaction part, select time period.
  var rangeSelection =  legend
    .append('g')
    .attr('class', 'chart__range-selection')
    .attr('transform', 'translate(110, 0)');

  // read data from file.
  d3.csv('./data/sbux.csv',function(err, data) {
    
    // var x = d3.time.scale().range([0, width]),
    // x2  = d3.time.scale().range([0, width]),
    // y   = d3.scale.linear().range([height, 0]),
    // y1  = d3.scale.linear().range([height, 0]),
    // y2  = d3.scale.linear().range([height2, 0]),
    // y3  = d3.scale.linear().range([60, 0]);
    // console.log(data[0]);
    var brush = d3.svg.brush()
      .x(x2)
      .on('brush', brushed);

  for(var i =0; i < data.length; i ++)
  {
    data[i].date = parseInt(data[i].date);
  };

    // console.log("after brush");
    // min and max value.
    // console.log(d.Date);
    // (new Date(d.date*1000))
    var xRange = d3.extent(data.map(function(d) {  return new Date(d.date*1000); }));
    console.log("xRange is:", xRange);
    x.domain(xRange);
    // console.log("x.domain");
    console.log(d3.extent(data.map(function(d) { return d.price; }))[0]);
    y.domain([d3.extent(data.map(function(d) { return d.price; }))[0] - 1, d3.extent(data.map(function(d) { return d.price; }))[1]]);
    y3.domain(d3.extent(data.map(function(d) { return d.price; })));
    // console.log("after y3");
    x2.domain(x.domain());
    y2.domain(y.domain());

    var min = d3.min(data.map(function(d) { return d.price; }));
    var max = d3.max(data.map(function(d) { return d.price; }));
    // console.log(min1);
    // console.log(max1);

    var range = legend.append('text')
      .text(legendFormat(new Date(xRange[0])) + ' - ' + legendFormat(new Date(xRange[1])))
      .style('text-anchor', 'end')
      .attr('transform', 'translate(' + width + ', 0)');

    // appending yAxis to the first chart.
    focus.append('g')
        .attr('class', 'y chart__grid')
        .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat(''));

    // var avgLine = d3.svg.line()
    // .interpolate('monotone')
    // .x(function(d) { return x(d.date); })
    // .y(function(d) { return y(d.average); });

    // var averageChart = focus.append('path')
    //     .datum(data)
    //     .attr('class', 'chart__line chart__average--focus line');
        // .attr('d', avgLine);

    // var priceLine = d3.svg.line()
    // .interpolate('monotone')
    // .x(function(d) { return x(d.date); })
    // .y(function(d) { return y(d.price); });

    var priceChart = focus.append('path')
        .datum(data)
        .attr('class', 'chart__line chart__price--focus line')
        .attr('d', priceLine);

    // var xAxis = d3.svg.axis().scale(x).orient('bottom'),
    // xAxis2  = d3.svg.axis().scale(x2).orient('bottom'),
    // yAxis   = d3.svg.axis().scale(y).orient('left');

    focus.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0 ,' + height + ')')
        .call(xAxis);

    focus.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(12, 0)')
        .call(yAxis);

    var focusGraph = barsGroup.selectAll('rect')
        .data(data)
      .enter().append('rect')
        .attr('class', 'chart__bars')
        .attr('x', function(d, i) { return x(new Date(d.date*1000)); })
        .attr('y', function(d) { return 155 - y3(d.price); })
        .attr('width', 1)
        .attr('height', function(d) { return y3(d.price); });

    var helper = focus.append('g')
      .attr('class', 'chart__helper')
      .style('text-anchor', 'end')
      .attr('transform', 'translate(' + width + ', 0)');

    var helperText = helper.append('text')

    var priceTooltip = focus.append('g')
      .attr('class', 'chart__tooltip--price')
      .append('circle')
      .style('display', 'none')
      .attr('r', 2.5);

    var averageTooltip = focus.append('g')
      .attr('class', 'chart__tooltip--average')
      .append('circle')
      .style('display', 'none')
      .attr('r', 2.5);

    var mouseArea = svg.append('g')
      .attr('class', 'chart__mouse')
      .append('rect')
      .attr('class', 'chart__overlay')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .on('mouseover', function() {
        helper.style('display', null);
        priceTooltip.style('display', null);
        averageTooltip.style('display', null);
      })
      .on('mouseout', function() {
        helper.style('display', 'none');
        priceTooltip.style('display', 'none');
        averageTooltip.style('display', 'none');
      })
      .on('mousemove', mousemove);

    context.append('path')
        .datum(data)
        .attr('class', 'chart__area area')
        .attr('d', area2);

    context.append('g')
        .attr('class', 'x axis chart__axis--context')
        .attr('y', 0)
        .attr('transform', 'translate(0,' + (height2 - 22) + ')')
        .call(xAxis2);

    context.append('g')
        .attr('class', 'x brush')
        .call(brush)
      .selectAll('rect')
        .attr('y', -6)
        .attr('height', height2 + 7);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]);
      var i = bisectDate(data, x0, 1);
      console.log("coming to mousemove");
      var d0 = data[i - 1];
      var d1 = data[i];
      // console.log("i:", i, "d0:", d0, "d1:", d1);
      var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      helperText.text(legendFormat(new Date(d.date*1000)) + ' - Price: ' + d.price + ' Avg: ' + d.average);
      priceTooltip.attr('transform', 'translate(' + x(new Date(d.date*1000)) + ',' + y(d.price) + ')');
      // averageTooltip.attr('transform', 'translate(' + x(new Date(d.date*1000)) + ',' + y(d.average) + ')');
    }

    function brushed() {
      var ext = brush.extent();
      console.log("inside brushed:", ext[0]);
      // console.log("d.date:", (new Date(d.date*1000)), "ext[0]", ext[0] );
      console.log(max);
      if (!brush.empty()) {
        console.log("x.domain", brush.empty() ? x2.domain() : brush.extent());
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        // x.domain(brush.empty() ? x2.domain() : brush.extent());
        console.log("x.domain", brush.empty() ? x2.domain() : brush.extent());
        y.domain([
          d3.min(data.map(function(d) { return ((new Date(d.date*1000)) >= ext[0] && (new Date(d.date*1000)) <= ext[1]) ? d.price : max; })) - 0.1,
          d3.max(data.map(function(d) { return ((new Date(d.date*1000)) >= ext[0] && (new Date(d.date*1000)) <= ext[1]) ? d.price : min; }))
        ]);
        // console.log("min1:", min1, "max1:", max1);

        range.text(legendFormat(ext[0]) + ' - ' + legendFormat(ext[1]));
        focusGraph.attr('x', function(d, i) { return x(new Date(d.date*1000)); });

        // var days = Math.ceil((ext[1] - ext[0]) / (24 * 3600 * 1000))
        // focusGraph.attr('width', (40 > days) ? (40 - days) * 5 / 6 : 5)
      }

      priceChart.attr('d', priceLine);

      console.log("after*******");
      // averageChart.attr('d', avgLine);
      focus.select('.x.axis').call(xAxis);
      focus.select('.y.axis').call(yAxis);
    }

    var dateRange = ['1d', '1w', '1m', '3m', '6m', '1y', '5y']
    for (var i = 0, l = dateRange.length; i < l; i ++) {
      var v = dateRange[i];
      rangeSelection
        .append('text')
        .attr('class', 'chart__range-selection')
        .text(v)
        .attr('transform', 'translate(' + (20 * i) + ', 0)')
        .on('click', function(d) { focusOnRange(this.textContent); });
    }

    function focusOnRange(range) {
      var today = new Date(data[data.length - 1].date*1000)
      var ext = new Date(data[data.length - 1].date*1000)
      console.log("today:", today, "ext:", ext);
      if (range === '1d')
        ext.setDate(ext.getDate() - 1)

      if (range === '1m')
        ext.setMonth(ext.getMonth() - 1)

      if (range === '1w')
        ext.setDate(ext.getDate() - 7)

      if (range === '3m')
        ext.setMonth(ext.getMonth() - 3)

      if (range === '6m')
        ext.setMonth(ext.getMonth() - 6)

      if (range === '1y')
        ext.setFullYear(ext.getFullYear() - 1)

      if (range === '5y')
        ext.setFullYear(ext.getFullYear() - 5)

      brush.extent([ext, today])
      brushed()
      context.select('g.x.brush').call(brush.extent([ext, today]))
    }

  })// end Data
  // d3.csv('./data/aapl.csv', type, function(err, data) {
  //   console.log(data);

  //   var brush = d3.svg.brush()
  //   .x(x2)
  //   .on('brush', brushed);
  // })
  function type(d) {
    return {
      date    : parseDate(d.Date),
      price   : +d.Close,
      average : +d.Average,
      volume : +d.Volume,
    }
  }
}());