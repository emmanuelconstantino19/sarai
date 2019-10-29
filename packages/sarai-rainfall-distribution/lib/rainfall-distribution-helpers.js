Meteor.RainfallDistribution = {

  // ************** for twenty days ************** //
  // creation of array of dates and rainfall
  fillMissingEntriesForTwenty: (cumulativeDataForTwenty, raw_date) => {
    let twentyDaysAgo = new Date(raw_date)
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20)
    twentyDaysAgo.setHours(0,0,0,0)

    let dateToday = new Date()
    dateToday.setDate(dateToday.getDate() - 1)

    // Get the dates already part of 10-day forecast or historical rainfall to avoid overlapping of dates
    let diffDays
    if(dateToday < raw_date){
      diffDays = raw_date.getDate() - dateToday.getDate() - 1
    }else{
      diffDays = 0
    }

    //Create array to hold the fixed data (full of empty entries first)
    let fixedData = []

    for (let a = 0; a < (20-diffDays); a++) {
      let d = new Date(raw_date)
      d.setDate(d.getDate() - (20 - a))
      d.setHours(0,0,0,0)

      const entry = {
        data: {
          rainfall: 0
        },
        dateUTC: d
      }
      fixedData.push(entry)
    }


    let b = 0 //counter for existing data in cumulativeDataForTwenty array

    for (let a = 0; a < (20-diffDays); a++) {
      if (cumulativeDataForTwenty[b] && fixedData[a].dateUTC.getTime() == cumulativeDataForTwenty[b].dateUTC.getTime()) {
        //found date match in retrieved weather data

        fixedData[a].data.rainfall = cumulativeDataForTwenty[b].data.rainfall

        b+=1
      }
    }

    return fixedData
  },
  // ******************************************** //

  getWeeklyRainfall(cumulativeData) {
    let pastWeeklyRainfall = []
    let totalWeeklyRainfall = 0
    let counter = 0

    for (let entry of cumulativeData) {
      if (counter<7){
        totalWeeklyRainfall += entry.data.rainfall
        counter++
      }else{
        pastWeeklyRainfall.push(Math.round(totalWeeklyRainfall * 10) / 10)
        totalWeeklyRainfall = 0
        totalWeeklyRainfall += entry.data.rainfall
        counter = 1
      }
    }
    return {
      pastWeeklyRainfall
    }
  },

  getHistoricalRainfall: (date_first_historical, date_last_historical, historicalDailyRainData, runningForecastTotal, runningForecastTotalWithTwenty) => {
    let pastHistoricalRain = []
    
    let pastHistoricalAccRain = []
    let totalRainfall = runningForecastTotal

    let pastHistoricalAccRainWithTwenty = []
    let totalRainfallWithTwenty = runningForecastTotalWithTwenty
    
    let counter = 0

    for (let entry of historicalDailyRainData) {
      if((date_first_historical <= entry.dailyRain.dateUTC) && (entry.dailyRain.dateUTC <= date_last_historical)){
        totalRainfall += entry.dailyRain.rainfall
        totalRainfallWithTwenty += entry.dailyRain.rainfall

        pastHistoricalRain.push({ x: entry.dailyRain.dateUTC, y: entry.dailyRain.rainfall})
        pastHistoricalAccRain.push({ x: entry.dailyRain.dateUTC, y: Math.round(totalRainfall * 10) / 10})
        pastHistoricalAccRainWithTwenty.push({ x: entry.dailyRain.dateUTC, y: Math.round(totalRainfallWithTwenty * 10) / 10})
        counter++
      }
    }
    let finalPastHistoricalAccRain = pastHistoricalAccRain[counter-1].y
    let finalPastHistoricalAccRainWithTwenty = pastHistoricalAccRainWithTwenty[counter-1].y

    const plot_first_historical = new Date()
    plot_first_historical.setDate(date_first_historical.getDate()+0.35)
    const plot_last_historical = date_last_historical
    plot_last_historical.setDate(plot_last_historical.getDate())

    return {
      plot_first_historical,
      plot_last_historical,
      pastHistoricalRain,
      pastHistoricalAccRain,
      pastHistoricalAccRainWithTwenty,
      finalPastHistoricalAccRain,
      finalPastHistoricalAccRainWithTwenty
    }
  },

  assembleHistoricalRainfallData: (pastRain, pastAcc, pastAccWithTwenty, forecastRain, forecastAcc, forecastAccWithTwenty, historicalRain, historicalAcc, historicalAccWithTwenty) => {

    const completeRainfall = pastRain.concat(forecastRain).concat(historicalRain)
    const completeAccumulatedRainfall = pastAcc.concat(forecastAcc).concat(historicalAcc)

    const completeAccumulatedRainfallWithTwenty = pastAccWithTwenty.concat(forecastAccWithTwenty).concat(historicalAccWithTwenty)

    return {
      completeRainfall,
      completeAccumulatedRainfall,
      completeAccumulatedRainfallWithTwenty
    }
  },

  constructHistoricalChart: (completeRainfall, completeAccumulatedRainfall, completeAccumulatedRainfallWithTwenty, plotBandStart, plotBandEnd, plotFirstHistorical, plotLastHistorical) => {
    
    return {
        title: {
            text: '20-day rainfall + 10-day forecast + historical rainfall<br/>30-day rainfall + 10-day forecast + historical rainfall'
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
        credits: {
          enabled: false
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
                text: '10-day <br /> weather <br /> forecast',
                align: 'center',
                style: {
                  fontWeight: 'bold',
                  color: '#707070'
                }
              }
            },
            {
              color: '#faffa0',
              from: plotFirstHistorical,
              to: plotLastHistorical,
              label: {
                text: 'Historical <br /> average <br /> daily <br /> rainfall',
                align: 'center',
                style: {
                  fontWeight: 'bold',
                  color: '#707070'
                }
              }
            }
            ],
          }
        ],
        series: [{
            type: 'column',
            name: 'Daily rainfall',
            data: completeRainfall
        }, {
            type: 'line',
            name: '30-day cumulative rainfall (for rice)',
            data: completeAccumulatedRainfall
        }, {
            type: 'line',
            name: '20-day cumulative rainfall (for corn)',
            data: completeAccumulatedRainfallWithTwenty
        }],

        tooltip: {
          borderColor: '#cccccc',
          formatter: function( ) {
            var s = '<b>' + Highcharts.dateFormat('%e %b %Y', new Date(this.x)) + '</b>';

            s += '<br />' + this.points[0].series.name + ': ' + this.points[0].y + ' mm';
            
            if(this.points[1] != undefined){
              s += '<br />' + this.points[1].series.name + ': ' + this.points[1].y + ' mm';
            }
            
            if(this.points[2] != undefined){
              s += '<br />' + this.points[2].series.name + ': ' + this.points[2].y + ' mm';
            }

            // $.each(this.points, function () {
            //     s += '<br/>' + this.series.name + ': ' + this.y + 'm';
            // });

            return s;
          },
          shared: true
        }
    }
  },

  constructChartOfRainfallDistribution: (weekly_rainfall, weekly_maxtemp, weekly_mintemp, weekly_rainfall_16) => {
    return {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: false
            }
          },
          areaspline: {
            marker: {
              enabled: false
            }
          }
        },
        credits: {
          enabled: false
        },
        xAxis: [{
            categories: ['Jan 1-7', 'Jan 8-14', 'Jan 15-21',  'Jan 22-28',  'Jan 29-Feb 4', 'Feb 5-11', 'Feb 12-18',  'Feb 19-25',  'Feb 26-Mar 3', 'Mar 4-10', 'Mar 11-17',  'Mar 18-24',  'Mar 25-31', 'Apr 1-7',  'Apr 8-14', 'Apr 15-21',  'Apr 22-28',  'Apr 29-May 5', 'May 6-12', 'May 13-19', 'May 20-26',  'May 27-June 2',  'June 3-9', 'June 10-16', 'June 17-23', 'June 24-30', 'July 1-7', 'July 8-14',  'July 15-21', 'July 22-28', 'July 29-Aug 4',  'Aug 5-11', 'Aug 12-18',  'Aug 19-25', 'Aug 26-Sept 1',  'Sept 2-8', 'Sept 9-15',  'Sept 16-22', 'Sept 23-29', 'Sept 30-Oct 6',  'Oct 7-13', 'Oct 14-20',  'Oct 21-27', 'Oct 28-Nov 03', 'Nov 04-10', 'Nov 11-17', 'Nov 18-24', 'Nov 25-Dec 01', 'Dec 02-08', 'Dec 09-15', 'Dec 16-22', 'Dec 23-31'],
            title: {
                text: 'Week'
            },
            crosshair: true
        }],
        yAxis: [
        { // Primary yAxis
            labels: {
                format: '{value}mm',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Rainfall (mm)',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        },
        { // Secondary yAxis
            title: {
                text: 'Temperature (°C)',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} °C',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            // layout: 'vertical',
            // align: 'left',
            // x: 710,
            // verticalAlign: 'top',
            // y: 0,
            // floating: true,
            // backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0
        },
        series: [
        {
            name: 'Weekly average total rainfall',
            type: 'areaspline',
            data: weekly_rainfall[0].weekly_rainfall,
            tooltip: {
                valueSuffix: ' mm'
            },
            color: '#fcb65f' 

        },
        // {
        //     name: '2016 weekly total rainfall',
        //     type: 'column',
        //     // data: [9.5,0,1.2,2.2,5.1,8.8,0,17.7,14.3,0,0,0,2,2.2,1.2,10.8,10.8,21.8,0,29.1,16.1,1.7,4.6,21.7,58.3,32.2,34.2,47.9,8.4,41.29,9.2,103.8,88.7,52.2,0,23.4,107,98.6,72.8,8.2,36.6,71.2,92.2,7.3],
        //     // data: [0,0,1.5,2.9,4.3,9.6,0,10.4,21.7,0,0,0,2.4,3.5,0,8.4,0.8,15,0,59.4,4.7,4.2,18.3,21.4,76.1,39.6,47.7,55.4,11.1,34.6,10.1,70.6,71.7,53.9,1.3,22.8,79.2,95.5,57.2,28.4,118.1,49.4,14.5,95.6,35.9],
        //     data: weekly_rainfall_16,
        //     tooltip: {
        //         valueSuffix: ' mm'
        //     },
        //     color: '#46c446'
        // },
        {
            name: 'Average maximum temperature',
            type: 'spline',
            yAxis: 1,
            data: weekly_maxtemp[0].weekly_maxtemp,
            tooltip: {
                valueSuffix: '°C'
            },
            color: '#336d04'
        },
        {
            name: 'Average minimum temperature',
            type: 'spline',
            yAxis: 1,
            data: weekly_mintemp[0].weekly_mintemp,
            tooltip: {
                valueSuffix: '°C'
            },
            color: '#042ae5'
        }
        ]
    }
  },

  stripTitle2: (title) => {
    let result = title

    result = result.replace('SARAI', '')
    result = result.replace('(UPLB)', '')
    result = result.replace('WFP', '')
    result = result.replace('WPU', '')
    result = result.replace('APN', '')

    return result
  },


// creation of array of dates and rainfall
  fillMissingEntries: (cumulativeData, raw_date) => {
    let oneMonthAgo = new Date(raw_date)
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)
    oneMonthAgo.setHours(0,0,0,0)

    let dateToday = new Date()
    dateToday.setDate(dateToday.getDate() - 1)

    // Get the dates already part of 10-day forecast or historical rainfall to avoid overlapping of dates
    let diffDays
    if(dateToday < raw_date){
      diffDays = raw_date.getDate() - dateToday.getDate() - 1
    }else{
      diffDays = 0
    }

    //Create array to hold the fixed data (full of empty entries first)
    let fixedData = []

    for (let a = 0; a < (30-diffDays); a++) {
      let d = new Date(raw_date)
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


    let b = 0 //counter for existing data in cumulativeData array

    for (let a = 0; a < (30-diffDays); a++) {
      if (cumulativeData[b] && fixedData[a].dateUTC.getTime() == cumulativeData[b].dateUTC.getTime()) {
        //found date match in retrieved weather data

        fixedData[a].data.rainfall = cumulativeData[b].data.rainfall

        b+=1
      }
    }

    return fixedData
  },

  getPastRainfall(cumulativeData) {
    let pastRainfall = []
    let pastAccRainfall = []
    let totalRainfall = 0

    for (let entry of cumulativeData) {
      totalRainfall += entry.data.rainfall

      pastRainfall.push({ x: entry.dateUTC, y: entry.data.rainfall})
      pastAccRainfall.push({ x: entry.dateUTC, y: Math.round(totalRainfall * 10) / 10})
    }

    return {
      pastRainfall,
      pastAccRainfall
    }
  },

  getForecast: (forecast, runningTotal, runningTotalForTwenty) => {
    const dailyRecords = forecast.forecast.simpleforecast.forecastday
    let forecastRainfall = []
    let forecastAccumulated = []
    let forecastAccumulatedWithTwenty = []
    let total = runningTotal
    let totalWithTwenty = runningTotalForTwenty

    for (let entry of dailyRecords) {
      const utcDate = Date.UTC(entry.date.year, entry.date.month - 1, entry.date.day);
      total += entry.qpf_allday.mm,
      totalWithTwenty += entry.qpf_allday.mm,

      forecastRainfall.push({ x: utcDate, y: entry.qpf_allday.mm})
      forecastAccumulated.push({ x: utcDate, y: total})

      forecastAccumulatedWithTwenty.push({ x: utcDate, y: totalWithTwenty})
    }
    const firstEntry = dailyRecords[0]
    const lastEntry = dailyRecords[9]
    const plotBandStart = Date.UTC(firstEntry.date.year, firstEntry.date.month - 1, firstEntry.date.day)
    const plotBandEnd = Date.UTC(lastEntry.date.year, lastEntry.date.month - 1, lastEntry.date.day)

    return {
      forecastRainfall,
      forecastAccumulated,
      forecastAccumulatedWithTwenty,
      plotBandStart,
      plotBandEnd
    }
  },

  assembleRainfallData: (pastRain, pastAcc, pastAccWithTwenty, forecastRain, forecastAcc, forecastAccWithTwenty) => {

    const completeRainfall = pastRain.concat(forecastRain)
    const completeAccumulatedRainfall = pastAcc.concat(forecastAcc)

    const completeAccumulatedRainfallWithTwenty = pastAccWithTwenty.concat(forecastAccWithTwenty)

    return {
      completeRainfall,
      completeAccumulatedRainfall,
      completeAccumulatedRainfallWithTwenty
    }
  },

  constructChart: (completeRainfall, completeAccumulatedRainfall, completeAccumulatedRainfallWithTwenty, plotBandStart, plotBandEnd) => {
    return {
        title: {
            text: '20-day rainfall + 10-day forecast<br/>30-day rainfall + 10-day forecast'
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
        credits: {
          enabled: false
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
                text: '10-day <br /> weather <br /> forecast',
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
            name: 'Daily rainfall',
            data: completeRainfall
        }, {
            type: 'line',
            name: '30-day cumulative rainfall (for rice)',
            data: completeAccumulatedRainfall
        }, {
            type: 'line',
            name: '20-day cumulative rainfall (for corn)',
            data: completeAccumulatedRainfallWithTwenty
        }],

        tooltip: {
          borderColor: '#cccccc',
          formatter: function( ) {
            var s = '<b>' + Highcharts.dateFormat('%e %b %Y', new Date(this.x)) + '</b>';
            
            s += '<br />' + this.points[0].series.name + ': ' + this.points[0].y + ' mm';
            
            if(this.points[1] != undefined){
              s += '<br />' + this.points[1].series.name + ': ' + this.points[1].y + ' mm';
            }
            
            if(this.points[2] != undefined){
              s += '<br />' + this.points[2].series.name + ': ' + this.points[2].y + ' mm';
            }

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
  
  constructChartPast: (completeRainfall, completeAccumulatedRainfall, completeAccumulatedRainfallWithTwenty) => {
    return {
        title: {
            text: '30-day rainfall and 20-day rainfall'
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
        credits: {
          enabled: false
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
            }
          }
        ],
        series: [{
            type: 'column',
            name: 'Daily rainfall',
            data: completeRainfall
        }, {
            type: 'line',
            name: '30-day cumulative rainfall (for rice)',
            data: completeAccumulatedRainfall
        }, {
            type: 'line',
            name: '20-day cumulative rainfall (for corn)',
            data: completeAccumulatedRainfallWithTwenty
        }],

        tooltip: {
          borderColor: '#cccccc',
          formatter: function( ) {
            var s = '<b>' + Highcharts.dateFormat('%e %b %Y', new Date(this.x)) + '</b>';

            s += '<br />' + this.points[0].series.name + ': ' + this.points[0].y + ' mm';
            
            if(this.points[1] != undefined){
              s += '<br />' + this.points[1].series.name + ': ' + this.points[1].y + ' mm';
            }

            if(this.points[2] != undefined){
              s += '<br />' + this.points[2].series.name + ': ' + this.points[2].y + ' mm';
            }

            // $.each(this.points, function () {
            //     s += '<br/>' + this.series.name + ': ' + this.y + 'm';
            // });

            return s;
          },
          shared: true
        }
    }
  },
}