function makeResponsive(){

// Creating map object
var myMap = L.map("map", {
    center: [43.1009, -75.85],
    zoom: 6.25,
    interactive: false

  });

  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  // Load in geojson data
  var geoData = "Static/data/nate.geojson";


  // Grab data with d3
  d3.json(geoData).then(function(data) {
  
    // Create a new choropleth layer
    var geojson = L.choropleth(data, {

      // Define what  property in the features to use
      valueProperty: "percentage",

      // Set color scale (in hex values)
      scale: ["#33FFF7", "#3D33FF"],

      // Number of breaks in step range
      steps: 10,

      // q for quantile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      // Binding a pop-up to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("County: " + feature.properties.name +
                        "<br>Obesity Rate:<br>" +
                        feature.properties.percentage +"%")
						.on("click", function(d) {runDaniel(feature.properties.name);
						runPeter(feature.properties.name);});
      }
    });

    // Add the choropleth layer to the map
    geojson.addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomleft" });

    // onAdd: "the map calls the onAdd() method of the layer, then the layer
    //        creates its HTML element(s) (commonly named ‘container’ element)
    //        and adds them to the map pane."
    // Ref: https://leafletjs.com/examples/extending/extending-2-layers.html
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];

      // Add min & max
      var legendInfo = "<h1>Obesity %: </h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

  });

  if (myMap.scrollWheelZoom) {
    myMap.scrollWheelZoom.disable();
  }

  $("#map").css("height", `${window.innerHeight}`)
  $("#map").css("width", `${window.innerWidth*0.1}`)
}

makeResponsive();

d3.select(window).on("resize",makeResponsive);
