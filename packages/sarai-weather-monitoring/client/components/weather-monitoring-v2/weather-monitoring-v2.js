Template.WeatherMonitoringV2.onCreated(() => {
  //By default the visible chart is the forecast chart

  Meteor.subscribe('sarai-weather-stations')
  Meteor.subscribe('weather-data-30')

  Meteor.subscribe('dss-settings', () => {
    const record = DSSSettings.findOne({name: 'wunderground-api-key'})
    this.apiKey = record.value
  })

  this.visibleChart = 'forecast'
  $('#forecast button').addClass('active')

  Highcharts.setOptions({
  // This is for all plots, change Date axis to local timezone
      global : {
          useUTC : false
      }
  });
})

Template.WeatherMonitoringV2.onRendered(() => {
  /****MAP****/
  const northEast = L.latLng(21.924058, 115.342984);
  const southWest = L.latLng(4.566972, 128.614468);
  const bounds = L.latLngBounds(southWest, northEast);

  const weatherMap = L.map('weather-map-v2', {
      maxBounds: bounds,
      center: [14.154604, 121.247505],
      zoom: 5,
      minZoom: 1,
      zoomControl: false
  });

  L.tileLayer('https://api.mapbox.com/styles/v1/mcarandang/cj1jd9bo2000a2speyi8o7cle/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNhcmFuZGFuZyIsImEiOiJjaWtxaHgzYTkwMDA4ZHZtM3E3aXMyYnlzIn0.x63VGx2C-BP_ttuEsn2fVg',{
    maxZoom: 20,
    id: 'mapbox://styles/mcarandang/cj1jd9bo2000a2speyi8o7cle',
    accessToken: 'pk.eyJ1IjoibWNhcmFuZGFuZyIsImEiOiJjaWtxaHgzYTkwMDA4ZHZtM3E3aXMyYnlzIn0.x63VGx2C-BP_ttuEsn2fVg'
  }).addTo(weatherMap);

  // weatherMap.zoomControl.setPosition('bottomleft');

  const showWeatherData = (stationID, label, event) => {
    // displayWeatherData(stationID, label)
    Session.set('stationID', stationID)

    displayWeatherData(stationID, this.apiKey)
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
})

Template.WeatherMonitoringV2.events({
  'click #forecast': () => {
    this.visibleChart = 'forecast'

    $('#forecast > button').addClass('active')
    $('#accumulated > button').removeClass('active')

    displayWeatherData(Session.get('stationID'), this.apiKey)
  },

  'click #accumulated': () => {
    this.visibleChart = 'accumulated'
    $('#accumulated > button').addClass('active')
    $('#forecast > button').removeClass('active')

    displayWeatherData(Session.get('stationID'), this.apiKey)
  }
})

Template.WeatherMonitoringV2.helpers({
  forecastIsSelected: () => {
    if (this.visibleChart == 'forecast' ) {
      return true
    } else {
      return false
    }
  },

  stations: () => {
    const stationsRainfall = WeatherStations.find({}, {fields: {id: 1}}).fetch()

    stationsRainfall.forEach((element, index) => {
      const weatherData = WeatherData.find({id: element.id}).fetch()

      const rainfallTotals = Meteor.AccumulatedRainfall.getTotal(weatherData)

      element['rainfall10'] = rainfallTotals[0]
      element['rainfall30'] = rainfallTotals[1]
    })

    return stationsRainfall
  }
})

const displayWeatherData = (stationID, apiKey) => {
  //Remove any existing chart
  $('div.meteogram').remove()

  //Display temporary spinner
  $('<div class="meteogram meteogram-stub"><div class="mdl-spinner mdl-js-spinner is-active"></div></div>').appendTo('#meteogram-container')

  if (this.visibleChart == 'forecast') {
    displayForecast(stationID, apiKey)
  } else {
    displayAccumulatedRain(stationID, apiKey)
  }
}

const displayForecast = (stationID, apiKey) => {

  if (apiKey) { //Make sure key is available

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

}

const displayAccumulatedRain = (stationID, apiKey) => {
  const weatherData = WeatherData.find({id: stationID}).fetch()

  //have to reconcile missing entries
  if (weatherData) {
    const fixedData = Meteor.AccumulatedRainfall.fillMissingEntries(weatherData.reverse())

    const pastRainfall = Meteor.AccumulatedRainfall.getPastRainfall(fixedData)

    if (apiKey) {
      $.getJSON(`http:\/\/api.wunderground.com/api/${apiKey}/forecast10day/q/pws:${stationID}.json`, (result) => {

        // const result = Meteor.RainfallSampleData.sampleData()

        //remove any existing chart first
        $('div.meteogram').remove()

        const runningTotal = pastRainfall.pastAccRainfall[29].y

        const forecast = Meteor.AccumulatedRainfall.getForecast(result, runningTotal)

        const completeData = Meteor.AccumulatedRainfall.assembleRainfallData(pastRainfall.pastRainfall, pastRainfall.pastAccRainfall, forecast.forecastRainfall, forecast.forecastAccumulated)

        $('<div class="meteogram">').appendTo('#meteogram-container').highcharts(Meteor.AccumulatedRainfall.constructChart(completeData.completeRainfall, completeData.completeAccumulatedRainfall, forecast.plotBandStart, forecast.plotBandEnd))
      })
    }
  }
}