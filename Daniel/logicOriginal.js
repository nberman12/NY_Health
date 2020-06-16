
var chosenCounty = 'Bronx'

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Adds the svg canvas
var svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

function drawLine(input) {
	var x = d3.scaleTime()
		.domain(d3.extent(input, d=>d.date))
		.range([0, width]);
	svg.append("g")
		.attr("transform","translate(0," + height + ")")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

	var y = d3.scaleLinear()
		.domain([0, 75000])
		.range([height,0])
	svg.append("g")
		.call(d3.axisLeft(y));



	svg.append("path")
		.datum(input)
		.attr("fill", "#cce5df")
		.attr("stroke", "none")
		.attr("d", d3.area()
			.x(function(d) {return x(d.date)})
			.y0(function(d) {return y(d.meanIncome+d.MOE)})
			.y1(function(d) {return y(d.meanIncome-d.MOE)})
			)
	svg.append("path")
		.datum(input)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width",1.5)
		.attr("d", d3.line()
			.x(function(d) {return x(d.date)})
			.y(function(d) {return y(d.meanIncome)})
			)
}

d3.csv("compiledData.csv").then(function(data) {
    console.log(data);
    var parseTime = d3.timeParse("%Y");
    data.forEach(function(d) {
		d.date = parseTime(d.date);
		d.meanIncome = +d.meanIncome;
		d.MOE = +d.MOE;
    });
    //data = data.sort(function (a,b) {return d3.ascending(a.county,b.county);});
    
    data = data.filter(function(d) {
		return d['county'] == chosenCounty;
    })
    console.log(data)


    




    var dataNest = d3.nest()
        //.key(function(d) {return d.county; })
        .key(function(d) {return d.race; })
        .entries(data);
    console.log(dataNest)

    function color() {
     return Math.floor(Math.random()*16777215).toString(16); 
     }  // set the colour scale

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 
    	console.log(d);
    	console.log(i);
        svg.append("path")
            .attr("class", "line")
            .style("stroke", color())
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", drawLine(d.values));

        // Add the Legend
        svg.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")    // style the legend
            .style("fill", color() )
            .on("click", function(){
            	console.log('flag1')
                // Determine if current line is visible 
                var active   = d.active ? false : true,
                newOpacity = active ? 0 : 1;
                console.log(active, newOpacity)
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .style("opacity", newOpacity); 
                // Update whether or not the elements are active
                d.active = active;
                })  
            .text(d.key); 

    }); 

})

