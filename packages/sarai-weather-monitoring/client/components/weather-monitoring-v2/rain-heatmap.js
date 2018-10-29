Template.RainHeatmap.onCreated(() => {
  Meteor.subscribe('sarai-weather-stations')
})

Template.RainHeatmap.onRendered(() => {
  $('#rain-heatmap').highcharts(
    {
      data: {
        csv: document.getElementById('rain-heatmap-data').innerHTML
      },

      chart: {
        type: 'heatmap',
        // margin: [60, 10, 80, 50]
        marginLeft: 100
      },

      boost: {
          useGPUTranslations: true
      },

      title: {
          text: 'Rainfall by day',
          align: 'left',
          x: 40
      },

      subtitle: {
          text: '2016-2017',
          align: 'left',
          x: 40
      },

      xAxis: {
          title: {
            text: 'Date'
          },
          type: 'datetime',
          min: Date.UTC(2016, 0, 1),
          max: Date.UTC(2017, 4, 1),
          labels: {
              align: 'left',
              x: 5,
              y: 14,
              format: '{value:%B}' // long month
          },
          showLastLabel: false,
          tickLength: 16
      },

      yAxis: {
        labels: {
          rotation: -40
        },
        title: {
          text: 'Location'
        },
        categories: [
      'PCA, San Ramon, Zamboanga',
      'BUCAF, Albay, Bicol',
      'ISU, Echague, Isabela',
      'ISU, Cabagan, Isabela',
      'IPB, Bay Laguna',
      'DA-QAES, Tiaong, Quezon',
      'CLSU, Muñoz, Nueva Ecija',
      'CTU, Barili, Cebu',
      'SPAMAST, Matanao, Davao del Sur',
      'WPU, Aborlan, Palawan',
      'MinSCAT, Victoria, Oriental Mindoro',
      'PhilRice, Sta. Cruz, Occidental Mindoro',
      'USTP, Claveria, Misamis Oriental',
      'CMU, Maramag, Bukidnon',
      'UPLBCA-LGRTS La Carlota, Negros Occidental',
      'WVSU, Lambunao, Iloilo']
      },

      colorAxis: {
          stops: [
              // [0, '#FFFFFF'],
              // [0.1, '#E5E5F3'],
              // [0.2, '#C6C7E4'],
              // [0.3, '#AAABD7'],
              // [0.4, '#8E8FCA'],
              // [0.5, '#7173BD'],
              // [0.6, '#5557B0'],
              // [0.7, '#393BA3'],
              // [0.8, '#1D1F96'],
              // [0.9, '#010389']
              [0, '#CFCFCF'],
              [0.1, '#B8B8C7'],
              [0.2, '#A1A1BF'],
              [0.3, '#8A8BB7'],
              [0.4, '#7374AF'],
              [0.5, '#5C5DA8'],
              [0.6, '#4547A0'],
              [0.7, '#2E3098'],
              [0.8, '#171990'],
              [0.9, '#010389']
          ],
          min: 0,
          max: 200,
          startOnTick: false,
          endOnTick: false,
          labels: {
              format: '{value} mm'
          }
      },

      series: [{
          boostThreshold: 100,
          borderWidth: 0,
          nullColor: '#EFEFEF',
          colsize: 24 * 36e5, // one day
          // tooltip: {
          //     headerFormat: 'Rainfall<br/>',
          //     pointFormat: '{point.fullCategory} {point.x:%e %b %Y} <b>{point.value} ℃</b>',
          //     useHTML: true
          // },
          turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
      }],

      tooltip: {
        formatter: function() {
          // {point.x:%e %b %Y}
          var s = '<b>Rainfall</b> in <b>'  + this.series.yAxis.categories[this.point.y] + '</b><br>on ' + Highcharts.dateFormat('%e %b %Y', new Date(this.point.x)) + ': <b>' + this.point.value + ' mm</b>'

          return s
        }
      }


    }

  )
})

Template.RainHeatmap.helpers({
  stations: () => {
    const stations = WeatherStations.find({}).fetch()

    return stations
  }
})