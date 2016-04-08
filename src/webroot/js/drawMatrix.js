var width = 5000,
    height = 5000,
    div = d3.select('#chart'),
    svg = div.append('svg')
        .attr('width', width)
        .attr('height', height),
    rw = 10,
    rh = 10;

var data = [];
for (var k = 0; k < 100; k += 1) {
    data.push(d3.range(100));
}

// Create a group for each row in the data matrix and
// translate the group vertically
var grp = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
        return 'translate(0, ' + 15 * i + ')';
    });

// For each group, create a set of rectangles and bind 
// them to the inner array (the inner array is already
// binded to the group)
grp.selectAll('rect')
    .data(function(d) { return d; })
    .enter()
    .append('rect')
        .attr('x', function(d, i) { return 15 * i; })
        .attr('width', rw)
        .attr('height', rh);

