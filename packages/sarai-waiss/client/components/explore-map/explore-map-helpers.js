Template.WAISSExploreMap.onRendered(function() {
    Session.set('weatherStationId', null);
    
    var self = this;

    var northEast = L.latLng(21.924058, 115.342984);
    var southWest = L.latLng(4.566972, 128.614468);
    var bounds = L.latLngBounds(southWest, northEast);

    var map = L.map('waiss-explore-map', {
        maxBounds: bounds,
        center: [14.154604, 121.247505],
        zoom: 8,
        minZoom: 7
    });

    L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map);

    self.autorun(function() {
        var data = Template.currentData();
        var weatherStations = data.weatherStations;
        if(weatherStations.length > 0) {
            for(var i = 0; i < weatherStations.length; i++) {
                var marker = new L.marker([weatherStations[i].coords[0], weatherStations[i].coords[1]], {
                    weatherStationId: weatherStations[i].id
                })
                .bindPopup('<h5>'+weatherStations[i].label+'</h5>')
                .on('click', markerClick);

                marker.addTo(map);
            }
        }
    });

    function markerClick(e) {
        Session.set('weatherStationId', this.options.weatherStationId);
    }
});