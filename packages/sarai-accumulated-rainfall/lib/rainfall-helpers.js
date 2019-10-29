Meteor.Rainfall = {
  fillMissingEntries: (weatherData) => {
    let oneMonthAgo = new Date()
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)
    oneMonthAgo.setHours(0,0,0,0)

    //Create array to hold the fixed data (full of empty entries first)
    let fixedData = []

    for (let a = 0; a < 30; a++) {
      let d = new Date()
      d.setDate(d.getDate() - (30 - a))
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

    for (let a = 0; a < 30; a++) {
      if (weatherData[b] && fixedData[a].dateUTC.getTime() == weatherData[b].dateUTC.getTime()) {
        //found date match in retrieved weather data

        fixedData[a].data.rainfall = weatherData[b].data.rainfall

        b+=1
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

  getForecast: (forecast, runningTotal) => {
    const dailyRecords = forecast.forecast.simpleforecast.forecastday

    let forecastRainfall = []
    let forecastAccumulated = []
    let total = runningTotal

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
    }
  },

  assembleRainfallData: (pastRain, pastAcc, forecastRain, forecastAcc) => {

    const completeRainfall = pastRain.concat(forecastRain)
    const completeAccumulatedRainfall = pastAcc.concat(forecastAcc)

    return {
      completeRainfall,
      completeAccumulatedRainfall
    }
  },

  constructChart: (completeRainfall, completeAccumulatedRainfall, plotBandStart, plotBandEnd) => {
    return {
        title: {
            text: '30-day rainfall + 10-day forecast'
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
            }
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
                text: '10-Day Forecast',
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
  }
}