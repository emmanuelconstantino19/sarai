Template.WeatherMonitoringV2.onCreated(() => {
  //By default the visible chart is the forecast chart

  Meteor.subscribe('sarai-weather-stations')
  Meteor.subscribe('weather-data-30')
  /*Meteor.subscribe('wunderground-data', () => {
    console.log(WundergroundData.find({}).fetch())
  })*/

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

  for(var i = 0 ; i <= 5; i++){
    var someDate = new Date();
    someDate.setDate(someDate.getDate() + i);
    $('#rainfall-forecast-table').find('tr').append("<th>" + monthNames[someDate.getMonth()] + " " + someDate.getDate() + " (mm)</th>")
    tenday.push(monthNames[someDate.getMonth()] + " " + someDate.getDate())
  }

  $('#rainfall-forecast-table').dataTable();

  /*$("#monitoring-station-select").change(function(){
    $('#monitoring-station-select').val()
    const stations = WeatherStations.find().fetch()
    const markerID = $('#monitoring-station-select').val()

    const station = stations.find((element) => {
      return element.markerID == markerID
    })
    getOWMData(station.id)
  })*/

  displayRainfallGraph(tenday);
  

})

Template.WeatherMonitoringV2.events({
  'change #monitoring-station-select': () => {
    //const stations = WeatherStations.find().fetch()
    const markerID = $('#monitoring-station-select').val()
    var stationid;
    switch(markerID){
      case '37': 
        stationid = 'IMIMAROP7'
        break;
      case '38':
        stationid = 'IDAVAORE20'
        break;
      case '39':
        stationid = 'ICAGAYAN2'
        break;
      case '40':
        stationid = 'ICENTRAL91'
        break;
      case '41':
        stationid = 'IBICOLGU2'
        break;
      case '42':
        stationid = 'IMIMAROP6'
        break;
      case '43':
        stationid = 'IMIMAROP8'
        break;
      case '44':
        stationid = 'IDAVAORE19'
        break;
      case '45':
        stationid = 'IZAMBOAN4'
        break;
      case '46':
        stationid = 'ICENTRAL94'
        break;
      case '47':
        stationid = 'IWESTERN596'
        break;
      case '48':
        stationid = 'IWESTERN635'
        break;
      case '49':
        stationid = 'ICALABAR18'
        break;
      case '50':
        stationid = 'ICALABAR25'
        break;
      case '51':
        stationid = 'ICAGAYAN3'
        break;
      case '52':
        stationid = 'INORTHER117'
        break;
      case '53':
        stationid = 'IREGIONX6'
        break;
      case '54':
        stationid = 'INORTHER86'
        break;
      case '55':
        stationid = 'IPAOAY4'
        break;
    }
    getOWMData(stationid)
    /*const station = this.stations.find((element) => {
      return element.markerID == markerID
    })

    const marker = this.group.getLayer(markerID)

    this.weatherMap.setView(marker.getLatLng(), 10)
    marker.openPopup()

    displayWeatherData(station.id, this.apiKey)*/

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
  },

  forecast2: () => {
    const forecast = Session.get('forecast2')
    return forecast
  }
})

const displayWeatherData = (stationID, apiKey) => {
  //const forecast = getForecast(stationID)
  getOWMData(stationID);
  //displayForecast(stationID, apiKey)
}

