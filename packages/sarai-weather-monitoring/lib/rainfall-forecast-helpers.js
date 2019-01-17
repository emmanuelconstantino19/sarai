Meteor.RainfallForecast = {
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

  constructChart: (graphData,tenday) => {
  console.log("Construct chart")
  console.log(graphData)
  return{
   chart: {
        type: 'column'
    },
    title: {
        text: '10-Day Rainfall Forecast'
    },
    xAxis: {
        categories: tenday,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Rainfall (mm)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: graphData 
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