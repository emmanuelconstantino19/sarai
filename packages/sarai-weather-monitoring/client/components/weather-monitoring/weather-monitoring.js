Template.WeatherMonitoring.onCreated(() => {
  // Meteor.subscribe('weather-stations')
})

Template.WeatherMonitoring.onRendered(() => {

  /******DIALOG*******/

  const dialog = document.querySelector('#weather-monitoring-dialog')

  dialog.querySelector('.cancel').addEventListener('click', () => {
    dialog.close();
  });

  /*** Initial display on rendered ***/ 
  const stationID = Session.get('stationID')
  const label = WeatherStations.findOne({id:stationID}).label
  displayWeatherData(stationID, label)
  dialog.showModal();

  /****MAP****/
  const northEast = L.latLng(21.924058, 115.342984);
  const southWest = L.latLng(4.566972, 128.614468);
  const bounds = L.latLngBounds(southWest, northEast);

  const weatherMap = L.map('weather-map', {
      maxBounds: bounds,
      center: [14.154604, 121.247505],
      zoom: 8,
      minZoom: 7
  });

  L.tileLayer('https://api.mapbox.com/styles/v1/mcarandang/cj1jd9bo2000a2speyi8o7cle/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNhcmFuZGFuZyIsImEiOiJjaWtxaHgzYTkwMDA4ZHZtM3E3aXMyYnlzIn0.x63VGx2C-BP_ttuEsn2fVg',{
    maxZoom: 20,
    id: 'mapbox://styles/mcarandang/cj1jd9bo2000a2speyi8o7cle',
    accessToken: 'pk.eyJ1IjoibWNhcmFuZGFuZyIsImEiOiJjaWtxaHgzYTkwMDA4ZHZtM3E3aXMyYnlzIn0.x63VGx2C-BP_ttuEsn2fVg'
  }).addTo(weatherMap);

  weatherMap.zoomControl.setPosition('bottomleft');

  const showWeatherData = (stationID, label, event) => {


    displayWeatherData(stationID, label)
    Session.set('stationID', stationID)


    dialog.showModal();
  }

  Meteor.subscribe('sarai-weather-stations', () => {
    Meteor.autorun(() => {
      const stations = WeatherStations.find().fetch()

      for (let a = 0; a < stations.length; a++) {
        const station = stations[a]
        const x = station.coords[0]
        const y = station.coords[1]
        const label = station.label
        const stationID = station.id

        const marker = new L.marker([x, y])
        .bindPopup(`<h5>${label}</h5>`)
        .on('click', L.bind(showWeatherData, null, stationID, label))

        marker.addTo(weatherMap)
      }
    })
  })


  /***********HIGHCHARTS HANDLERS************/
  $('#meteogram-container').bind('mousemove touchmove touchstart', function (e) {

      for (let i = 0; i < Highcharts.charts.length; i = i + 1) {
        const chart = Highcharts.charts[i];
        const event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart

        const point = chart.series[0].searchPoint(event, true); // Get the hovered point

        if (point) {
          point.highlight(e);
        }
      }
    });

  Highcharts.Pointer.prototype.reset = function () {
    return undefined;
  };

  Highcharts.Point.prototype.highlight = function (event) {
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
  };

})

const displayWeatherData = (stationID, label) => {
  //remove any existing charts first
  $('div.meteogram').remove()

  //Add (temporary) spinner
  $('<div class="meteogram meteogram-stub"><div class="mdl-spinner mdl-js-spinner is-active"></div></div>').appendTo('#meteogram-container')

  $('#weather-monitoring-dialog-title').html(`10-Day Forecast for <b>${label}</b>`)

  const apiKey = '9470644e92f975d3'
  const dataFeatures = [ 'conditions', 'hourly10day', 'forecast10day']

  $.getJSON(`http:\/\/api.wunderground.com/api/${apiKey}${Meteor.chartHelpers.featureURI(dataFeatures)}/q/pws:${stationID}.json`, (result) => {

    const dailySeries = Meteor.chartHelpers.getDailySeries(result)
    const hourlySeries = Meteor.chartHelpers.getHourlySeries(result)
    //common data
    const tickPositions = Meteor.chartHelpers.getTickPositions(result)
    const altTickPositions = Meteor.chartHelpers.getAltTickPositions(result)

    const plotLines = Meteor.chartHelpers.getPlotLines(tickPositions)

    const tickQPFMap = Meteor.chartHelpers.getTickQPFMap(altTickPositions, dailySeries.qpf)
    const tickTempMap = Meteor.chartHelpers.getTickTempMap(altTickPositions, dailySeries.hlTemp)

    const charts = [
      {
        element: '#temp-meteogram',
        title: 'Temperature',
        name: 'Temp',
        id: 'temp',
        data: hourlySeries.temp,
        unit: '°C',
        tickPositions: tickPositions,
        altTickPositions: altTickPositions,
        color: '#ff8c1a',
        dateTicksEnabled: true,
        plotLines,
        altTickLabels: tickTempMap,
      },
      {
        element: '#rain-meteogram',
        title: 'Chance of Rain',
        name: 'Chance of Rain',
        id: 'pop',
        data: hourlySeries.pop,
        unit: '%',
        tickPositions: tickPositions,
        altTickPositions: altTickPositions,
        color: '#0073e6',
        dateTicksEnabled: false,
        plotLines,
        altTickLabels: tickQPFMap
      }
    ]

    //remove any existing charts first
    $('div.meteogram').remove()

    //add new charts
    charts.forEach((chart, index) => {
      $('<div class="meteogram">')
        .appendTo('#meteogram-container')
        .highcharts(
          Meteor.chartHelpers.constructChart(chart))
    })
  })
}