const getOWMData = (stationID) => {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  var api = '', code = ''; 
  if(stationID == "IPAOAY4"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=18.054028,120.545667&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
    code = 'MMSU-Batac'
  }else if(stationID == "ICAGAYAN3"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=17.410517,21.813614&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
    code = 'ISU-Cabagan'
  }else if(stationID == "ICAGAYAN2"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=16.725611,121.698503&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
    code = 'ISU-Echague'
  }else if(stationID == "ICENTRAL91"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=15.738165,120.928400&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833';
    code = 'CLSU-Munoz'
  }else if(stationID == "ICALABAR18"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=14.156233,121.262197&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833';
    code = 'IPB-UPLB'
  }else if(stationID == "ICALABAR25"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.944936,121.369765&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833';
    code = 'DAQAES-Tiaong'
  }else if(stationID == "IMIMAROP7"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.149028,121.187139&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3';
    code = 'MINSCAT-Mindoro'
  }else if(stationID == "IMIMAROP8"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.130432,120.704186&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3';
    code = 'PHILRICE-Mindoro'
  }else if(stationID == "IMIMAROP6"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=9.443356,118.560378&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3';
    code = 'WPU-Aborlan'
  }else if(stationID == "IBICOLGU2"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.192833,123.595327&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302';
    code = 'BUCAF-Albay'
  }else if(stationID == "IWESTERN635"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=11.102263,122.414762&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302';
    code = 'WVSU-Iloilo'
  }else if(stationID == "IWESTERN596"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=10.404912,122.978921&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302';
    code = 'UPLBCA-LaGranja'
  }else if(stationID == "ICENTRAL94"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=10.132925,123.546750&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
    code = 'CTU-Barili'
  }else if(stationID == "IZAMBOAN4"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.996182,121.929624&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
    code = 'PCA-Zamboanga'
  }else if(stationID == "INORTHER117"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=7.855571,125.057929&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
    code = 'CMU-Maramag'
  }else if(stationID == "INORTHER86"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=8.610266,124.883303&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
    code = 'USTP-Claveria'
  }else if(stationID == "IDAVAORE19"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.691228,125.188743&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97';
    code = 'SPAMAST-Matanao'
  }else if(stationID == "IDAVAORE20"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.489740,125.545582&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97';
    code = 'SPAMAST-Malita'
  }else if(stationID == "IREGIONX6"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=7.110252,124.851728&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97';
    code = 'USM-Kabacan'
  }

  $.getJSON(api,(results) => {

    Meteor.subscribe('rainfall-historical', ()=>{
      historical = RainfallHistorical.find({code:code}).fetch()
      const fixedData = Meteor.AccumulatedRainfall.fillMissingEntries(historical[0])
      const pastRainfall = Meteor.AccumulatedRainfall.getPastRainfall(fixedData)
      //console.log(pastRainfall)
      
      $('#accumulative-container .meteogram').remove()
      const runningTotal = pastRainfall.pastAccRainfall[29].y
      const forecast = Meteor.AccumulatedRainfall.getForecast(results, runningTotal,pastRainfall)
      const completeData = Meteor.AccumulatedRainfall.assembleRainfallData(pastRainfall.pastRainfall, pastRainfall.pastAccRainfall, forecast.forecastRainfall, forecast.forecastAccumulated)
      $('<div class="meteogram">').appendTo('#accumulative-container').highcharts(Meteor.AccumulatedRainfall.constructChart(completeData.completeRainfall, completeData.completeAccumulatedRainfall, forecast.plotBandStart, forecast.plotBandEnd, code))
    })

    let forecast = []

    for(var i = 0 ; i < 6; i++){
      var date = results.sunriseTimeLocal[i].substring(0,10).split('-')
      forecast.push({
        head: results.dayOfWeek[i].substring(0,3),
        date: months[parseInt(date[1]) - 1] + ' ' + date[2],
        icon: '/weather-underground/' + results.daypart[0].iconCode[i*2] + '.png',
        desc: results.daypart[0].wxPhraseLong[i*2],
        iconNight: '/weather-underground/' + results.daypart[0].iconCode[(i*2) + 1] + '.png',
        descNight: results.daypart[0].wxPhraseLong[(i*2) + 1],
        qpf: results.qpf[i],
        chance: results.daypart[0].precipChance[(i*2)],
        chanceNight: results.daypart[0].precipChance[(i*2)+1],
        qpfDay: results.daypart[0].qpf[(i*2)],
        qpfNight: results.daypart[0].qpf[(i*2)+1],
        //qpf: element.qpf_allday.mm,
        //pop: element.pop 
      })
    }
    Session.set('forecast2', forecast)
  })
  .success(function() { 
    if($('#monitoring-station-select option:selected').text()!="Select Weather Station"){
      $('#main_title').html('6-Day Forecast: <b>' + $('#monitoring-station-select option:selected').text() + '</b>')
    }
  })
  //Session.set('forecast'2, )
}

