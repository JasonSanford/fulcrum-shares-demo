(function () {
   var popup_properties = ['capacity', 'note'];
   var config = {
    share_id: '557211a6ab5729ea',  // Edit this
    popup_properties: ['capacity', 'note']  // Optional - An array of properties to show in a Leaflet popup
   };

  var road_layer = new L.TileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    maxZoom: 18,
    subdomains: ['1', '2', '3', '4'],
    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
  });
  var satellite_layer = new L.TileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
    maxZoom: 18,
    subdomains: ['1', '2', '3', '4'],
    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>.'
  });
  var geojson_layer = new L.GeoJSON(null, {
    onEachFeature: function (feature, layer) {
      if (config.popup_properties) {
        var props = feature.properties;
        var infos = [];
        for (var i=0, len=popup_properties.length; i<len; i++) {
          var prop = popup_properties[i];
          if (prop in props) {
            infos.push('<strong>' + prop + '</strong>: ' + props[prop]);
          }
        }
        layer.bindPopup(infos.join('<br>'));
      }
    }
  });

  var map_options = {
    center: [0, 0],
    zoom: 5,
    layers: [road_layer, geojson_layer]
  };
  var map = new L.Map('map-container', map_options);

  var base_layers = {
    'Road': road_layer,
    'Satellite': satellite_layer
  };
  var overlay_layers = {
    'Fulcrum Data': geojson_layer
  };
  L.control.layers(base_layers, overlay_layers).addTo(map);


  loadData = function (data) {
    geojson_layer.addData(data);
    setTimeout(function () {
      map.fitBounds(geojson_layer.getBounds());
    }, 200);
  };

  var url = '//web.fulcrumapp.com/shares/' + config.share_id + '.geojson';

  $.ajax({
    url: url,
    type: 'get',
    success: loadData
  });
}());
