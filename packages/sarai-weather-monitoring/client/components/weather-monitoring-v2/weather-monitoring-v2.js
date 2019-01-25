Template.WeatherMonitoringV2.onCreated(() => {
  //By default the visible chart is the forecast chart

  Meteor.subscribe('sarai-weather-stations')
  Meteor.subscribe('weather-data-30')

  Meteor.subscribe('dss-settings', () => {
    const record = DSSSettings.findOne({name: 'wunderground-api-key'})
    this.apiKey = record.value

    //display default station
    Session.set('stationID', 'ICALABAR18')
    displayWeatherData(Session.get('stationID'), this.apiKey)
    getCurrentWeather(this.apiKey)

  })

  Highcharts.setOptions({
  // This is for all plots, change Date axis to local timezone
      global : {
          useUTC : true
      }
  });
})

Template.WeatherMonitoringV2.onRendered(() => {
  var tenday = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  $('#rainfall-forecast-table').find('tr').append("<th>Station ID</th>")

  for(var i = 0 ; i <= 9; i++){
    var someDate = new Date();
    someDate.setDate(someDate.getDate() + i);
    $('#rainfall-forecast-table').find('tr').append("<th>" + monthNames[someDate.getMonth()] + " " + someDate.getDate() + " (mm)</th>")
    tenday.push(monthNames[someDate.getMonth()] + " " + someDate.getDate())
  }

  $('#rainfall-forecast-table').dataTable();

  displayRainfallGraph(tenday);

  /****MAP****/
  const northEast = L.latLng(21.924058, 115.342984);
  const southWest = L.latLng(4.566972, 128.614468);
  const bounds = L.latLngBounds(southWest, northEast);

  //Create group
  const group = L.layerGroup()

  //Create map
  const weatherMap = L.map('weather-map-v2', {
      maxBounds: bounds,
      center: [14.154604, 121.247505],
      zoom: 5,
      minZoom: 1
  });

  weatherMap.zoomControl.setPosition('bottomleft');

  L.tileLayer('https://api.mapbox.com/styles/v1/mcarandang/cj1jd9bo2000a2speyi8o7cle/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNhcmFuZGFuZyIsImEiOiJjaWtxaHgzYTkwMDA4ZHZtM3E3aXMyYnlzIn0.x63VGx2C-BP_ttuEsn2fVg',{
    maxZoom: 20,
    id: 'mapbox://styles/mcarandang/cj1jd9bo2000a2speyi8o7cle',
    accessToken: 'pk.eyJ1IjoibWNhcmFuZGFuZyIsImEiOiJjaWtxaHgzYTkwMDA4ZHZtM3E3aXMyYnlzIn0.x63VGx2C-BP_ttuEsn2fVg'
  }).addTo(weatherMap);

  const showWeatherData = (stationID, label, event) => {
    Session.set('stationID', stationID)
    const station = this.stations.find((element) => {
      return element.id == stationID
    })
    $('#monitoring-station-select').val(station.markerID)
    displayWeatherData(stationID, this.apiKey)
  }

  Meteor.subscribe('sarai-weather-stations', () => {
    Meteor.autorun(() => {
      const stations = WeatherStations.find().fetch()
      let defaultStation = null

      for (let a = 0; a < stations.length; a++) {
        const station = stations[a]
        const x = station.coords[0]
        const y = station.coords[1]
        const label = stripTitle(station.label)
        const stationID = station.id

        const marker = new L.marker([x, y])
        .bindPopup(`<h5>${label}</h5>`)
        .on('click', L.bind(showWeatherData, null, stationID, label))

        group.addLayer(marker)

        stations[a]['markerID'] = group.getLayerId(marker)

        //save option value, pan to marker, and open popup
        if (stationID == 'ICALABAR18') {
          defaultStation = group.getLayerId(marker)
          weatherMap.setView(marker.getLatLng(), 5)
          marker.openPopup()
        }
      }

      group.addTo(weatherMap)

      //Add stations to dropdown
      const stationsDropdown = $('#monitoring-station-select')

      //Add stations to dropdown
      stations.forEach((element, index) => {
        const option = document.createElement('option')

        option.innerHTML = `${stripTitle(element.label)}`
        option.setAttribute('value', element.markerID)

        stationsDropdown.append(option)
      })

      this.stations = stations
      this.weatherMap = weatherMap
      this.group = group
    })
  })

})

Template.WeatherMonitoringV2.events({
  'change #monitoring-station-select': () => {
    const markerID = $('#monitoring-station-select').val()

    const station = this.stations.find((element) => {
      return element.markerID == markerID
    })

    const marker = this.group.getLayer(markerID)

    this.weatherMap.setView(marker.getLatLng(), 10)
    marker.openPopup()

    displayWeatherData(station.id, this.apiKey)
  }
})

