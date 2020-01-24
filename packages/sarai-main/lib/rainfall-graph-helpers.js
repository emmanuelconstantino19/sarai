Meteor.RainfallGraph = {

  constructChart: (place,values) => {
    return {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'Monthly Rainfall Data'
              },
              subtitle: {
                  text: place
              },
              xAxis: {
                  categories: ['January','February','March','April','May'],
                  title: {
                      text: null
                  },
                  crosshair: true
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'Amount of Rainfall (millimeters)',
                      align: 'high'
                  },
                  labels: {
                      overflow: 'justify'
                  }
              },
              tooltip: 
              { 
                enabled: false 
              },
              plotOptions: {
                  column: {
                      dataLabels: {
                          enabled: true
                      },
                      pointPadding: 0.2,
                      borderWidth: 0
                  }
              },
              legend: {
                  enabled: true
              },
              credits: {
                  enabled: false
              },
              series: [{
                  name: place,
                  data: values

              }]
          }
        }
}