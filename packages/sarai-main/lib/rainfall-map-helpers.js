Meteor.RainfallMapChart = {

	constructChart: (data, title) => {
    console.log('Construct Rainfall Map Chart');
    return {
              chart: {
                  map: 'countries/ph/ph-all',
              },

              title: {
                  text: title
              },

              mapNavigation: {
                  enabled: false,
                  buttonOptions: {
                      verticalAlign: 'bottom'
                  }
              },

              colorAxis: {
                  dataClasses: [{
                          to: 50,
                          color: '#e1e1e1'
                      },{
                          from:51,
                          to:100,
                          color:'#bee8ff'
                      },{
                          from:101,
                          to:200,
                          color:'#00c5ff'
                      },{
                          from:201,
                          to:300,
                          color:'#0070ff'  
                      },{
                          from:301,
                          to:400,
                          color:'#004da8'  
                      },{
                          from:401,
                          to:500,
                          color:'#002673'  
                      },{
                          from:501,
                          color:'#000000'  
                      }
                      ]
              },
              series: [{
                  data: data,
                  keys: ['name', 'value'],
                  joinBy: 'name',
                  name: 'Amount of Rainfall (millimeters)',
                  states: {
                      hover: {
                          color: '#FFFFFF'
                      }
                  },
                  dataLabels: {
                      enabled: false,
                      format: '{point.name}'
                  }
              }]
          }
      }
}