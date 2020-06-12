var myMap = L.map("map", {
	center: [40.7128, -74.0059],
	zoom: 11
})

L.tileLayer(MAP_URL, {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: API_KEY
}).addTo(myMap);

var link = "myfile.geojson";
var link2 = "us-county-boundaries.geojson";

function chooseColor() {
	var number = Math.floor(Math.random()*16777215).toString(16);

	return ("#" + number)
}

d3.json(link2, function(data) {
	L.geoJson(data, {
		style: function(feature) {
			return {
				color: "white",
				fillColor: chooseColor(),
				fillOpacity: 0.5,
				weight: 1.5
			};
		},

		onEachFeature: function(feature, layer) {

			layer.on({
			mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");

    }
  }).addTo(myMap);
});
console.log('test flag')

