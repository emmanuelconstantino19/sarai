Meteor.AccumulatedRainfall = {
  fillMissingEntries: (weatherData) => {
    let oneMonthAgo = new Date()
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)
    oneMonthAgo.setHours(0,0,0,0)

    //Create array to hold the fixed data (full of empty entries first)
    let fixedData = []

    for (let a = 0; a < 30; a++) {
      let d = new Date()
      d.setDate(d.getDate() - (30 - a) + 1)
      d.setHours(0,0,0,0)
      const entry = {
        data: {
          rainfall: 0
        },
        dateUTC: d
      }

      fixedData.push(entry)
    }


    let b = 0 //counter for existing data in weatherData array

    /*for (let a = 0; a < 30; a++) {
      if (weatherData[b] && fixedData[a].dateUTC.getTime() == weatherData[b].dateUTC.getTime()) {
        //found date match in retrieved weather data

        fixedData[a].data.rainfall = weatherData[b].data.rainfall

        b+=1
      }
    }*/

    for(let a = 0 ; a < 30; a++){
      var month = ("0" + (fixedData[a].dateUTC .getMonth() + 1)).slice(-2);
      var day = ("0" + (fixedData[a].dateUTC .getDate() - 1)).slice(-2);
      var year = fixedData[a].dateUTC .getFullYear();
      var new_format = month + '-' + day + '-' + year;
      if(weatherData[new_format]==undefined){
        fixedData[a].data.rainfall = 0;
      }
      else{
        fixedData[a].data.rainfall = Math.round(weatherData[new_format] * 10) / 10
      }
    }

    return fixedData
  },

  getPastRainfall(weatherData) {
    let pastRainfall = []
    let pastAccRainfall = []
    let totalRainfall = 0

    for (let entry of weatherData) {
      totalRainfall += entry.data.rainfall

      pastRainfall.push({ x: entry.dateUTC, y: entry.data.rainfall})
      pastAccRainfall.push({ x: entry.dateUTC, y: Math.round(totalRainfall * 10) / 10})
    }

    return {
      pastRainfall,
      pastAccRainfall
    }
  },

  getForecast: (forecast, runningTotal, pastRainfall) => {
    let forecastRainfall = []
    let forecastAccumulated = []
    //let total = runningTotal
    let total = 0

    const dailyRecords = forecast.qpf


    var plotBandStart, plotBandEnd;

    for(let a = 0 ; a < 6; a++){
      total = 0;
      //dailyRecords[a]
      let d = new Date()
      d.setDate(d.getDate() + a + 1)
      d.setHours(0,0,0,0)

      for(let c = a+1 ; c < 30; c++){
        //total += dailyRecords[a];
        total+=pastRainfall['pastRainfall'][c].y
      }

      for(let b = 0; b <= a; b++){
        total+=dailyRecords[b] 
      }


      forecastRainfall.push({ x: d, y: Math.round(dailyRecords[a] * 10) / 10})
      forecastAccumulated.push({ x: d, y: Math.round(total * 10) / 10})
      

      if(a == 0){
        plotBandStart = d;
      }else if(a == 5){
        plotBandEnd = d;
      }
    }  

    return {
      forecastRainfall,
      forecastAccumulated,
      plotBandStart,
      plotBandEnd
    }

    /*const dailyRecords = forecast.forecast.simpleforecast.forecastday

    for (let entry of dailyRecords) {
      const utcDate = Date.UTC(entry.date.year, entry.date.month - 1, entry.date.day);
      total += entry.qpf_allday.mm,

      forecastRainfall.push({ x: utcDate, y: entry.qpf_allday.mm})
      forecastAccumulated.push({ x: utcDate, y: total})
    }

    const firstEntry = dailyRecords[0]
    const lastEntry = dailyRecords[9]
    const plotBandStart = Date.UTC(firstEntry.date.year, firstEntry.date.month - 1, firstEntry.date.day)
    const plotBandEnd = Date.UTC(lastEntry.date.year, lastEntry.date.month - 1, lastEntry.date.day)

    return {
      forecastRainfall,
      forecastAccumulated,
      plotBandStart,
      plotBandEnd
    }*/
  },

  assembleRainfallData: (pastRain, pastAcc, forecastRain, forecastAcc) => {

    const completeRainfall = pastRain.concat(forecastRain)
    const completeAccumulatedRainfall = pastAcc.concat(forecastAcc)

    return {
      completeRainfall,
      completeAccumulatedRainfall
    }
  },

  constructChart: (completeRainfall, completeAccumulatedRainfall, plotBandStart, plotBandEnd, stationID) => {
    return {
        title: {
            text: '30-day moving cumulative total rainfall in ' + stationID 
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false
            }
          },
          series: {
            allowPointSelect: true,
            point: {
              events: {
                select: function(e) {
                }
              }
            }
          }
        },
        yAxis: [
          {
            title: {
              text: 'Millimeters of Rain',
              style: {
                fontWeight: 'bold'
              }
            },
            labels: {
              format: '{value}',
              style: {
                color: '#0066cc',
                fontWeight: 'bold'
              }
            },
            plotLines: [{
              color: 'green',
              width: 2,
              value: 200,
              label: {
                  align: 'right',
                  style: {
                      fontStyle: 'italic'
                  },
                  text: 'Rice Threshold',
                  x: -10
              },
              zIndex: 4
            },
            {
              color: 'orange',
              width: 2,
              value: 100,
              label: {
                  align: 'right',
                  style: {
                      fontStyle: 'italic'
                  },
                  text: 'Corn Threshold',
                  x: -10
              },
              zIndex: 4
            }
            ]
          }
        ],
        xAxis: [
          {
            labels: {
              formatter: function () {
                var s = Highcharts.dateFormat('%e %b', new Date(this.value + (new Date).getTimezoneOffset()));

                return s;
              }
            },

            plotBands: [{
              color: '#FCFFC5',
              from: plotBandStart,
              to: plotBandEnd,
              label: {
                text: '6-Day Forecast',
                align: 'center',
                style: {
                  fontWeight: 'bold',
                  color: '#707070'
                }
              }
            }],
          }
        ],
        series: [{
            type: 'column',
            name: 'Rainfall',
            data: completeRainfall
        }, {
            type: 'line',
            name: 'Accumulated Rainfall',
            data: completeAccumulatedRainfall
        }],

        tooltip: {
          borderColor: '#cccccc',
          formatter: function( ) {
            var s = '<b>' + Highcharts.dateFormat('%e %b', new Date(this.x)) + '</b>';

            s += '<br />' + this.points[0].series.name + ': ' + this.points[0].y + ' mm';
            s += '<br />' + this.points[1].series.name + ': ' + this.points[1].y + ' mm';


            // $.each(this.points, function () {
            //     s += '<br/>' + this.series.name + ': ' + this.y + 'm';
            // });

            return s;
          },
          shared: true
        }
    }
  },

  stripTitle: (title) => {
    let result = title

    result = result.replace('SARAI', '')
    result = result.replace('(UPLB)', '')
    result = result.replace('WFP', '')
    result = result.replace('WPU', '')
    result = result.replace('APN', '')

    return result
  },

  getTotal: (data) => {
    let total30 = 0
    let total10 = 0

    let counter = 0

    data.forEach(function(element, index) {
      total30 += element.data.rainfall

      if (counter < 10) { // 10 Days
        total10 += element.data.rainfall

        counter++
      }
    })

    total10 = Math.round(total10 * 10) / 10
    total30 = Math.round(total30 * 10) / 10

    return [total10, total30]
  }
}