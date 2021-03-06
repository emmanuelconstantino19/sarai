Template.ForecastView.onCreated(() => {
  //default is ICALABAR18
  Meteor.subscribe('sarai-weather-stations', () => {
    Session.set('stationID', 'ICALABAR18')
    getOWMData('ICALABAR18')    
  })
  Meteor.subscribe('weather-data-30')
})

Template.ForecastView.onRendered(() => {
})

Template.ForecastView.events({
  'change #preview-select-station': (e) => {
    const stationID = e.currentTarget.value
    Session.set('stationID', stationID)

    if($('#monitoring-station-select option:selected').text()!="Select Weather Station"){
      $('#main_title').html('6-Day Forecast: <b>' + $('#preview-select-station option:selected').text() + '</b>')
    }

    const forecast = getOWMData(stationID)
  },

  'click .preview-more button': () => {
    FlowRouter.go(`/weather-monitoring`)
  },

  'click #view-weather-monitoring': (e) => {
    Session.set('stationID', $('#preview-select-station').val())
  },
})

Template.ForecastView.helpers({
  stationID: () => {
    const stationID = Session.get('stationID')
    return stationID
  },

  forecast2: () => {
    const forecast = Session.get('forecast2')
    return forecast
  },

  weatherStations: () => {
    const stations = WeatherStations.find({}).fetch()

    const processedStations = Meteor.previewHelpers.formatStationList(stations)

    return processedStations
  },

  currentlySelected: (curr) => {
    const stationID = Session.get('stationID')
    $('#preview-select-station').val(stationID)
  }
})

const getOWMData = (stationID) => {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  var api = ''; 
  if(stationID == "IPAOAY4"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=18.054028,120.545667&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833';
  }else if(stationID == "ICAGAYAN3"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=17.410517,21.813614&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
  }else if(stationID == "ICAGAYAN2"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=16.725611,121.698503&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302';
  }else if(stationID == "ICENTRAL91"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=15.738165,120.928400&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
  }else if(stationID == "ICALABAR18"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=14.156233,121.262197&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833';
  }else if(stationID == "ICALABAR25"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.944936,121.369765&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833';
  }else if(stationID == "IMIMAROP7"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.149028,121.187139&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3';
  }else if(stationID == "IMIMAROP8"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.130432,120.704186&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3';
  }else if(stationID == "IMIMAROP6"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=9.443356,118.560378&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3';
  }else if(stationID == "IBICOLGU2"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=13.192833,123.595327&units=m&language=en-US&format=json&apiKey=f4664437a9f14d5ba64437a9f13d5b5a';
  }else if(stationID == "IWESTERN635"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=11.102263,122.414762&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302';
  }else if(stationID == "IWESTERN596"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=10.404912,122.978921&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302';
  }else if(stationID == "ICENTRAL94"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=10.132925,123.546750&units=m&language=en-US&format=json&apiKey=d12105851d0e4c28a105851d0e8c2833';
  }else if(stationID == "IZAMBOAN4"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.996182,121.929624&units=m&language=en-US&format=json&apiKey=ed7b5e2d0bca4c4bbb5e2d0bca0c4bf3';
  }else if(stationID == "INORTHER117"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=7.855571,125.057929&units=m&language=en-US&format=json&apiKey=cff86fd9a5404fd3b86fd9a5407fd302';
  }else if(stationID == "INORTHER86"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=8.610266,124.883303&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97';
  }else if(stationID == "IDAVAORE19"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.691228,125.188743&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97';
  }else if(stationID == "IDAVAORE20"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=6.489740,125.545582&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97';
  }else if(stationID == "IREGIONX6"){
    api = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=7.110252,124.851728&units=m&language=en-US&format=json&apiKey=56afd53a907440ecafd53a9074f0ec97';
  }

  $.getJSON(api,(results) => {
    let forecast = []
    for(var i = 1 ; i < 6; i++){
      var date = results.sunriseTimeLocal[i].substring(0,10).split('-')
      forecast.push({
        head: results.dayOfWeek[i].substring(0,3),
        date: months[parseInt(date[1])-1] + ' ' + date[2],
        icon: '/weather-underground/' + results.daypart[0].iconCode[i*2] + '.png',
        desc: results.daypart[0].wxPhraseLong[i*2],
        iconNight: '/weather-underground/' + results.daypart[0].iconCode[(i*2) + 1] + '.png',
        descNight: results.daypart[0].wxPhraseLong[(i*2) + 1],
        qpf: results.qpf[i],
        chance: results.daypart[0].precipChance[(i*2)],
        chanceNight: results.daypart[0].precipChance[(i*2)+1] 
      })
    }
    Session.set('forecast2', forecast)
  })
}

