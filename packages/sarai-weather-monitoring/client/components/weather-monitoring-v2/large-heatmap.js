Template.LargeHeatmap.onCreated(() => {
  Meteor.subscribe('sarai-weather-stations')
})

Template.LargeHeatmap.onRendered(() => {
  $('#year-heatmap').highcharts(
    {
      data: {
        csv: document.getElementById('year-heatmap-data').innerHTML
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
    'IAMBOAN4',
    'IBICOLGU2',
    'ICAGAYAN2',
    'ICAGAYAN3',
    'ICALABAR18',
    'ICALABAR25',
    'ICENTRAL91',
    'ICENTRAL94',
    'IDAVAORE19',
    'IMIMAROP6',
    'IMIMAROP7',
    'IMIMAROP8',
    'INORTHER86',
    'INORTHER117',
    'IWESTERN596',
    'IWESTERN635']
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

    tooltip: {
      headerFormat: 'Temperature<br/>',
      pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
    },

    series: [{
        boostThreshold: 100,
        borderWidth: 0,
        nullColor: '#EFEFEF',
        colsize: 24 * 36e5, // one day
        tooltip: {
            headerFormat: 'Temperature<br/>',
            pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
        },
        turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
    }]


    }

  )
})

Template.LargeHeatmap.helpers({
  stations: () => {
    const stations = WeatherStations.find({}).fetch()

    return stations
  }
})