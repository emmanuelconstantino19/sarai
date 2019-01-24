Meteor.DroughtMapChart = {

	constructChart: (data, title) => {
    console.log('Construct Drought Map Chart');
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
                          to:-2.01,
                          color:'red'  
                      },
                      {
                          from:-1,
                          to:-0.51,
                          color:'yellow'
                      },{
                          from:-2,
                          to:-1.01,
                          color:'orange'
                      },{
                          from: -0.5,
                          color: '#FAFAFA'
                      }
                      ]
              },
              series: [{
                  data: data,
                  keys: ['name', 'value'],
                  joinBy: 'name',
                  name: 'Drought Index',
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