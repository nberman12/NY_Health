function runPeter(chosenCounty) {
	var svgArea = d3.select("#scatter").select("svg");

if (!svgArea.empty()) {
	svgArea.remove();
}





var svgWidth = window.innerWidth*0.5;
var svgHeight = window.innerHeight*0.75;

var margin = {
	top: window.innerHeight*0.1,
	right: window.innerHeight*0.2,
	bottom: window.innerHeight*0.2,
	left: window.innerHeight*0.2
};

var graph_width = svgWidth - margin.left - margin.right;
var graph_height = svgHeight - margin.top - margin.bottom;

  var width = 450
      height = 450
      margin = 40

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin

  // append the svg object to the div called 'my_dataviz'
  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  svg.append("text")
			.attr("x", (width/2))
			.attr("y", -150)
			.attr("text-anchor", "middle")
			.style("font-size","16px")
			.style("text-decoration", "underline")
			.text(`${chosenCounty} County Population`)
			.style("font-weight", "bold")

  // create 2 data_set
  //var data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}

  const file = "Static/data/Peter_Data/pop_2018_df.json";


  d3.json(file).then(function(data) {

    data.forEach(function(num){
		num.white_population = +num.white_population;
		num.african_american_pop = +num.african_american_pop;
		num.american_indian_alaska_native_pop	= +num.american_indian_alaska_native_pop;
		num.asian_pop = +num.asian_pop;
		num.Other = +num.Other;
		num.Total_Population	= +num.Total_Population;
  });

    var selected_data = data.filter(x => x.County === chosenCounty);
    var selected_data = selected_data[0]
    var white = selected_data.white_population;
    var black = selected_data.african_american_pop;
    var american_indian = selected_data.american_indian_alaska_native_pop;
    var asian = selected_data.asian_pop;
    var other = selected_data.Other;

    var data1 = {White: white, African_American: black, American_Indian:american_indian, Asian: asian, Other: other}

    console.log(data1)


  // set the color scale
  var color = d3.scaleOrdinal()
    .domain(["African_American", "American_Indian",   "Asian",    "Other",   "White"])
    .range([          "#95d96a",         "#6d64cc", "#d4896e",  "#070708", "#4287f5"]);

  // A function that create / update the plot for a given variable:
  function update(data) {

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.value; })
	  .sort(null);

    var data_ready = pie(d3.entries(data))

    // map to data
    var u = svg.selectAll("path")
      .data(data_ready)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u
      .enter()
      .append('path')
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)

    // remove the group that is not present anymore
    u
      .exit()
      .remove()

  }

  svg.append("circle").attr("cx",200).attr("cy",0).attr("r", 6).style("fill", "#95d96a")
  svg.append("text").attr("x", 220).attr("y", 0).text("Black").style("font-size", "15px").attr("alignment-baseline","middle")

  svg.append("circle").attr("cx",200).attr("cy",20).attr("r", 6).style("fill", "#6d64cc")
  svg.append("text").attr("x", 220).attr("y", 20).text("Native American").style("font-size", "15px").attr("alignment-baseline","middle")

  svg.append("circle").attr("cx",200).attr("cy",40).attr("r", 6).style("fill", "#d4896e")
  svg.append("text").attr("x", 220).attr("y", 40).text("Asian").style("font-size", "15px").attr("alignment-baseline","middle")

  svg.append("circle").attr("cx",200).attr("cy",60).attr("r", 6).style("fill", "#070708")
  svg.append("text").attr("x", 220).attr("y", 60).text("Other").style("font-size", "15px").attr("alignment-baseline","middle")

  svg.append("circle").attr("cx",200).attr("cy",80).attr("r", 6).style("fill", "#4287f5")
  svg.append("text").attr("x", 220).attr("y", 80).text("White").style("font-size", "15px").attr("alignment-baseline","middle")

  // Initialize the plot with the first dataset
  update(data1)
})

}
runPeter("New York")
d3.select(window).on("resize", runPeter("New York"));
