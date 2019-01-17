Meteor.chartHelpers = {
    getPlotLines : (ticks) => {
      let plotLines = []

      ticks.forEach((element, index) => {
        plotLines.push({
          color: '#bfbfbf',
          width: 1,
          value: element
        })
      })

      return plotLines
    },

    featureURI: (features) => {
      let result = ''

      features.forEach((element, index) => {
        result += '/'
        result += element
      })

      return result
    },

    getDailySeries: (data) => {
      let qpf = []
      let hlTemp = []

      for (let entry of data.forecast.simpleforecast.forecastday) {
        qpf.push(entry.qpf_allday.mm)
        hlTemp.push([entry.low.celsius, entry.high.celsius])
      }

      const dailySeries = {
        qpf,
        hlTemp
      }

      return dailySeries
    },

    getHourlySeries: (data) => {
      let temp = []
      let pop = []
      let windSpd = []

      const forecast = data.hourly_forecast


      for (let entry of forecast) {

        const ftc = entry.FCTTIME;
        const utcDate = Date.UTC(ftc.year, ftc.mon-1, ftc.mday, ftc.hour);

        temp.push([utcDate, parseInt(entry.temp.metric)])
        pop.push([utcDate, parseInt(entry.pop)])
        windSpd.push([utcDate, parseInt(entry.wspd.metric)])
      }

      const result = {
        temp,
        pop,
        windSpd
      }

      return result
    },

    getTickPositions: (data) => {
      const df = data.forecast.simpleforecast.forecastday

      const tickPositions = [];
      let year = 0;
      let month = 0;
      let day = 0;

      for (let entry of df) {
        const date = entry.date;
        year = date.year;
        month = date.month - 1;
        day = date.day;

        tickPositions.push(Date.UTC(year, month, day, 0))
      }

      const nextDay = day < 31 ? day + 1 : 1
      tickPositions.push(Date.UTC(year, month, nextDay, 0));

      return tickPositions;
    },

    getAltTickPositions: (data) => {
      const df = data.forecast.simpleforecast.forecastday
      const altTickPositions = [];
      let year = 0;
      let month = 0;
      let day = 0;

      for (let entry of df) {
        const date = entry.date;
        year = date.year;
        month = date.month - 1;
        day = date.day;

        altTickPositions.push(Date.UTC(year, month, day, 12))
      }

      const nextDay = day < 31 ? day + 1 : 1
      altTickPositions.push(Date.UTC(year, month, nextDay, 12));

      return altTickPositions;
    },

    getRainAltTickPositions: (data) => {
      const rainAltTickPositions = []

      for (let entry of data.forecast.simpleforecast.forecastday) {
        // rainAltTickPositions.push()
      }
    },

    getTickQPFMap: (ticks, qpf) => {
      let tickQPFMap = {}

      for (let a = 0; a < ticks.length - 1; a++) {
        if(qpf[a] == '0'){
          qpf[a] = '< 1';
        }
        tickQPFMap[ticks[a]] = qpf[a] + ' mm'
      }

      return tickQPFMap
    },

    getTickTempMap: (ticks, temp) => {
      let tickTempMap = {}

      for (let a = 0; a < ticks.length - 1; a++) {
        tickTempMap[ticks[a]] = '<span style="color: #0853a8;">' + temp[a][0] + '°</span> | <span style="color: #ea7c0e;">' + temp[a][1] + '°</span>'
      }

      return tickTempMap
    },

    constructChart: (chart) => {
      let chartOptions = {
        chart: {
          marginLeft: 50,
          marginRight: 30,
          // marginTop: 25,
          height: 200
        },

        legend: {
          enabled: false
        },

        title: {
          text: chart.title,
          align: 'left',
          margin: 0,
          x: 30
        },

        xAxis: [
          {

            crosshair: true,
            tickPositions: chart.tickPositions,
            tickPosition: 'inside',
            // opposite: true,
            events: {
              setExtremes: function syncExtremes(e) {
                var thisChart = this.chart
                if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
                  Highcharts.each(Highcharts.charts, function (chart) {
                    if (chart !== thisChart) {
                      if (chart.xAxis[0].setExtremes) { // It is null while updating
                        chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                      }
                    }
                  });
                }
              }
            },
            labels: {
              enabled: false
            },
            plotLines: chart.plotLines
          },

          {
            tickPositions: chart.altTickPositions, //chart.atpEnabled ? altTickPositions : null,
            opposite: true,
            tickWidth: 0,
            labels: {
              formatter: function () {
                var altTickLabels = chart.altTickLabels[this.value.toString()]
                altTickLabels = (altTickLabels == undefined) ? '' : altTickLabels

                var d = chart.dateTicksEnabled ? Highcharts.dateFormat('%e %b', new Date(this.value)) : ''

                var label =  d + '<br/>' + altTickLabels

                return label
              }
            },
            linkedTo: 0
          }

        ],

        yAxis: {
          labels: {
            format: '{value}' + chart.unit,
            style: {
                // color: '#ff1a1a',
                fontWeight: 'bold'
            }
          },
        },

        series: [{
          name: chart.name,
          id: chart.id,
          data: chart.data,
          type: 'spline',
          color: chart.color,
          tooltip: {
              valueDecimals: 0
          }
        }],

        tooltip: {
          formatter: function () {
            let s = '<b>' + Highcharts.dateFormat('%e %b - %H:00', new Date(this.x)) + '</b>';

            s += '<br />' + this.series.name + ': ' + this.y + chart.unit;
            return s;
          }
        }

      }

      // if (chart.atpEnabled) {

      //   chartOptions.xAxis[1][tickPositions] = altTickPositions
      // }

      return chartOptions
    },

    getXAxis: () => {

    }

}