Template.WeatherMonitoringV2.helpers({
  forecastToday: () => {
      const stationID = Session.get('stationID')
      const forecast = Session.get('forecast')
      const weatherData = WeatherData.find({id: stationID})

      if (forecast && weatherData) {
        let forecastToday = forecast[0]
        const rainfall = Meteor.previewHelpers.get30DayRainfall(weatherData.fetch())

        forecastToday.head = 'Today'
        forecastToday.today = true
        forecastToday['cumulative'] = rainfall

        return forecastToday
      }
  },

  forecastFirst4: () => {
    //quantitative preciptation forecast
    //probability of precipitation
    const forecast = Session.get('forecast')

    if (forecast) {
      return forecast.splice(1, 4)
    }
  },

  forecastNext5: () => {
    const forecast = Session.get('forecast')

    if (forecast) {
      return forecast.splice(5, 5)
    }
  }
})

const displayWeatherData = (stationID, apiKey) => {
  const forecast = getForecast(stationID)
  displayForecast(stationID, apiKey)
}

const getForecast = (stationID) => {

  const apiKey = DSSSettings.findOne({name: 'wunderground-api-key'}).value

  $.getJSON(`http:\/\/api.wunderground.com/api/${apiKey}/forecast10day/q/pws:${stationID}.json`, (result) => {
    const completeTxtForecast = result.forecast.txt_forecast.forecastday

    const simpleForecast = result.forecast.simpleforecast.forecastday
    let txtForecast = []
    let forecast = []

    for (let a = 0; a < completeTxtForecast.length; a+=2) {
      txtForecast.push(completeTxtForecast[a])
    }

    simpleForecast.forEach((element, index) => {
      const date = `${element.date.day} ${element.date.monthname_short}`

      forecast.push({
        head: txtForecast[index].title.substring(0, 3),
        date,
        icon: txtForecast[index].icon_url,
        qpf: element.qpf_allday.mm,
        pop: element.pop })
    })

    $('#subtitle').html("<b>Today's Forecast </b>" + txtForecast[0].fcttext)
    
    Session.set('forecast', forecast)

  })
.success(function() { 
	if($('#monitoring-station-select option:selected').text()!="Select Weather Station"){
		$('#main_title').html('10-Day Forecast: <b>' + $('#monitoring-station-select option:selected').text() + '</b>')
	}
})
.error(function(){ 
  var snackbarContainer = document.querySelector('#demo-snackbar-example');
  var data = {
      message: 'Selected site is currently unavailable',
      timeout: 2000
    };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
})
.complete(function() { console.log('Complete') });

}

const getCurrentWeather = (apiKey) => {
	var weather_stations2 = [
		'BUCAF-Albay',	 
		'CLSU-Munoz',	 
		'CMU-Maramag',	 
		'CTU-Barili',	 
		'DAQAES-Tiaong',	 
		'IPB-UPLB',	 
		'ISU-Cabagan',	 
		'ISU-Echague',	 
		'MINSCAT-Mindoro',	 
		'MMSU-Batac',	 
		'NCAS-UPLB',	 
		'PCA-Zamboanga',	 
		'PHILRICE-Mindoro',	 
		'SPAMAST-Malita',	 
		'SPAMAST-Matanao',	 
		'UPLBCA-LaGranja',	 
		'USM-Kabacan',	 
		'USTP-Claveria',	 
		'WPU-Aborlan',	 
		'WVSU-Iloilo'
	]

	var rainfall, temp, hum, pres, ws, sr;

	for(var i = 0; i < weather_stations2.length; i++){
		$.getJSON(`http://202.92.144.43/WL/JSON/${weather_stations2[i]}.json`,(result) => {
			//rainfall = (result.hasOwnProperty('')) ? '--' : result.davis_current_observation.rain_day_in;
			temp = (result.hasOwnProperty('temp_c')) ? result.temp_c : '--';
			hum = (result.hasOwnProperty('relative_humidity')) ? result.relative_humidity : '--';
			pres = (result.hasOwnProperty('pressure_mb')) ? result.pressure_mb : '--';
			ws = (result.hasOwnProperty('wind_mph')) ? result.wind_mph : '--';
			sr = (result.davis_current_observation.hasOwnProperty('solar_radiation')) ? result.davis_current_observation.solar_radiation : '--';
			$('#current-weather-data').DataTable().row.add([
        result.davis_current_observation.station_name,
				result.observation_time_rfc822.replace('+0800',''),
				result.davis_current_observation.rain_day_in,
				temp,
				hum,
				pres,
				ws,
				sr
      ]).draw();		
		})
  }

}