function sleep(milliseconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliseconds);
}

// const downloadForecast = () => {
//   const stations = WeatherStations.find({}).fetch()
//   stations.forEach((element, index) => {
//     element.label = element.label.replace('SARAI', '')
//     element.label = element.label.replace('(UPLB)', '')
//     element.label = element.label.replace('WFP', '')
//     element.label = element.label.replace('WPU', '')
//     element.label = element.label.replace('APN', '')
//     element.label.trim()
//   })

//   stations.sort((a, b) => {
//     return a.label.charCodeAt(0) - b.label.charCodeAt(0)
//   })

//   let weatherforecast = []
//   let loc_insert, date_insert, highTemp_insert, chanceRain_insert, rainfallToday_insert, numStations = stations.length

//   stations.forEach((element, index) => {
//     const location = element.label
//     const stationID = element.id
//     const past30Days = Meteor.previewHelpers.get30DayRainfall(WeatherData.find({id: stationID}).fetch())

//     let nextSevenDays = 0
//     let dateToday, highTemp, chanceRain, rainfallToday

//     const apiKey = DSSSettings.findOne({name: 'wunderground-api-key'}).value
    
    
//     $.getJSON(`http:\/\/api.wunderground.com/api/${apiKey}/forecast10day/q/pws:${stationID}.json`, (result) => {
//       const completeTxtForecast = result.forecast.txt_forecast.forecastday

//       const simpleForecast = result.forecast.simpleforecast.forecastday
//       let txtForecast = []
//       // let forecast = []

//       for (let a = 0; a < completeTxtForecast.length; a+=2) {
//         txtForecast.push(completeTxtForecast[a])
//       }

//       simpleForecast.forEach((element, index) => {
//         const date = `${element.date.month}/${element.date.day}`

//         // forecast.push({
//         //   head: txtForecast[index].title.substring(0, 3),
//         //   date,
//         //   high: element.high.celsius,
//         //   icon: txtForecast[index].icon_url,
//         //   qpf: element.qpf_allday.mm,
//         //   pop: element.pop })

//           if(element.period < 9){
//             if((1 < element.period) && (element.period < 9)){
//               nextSevenDays += element.qpf_allday.mm
//             }
//             if(element.period == 1){
//               dateToday = date
//               highTemp = element.high.celsius
//               chanceRain = element.pop
//               if(element.qpf_allday.mm == 0 || element.qpf_allday.mm == null){
//                 rainfallToday = '<1'
//               }else{
//                 rainfallToday = element.qpf_allday.mm
//               }
//               loc_insert = location
//               date_insert = date
//               highTemp_insert = element.high.celsius
//               chanceRain_insert = element.pop
//               rainfallToday_insert = rainfallToday
//             }
//           }
//       })

//       if(nextSevenDays == 0 || nextSevenDays == null){
//         nextSevenDays = '<1'
//       }else{
//         nextSevenDays = nextSevenDays
//       }

//       weatherforecast.push({
//         location: loc_insert,
//         dateToday: date_insert,
//         highTemp: highTemp_insert,
//         chanceRain: chanceRain_insert,
//         rainfallToday: rainfallToday_insert,
//         nextSevenDays: nextSevenDays,
//         past30Days: past30Days,
//         dateGenerated: new Date()
//       })
//       // if(index == (stations.length - 1)){
//       if(--numStations == 0){
//         const csvContent = CSV.unparse(weatherforecast)
//         // window.open('data:text/csv;charset=utf-8,' + escape(csvContent), '_self', $('div.download-div').remove())

//         const uri = 'data:application/csv;charset=utf-8,' + escape(csvContent);
//         const link = document.createElement("a");
//         link.href = uri;
//         link.style = "visibility:hidden";
//         link.download = "weatherforecast - "+new Date()+".csv";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);

//         $('div.download-div').remove()
//       }
//       sleep(6000)
//     })
//   })  // end of stations for each
// } 


/********* PREVIEW COL ***********/
Template.PreviewCol2.helpers({
  formatQPF: (qpf) => {
    if (qpf < 1) {
      return "< 1"
    }
    else {
      return qpf
    }
  }
})