

function runDaniel(chosenCounty) {
var svgArea = d3.select("#my_dataviz").select("svg");

if (!svgArea.empty()) {
	svgArea.remove();
}



// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 70},
    width = window.innerWidth*0.4 - margin.left - margin.right,
    height = window.innerHeight*0.4 - margin.top - margin.bottom;

// Adds the svg canvas
var svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

var drawLine=d3.line()
	.x(function(d) {return x(d.date); })
	.y(function(d) {return y(d.meanIncome); });

function drawLine2(input) {
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


	/*
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
			*/




var x = d3.scaleTime()
	.range([0, width]);
var y = d3.scaleLinear()
	.range([height,0])



d3.csv("Daniel/data/compiledData.csv").then(function(data) {
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

    x.domain(d3.extent(data, d=>d.date))
	y.domain([0, d3.max(data, d => d.meanIncome)])
    




    var dataNest = d3.nest()
        //.key(function(d) {return d.county; })
        .key(function(d) {return d.race; })
        .entries(data);
    console.log(dataNest)

    function color(index) {
    	var colorList =["#4287f5",
    					"#7ac971",
    					"#d4896e",
    					"#76dbd3",
    					"#95d96a",
    					"#d9ae6a",
    					"#68b0d4",
    					"#6d64cc",
    					"#070708",
    					"#d7d7db"]
     //return Math.floor(Math.random()*16777215).toString(16); 
     return colorList[index]
     }  // set the colour scale

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 
    	console.log(d);
    	console.log(i);
        svg.append("path")
            .attr("class", "line")
            .style("stroke", color(i))
            .style("stroke-width", '2px')
            .attr("fill", "None")
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", drawLine(d.values));
        console.log('flag1')
        svg.append("path")
	        .datum(d.values)
			.attr("fill", color(i))
			.attr("stroke", color(i))
			.attr("opacity", 0.25)
			//.attr("stroke-width", '10px')
			.attr("id", 'tag2'+d.key.replace(/\s+/g, ''))
			.attr("d", d3.area()
				.x(function(d) {return x(d.date)})
				.y0(function(d) {return y(d.meanIncome+d.MOE)})
				.y1(function(d) {return y(d.meanIncome-d.MOE)})
			)
		console.log('flag2')

		svg.append("text")
			.attr("x", (width/2))
			.attr("y", 0-(margin.top/2))
			.attr("text-anchor", "middle")
			.style("font-size","16px")
			.style("text-decoration", "underline")
			.text(`${chosenCounty} County Median Income by Race`)
        // Add the Legend
        svg.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")    // style the legend
            .style("fill", color(i) )
            .on("click", function(){
            	console.log('flag1')
                // Determine if current line is visible 
                var active   = d.active ? false : true,
                newOpacity = active ? 0 : 1,
                newOpacity2= active? 0 : 0.25;
                console.log(active, newOpacity)
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(1000) 
                    .style("opacity", newOpacity);
                d3.select("#tag2"+d.key.replace(/\s+/g, ''))
                    .transition().duration(1000) 
                    .style("opacity", newOpacity2);
                // Update whether or not the elements are active
                d.active = active;
                })  
            .text(d.key); 

    }); 

    svg.append("g")
    	.attr("class", "xAxis")
		.attr("transform","translate(0," + height + ")")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));
	svg.append("g")
		.attr("class", "yAxis")
		.call(d3.axisLeft(y));

});

}

runDaniel('New York')



d3.select(window).on("resize",function(d) {runDaniel('New York');runPeter('New York');consol.log(window.innerWidth,window.innerHeight);});