const displayRainfallGraph = (tenday) => {
  var graphData = [];
  $.when(
    $.getJSON(`http://202.92.144.43/WU/JSON/BUCAF-Albay.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['BUCAF-Albay', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'BUCAF-Albay', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/CLSU-Munoz.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['CLSU-Munoz', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'CLSU-Munoz', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/CMU-Maramag.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['CMU-Maramag', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'CMU-Maramag', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/CTU-Barili.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['CTU-Barili', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'CTU-Barili', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/DAQAES-Tiaong.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['DAQAES-Tiaong', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'DAQAES-Tiaong', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/IPB-UPLB.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['IPB-UPLB', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'IPB-UPLB', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/ISU-Cabagan.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['ISU-Cabagan', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'ISU-Cabagan', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/ISU-Echague.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['ISU-Echague', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'ISU-Echague', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/MINSCAT-Mindoro.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['MINSCAT-Mindoro', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'MINSCAT-Mindoro', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/MMSU-Batac.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['MMSU-Batac', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'MMSU-Batac', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/NCAS-UPLB.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['NCAS-UPLB', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'NCAS-UPLB', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/PCA-Zamboanga.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['PCA-Zamboanga', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'PCA-Zamboanga', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/PHILRICE-Mindoro.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['PHILRICE-Mindoro', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'PHILRICE-Mindoro', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/SPAMAST-Malita.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['SPAMAST-Malita', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'SPAMAST-Malita', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/SPAMAST-Matanao.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['SPAMAST-Matanao', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'SPAMAST-Matanao', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/UPLBCA-LaGranja.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['UPLBCA-LaGranja', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'UPLBCA-LaGranja', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/USM-Kabacan.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['USM-Kabacan', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'USM-Kabacan', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/USTP-Claveria.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['USTP-Claveria', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'USTP-Claveria', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/WPU-Aborlan.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['WPU-Aborlan', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'WPU-Aborlan', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    }),
    $.getJSON(`http://202.92.144.43/WU/JSON/WVSU-Iloilo.json`,(result) => {
      if(result.hasOwnProperty('forecast')){
        var dailyRecords = result.forecast.simpleforecast.forecastday
        $('#rainfall-forecast-table').DataTable().row.add(['WVSU-Iloilo', dailyRecords[0].qpf_allday.mm, dailyRecords[1].qpf_allday.mm, dailyRecords[2].qpf_allday.mm, dailyRecords[3].qpf_allday.mm, dailyRecords[4].qpf_allday.mm, dailyRecords[5].qpf_allday.mm, dailyRecords[6].qpf_allday.mm, dailyRecords[7].qpf_allday.mm, dailyRecords[8].qpf_allday.mm, dailyRecords[9].qpf_allday.mm]).draw();
        graphData.push({name: 'WVSU-Iloilo', data: [dailyRecords[0].qpf_allday.mm,dailyRecords[1].qpf_allday.mm,dailyRecords[2].qpf_allday.mm,dailyRecords[3].qpf_allday.mm,dailyRecords[4].qpf_allday.mm,dailyRecords[5].qpf_allday.mm,dailyRecords[6].qpf_allday.mm,dailyRecords[7].qpf_allday.mm,dailyRecords[8].qpf_allday.mm,dailyRecords[9].qpf_allday.mm]})
      }
    })
  ).then(function() {
    console.log("Finished table")
    console.log(graphData)
    $('<div class="meteogram">').appendTo('#rainfall-container').highcharts(Meteor.RainfallForecast.constructChart(graphData,tenday))
  });
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
          element: '#rain-meteogram',
          title: 'Chance of Rain',
          name: 'Chance of Rain',
          id: 'pop',
          data: hourlySeries.pop,
          unit: '%',
          tickPositions: tickPositions,
          altTickPositions: altTickPositions,
          color: '#0073e6',
          dateTicksEnabled: true,
          plotLines,
          altTickLabels: tickQPFMap
        },
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
        }
      ]

      $('#meteogram-container .meteogram').remove()
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

const stripTitle = (title) => {
  let result = title

  result = result.replace('SARAI', '')
  result = result.replace('(UPLB)', '')
  result = result.replace('WFP', '')
  result = result.replace('WPU', '')
  result = result.replace('APN', '')

  return result
}

/********* PREVIEW COL ***********/
Template.PreviewColWM.helpers({
  formatQPF: (qpf) => {
    if (qpf < 1) {
      return "< 1"
    }
    else {
      return qpf
    }
  }
})