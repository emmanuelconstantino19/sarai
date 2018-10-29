Template.TemperatureHeatmap.onCreated(() => {
  Meteor.subscribe('sarai-weather-stations')
})

Template.TemperatureHeatmap.onRendered(() => {
  $('#temp-heatmap').highcharts(
    {
      data: {
        csv: document.getElementById('temp-heatmap-data').innerHTML
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
        text: 'Temperature variation by day',
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
        // title: {
        //     text: null
        // },
        // labels: {
        //     format: '{value}:00'
        // },
        // minPadding: 0,
        // maxPadding: 0,
        // startOnTick: false,
        // endOnTick: false,
        // tickPositions: [0, 6, 12, 18, 24],
        // tickWidth: 1,
        // min: 0,
        // max: 23,
        // reversed: true
    },

    colorAxis: {
        stops: [
            // [0, '#3060cf'],
            [0, '#FFFFFF'],
            [0.1, '#4B74D1'],
            [0.2, '#5F81CF'],
            [0.3, '#EDE5C2'],
            [0.4, '#E3D28A'],
            [0.5, '#D9C057'],
            [0.6, '#E38424'],
            [0.7, '#D67813'],
            [0.8, '#CF601B'],
            [0.9, '#DE5804'],
            [1, '#c4463a']
        ],
        min: 0,
        max: 50,
        startOnTick: false,
        endOnTick: false,
        labels: {
            format: '{value}℃'
        }
    },

    series: [{
        boostThreshold: 100,
        borderWidth: 0,
        nullColor: '#EFEFEF',
        colsize: 24 * 36e5, // one day
        // tooltip: {
        //     headerFormat: 'Temperature<br/>',
        //     pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>',
        //     useHTML: true
        // },
        turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
    }],

    tooltip: {
        formatter: function() {
          // {point.x:%e %b %Y}
          var s = '<b>Average Temperature</b> in <b>'  + this.series.yAxis.categories[this.point.y] + '</b><br>on ' + Highcharts.dateFormat('%e %b %Y', new Date(this.point.x)) + ': <b>' + this.point.value + '℃</b>'

          return s
        }
      }


    }

  )
})

Template.TemperatureHeatmap.helpers({
  stations: () => {
    const stations = WeatherStations.find({}).fetch()

    return stations
  }
})