const getForecast = (stationID) => {

  const apiKey = DSSSettings.findOne({name: 'wunderground-api-key'}).value

  $.getJSON(`http:\/\/api.wunderground.com/api/${apiKey}/forecast10day/q/pws:${stationID}.json`, (results) => {
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
		$('#main_title').html('6-Day Forecast: <b>' + $('#monitoring-station-select option:selected').text() + '</b>')
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
			hum = (result.hasOwnProperty('relative_humidity') && parseFloat(result.relative_humidity) > 0 ) ? result.relative_humidity : '--';
			pres = (result.hasOwnProperty('pressure_mb')  && parseFloat(result.pressure_mb) > 0) ? result.pressure_mb : '--';
			ws = (result.hasOwnProperty('wind_mph')) ? result.wind_mph : '--';
			sr = (result.davis_current_observation.hasOwnProperty('solar_radiation')) ? result.davis_current_observation.solar_radiation : '--';
			$('#current-weather-data').DataTable().row.add([
        result.davis_current_observation.station_name,
				result.observation_time_rfc822.replace('+0800',''),
				Math.round((parseFloat(result.davis_current_observation.rain_day_in) * 25.4) * 10)/10,
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
    //BUCAF
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.192833,123.595327&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302`,(results) => {
        $('#rainfall-forecast-table').DataTable().row.add(['BUCAF-Albay', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'BUCAF-Albay', code:'IBICOLGU2', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=15.738165,120.928400&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833`,(results) => {
    
        $('#rainfall-forecast-table').DataTable().row.add(['CLSU-Munoz', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'CLSU-Munoz', code:'ICENTRAL91', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=7.855571,125.057929&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a`,(results) => {
      
        $('#rainfall-forecast-table').DataTable().row.add(['CMU-Maramag', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'CMU-Maramag', code:'INORTHER117', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=10.132925,123.546750&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['CTU-Barili', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'CTU-Barili', code:'ICENTRAL94', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.944936,121.369765&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['DAQAES-Tiaong', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'DAQAES-Tiaong', code:'ICALABAR25', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=14.156233,121.262197&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['IPB-UPLB', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'IPB-UPLB', code:'ICALABAR18', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=17.410517,21.813614&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['ISU-Cabagan', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'ISU-Cabagan', code:'ICAGAYAN3', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=16.725611,121.698503&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['ISU-Echague', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'ISU-Echague', code:'ICAGAYAN2', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.149028,121.187139&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['MINSCAT-Mindoro', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'MINSCAT-Mindoro', code:'IMIMAROP7', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=18.054028,120.545667&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['MMSU-Batac', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'MMSU-Batac', code:'IPAOAY4', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.996182,121.929624&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['PCA-Zamboanga', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'PCA-Zamboanga', code:'IZAMBOAN4', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.130432,120.704186&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['PHILRICE-Mindoro', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'PHILRICE-Mindoro', code:'IMIMAROP8', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.489740,125.545582&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['SPAMAST-Malita', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'SPAMAST-Malita', code:'IDAVAORE20', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.691228,125.188743&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['SPAMAST-Matanao', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'SPAMAST-Matanao', code:'IDAVAORE19', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=10.404912,122.978921&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['UPLBCA-LaGranja', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'UPLBCA-LaGranja', code:'IWESTERN596', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=7.110252,124.851728&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['USM-Kabacan', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'USM-Kabacan', code:'IREGIONX6', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=8.610266,124.883303&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['USTP-Claveria', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'USTP-Claveria', code:'INORTHER86', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=9.443356,118.560378&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['WPU-Aborlan', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'WPU-Aborlan', code:'IMIMAROP6', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    }),
    $.getJSON(`https://api.weather.com/v3/wx/forecast/daily/5day?geocode=11.102263,122.414762&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302`,(results) => {
      
        
        $('#rainfall-forecast-table').DataTable().row.add(['WVSU-Iloilo', Math.round(parseFloat(results.qpf[0]) * 10)/10, Math.round(parseFloat(results.qpf[1]) * 10)/10, Math.round(parseFloat(results.qpf[2]) * 10)/10, Math.round(parseFloat(results.qpf[3]) * 10)/10, Math.round(parseFloat(results.qpf[4]) * 10)/10, Math.round(parseFloat(results.qpf[5]) * 10)/10]).draw();
        graphData.push({name: 'WVSU-Iloilo', code:'IWESTERN635', data: [results.qpf[0], results.qpf[1], results.qpf[2], results.qpf[3], results.qpf[4], results.qpf[5]]})
      
    })
  ).then(function() {
    //console.log(graphData)
    $('<div class="meteogram">').appendTo('#rainfall-container').highcharts(Meteor.RainfallForecast.constructChart(graphData,tenday))

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

	      var LeafIcon = L.Icon.extend({
			    options: {
			        //shadowUrl: 'yellow-marker.png',
			        iconSize:     [25, 41],
			        //shadowSize:   [50, 64],
			        iconAnchor:   [12, 41],
			        //shadowAnchor: [4, 62],
			        popupAnchor:  [0, -35]
			    }
			});

	      var yellowIcon = new LeafIcon({iconUrl: 'yellow-marker.png'}),
	      	redIcon = new LeafIcon({iconUrl: 'red-marker.png'}),
	      	orangeIcon = new LeafIcon({iconUrl: 'orange-marker.png'}),
	      	blueIcon = new LeafIcon({iconUrl: 'blue-marker.png'});

	      for (let a = 0; a < stations.length; a++) {
	      	var rainfall = 0;
	        const station = stations[a]
	        const x = station.coords[0]
	        const y = station.coords[1]
	        const label = stripTitle(station.label)
	        const stationID = station.id

	        //console.log(station.id + ' : ' + station.label)

	        for(let b = 0 ; b < graphData.length ; b++){
	        	if(graphData[b].code == station.id){
	        		rainfall = graphData[b].data[0]
	        		//console.log(station.id + '(' + station.label + ')' + ' : ' +rainfall)
	        	}
	        }

	        var marker;

	        if(rainfall < 7.5){
	        	rainfall = (rainfall < 1) ? '< 1' : rainfall
		        marker = new L.marker([x, y], {icon: blueIcon})
		        .bindPopup(`<h5>${label}</h5><span style="font-size:15px">Total rainfall: ${rainfall} mm</span>`)
		        .on('click', L.bind(showWeatherData, null, stationID, label))
	    	}
	    	else if(rainfall >= 7.5 && rainfall < 15){
	    		marker = new L.marker([x, y], {icon: yellowIcon})
		        .bindPopup(`<h5>${label}</h5><span style="font-size:15px">Total rainfall: ${rainfall} mm</span>`)
		        .on('click', L.bind(showWeatherData, null, stationID, label))	
	    	}
	    	else if(rainfall >= 15 && rainfall < 30){
	    		marker = new L.marker([x, y], {icon: orangeIcon})
		        .bindPopup(`<h5>${label}</h5><span style="font-size:15px">Total rainfall: ${rainfall} mm</span>`)
		        .on('click', L.bind(showWeatherData, null, stationID, label))	
	    	}	
	    	else if(rainfall >= 30){
	    		marker = new L.marker([x, y], {icon: redIcon})
		        .bindPopup(`<h5>${label}</h5><span style="font-size:15px">Total rainfall: ${rainfall} mm</span>`)
		        .on('click', L.bind(showWeatherData, null, stationID, label))	
	    	}	

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
  });
}

const displayForecast = (stationID, apiKey) => {

  if (apiKey) { //Make sure key is available

    const dataFeatures = [ 'conditions', 'hourly10day', 'forecast10day']
    $.getJSON(`http:\/\/api.wunderground.com/api/${apiKey}${Meteor.chartHelpers.featureURI(dataFeatures)}/q/pws:${stationID}.json`, (results) => {

      const dailySeries = Meteor.chartHelpers.getDailySeries(results)
      const hourlySeries = Meteor.chartHelpers.getHourlySeries(results)
      //common data
      const tickPositions = Meteor.chartHelpers.getTickPositions(results)
      const altTickPositions = Meteor.chartHelpers.getAltTickPositions(results)

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
Template.PreviewColWM2.helpers({
  formatQPF: (qpf) => {
    if (qpf < 1) {
      return "< 1"
    }
    else {
      return qpf
    }
  },

  checkNull: (icon) => {
    if(icon.includes("null")){
      return false
    }
    return true
  }
})