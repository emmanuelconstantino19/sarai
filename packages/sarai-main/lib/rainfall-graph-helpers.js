Meteor.RainfallGraph = {

  constructChart: (place,values) => {
    console.log('Construct Rainfall Graph chart');
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
                  categories: ['February', 'March', 'April', 'May', 'June', 'July'],
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