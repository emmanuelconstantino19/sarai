Template.DroughtOutlookView.onCreated(() => {
  Meteor.subscribe('regions')
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna and Los Baños
  Session.set('province2', 'Laguna')
})

Template.DroughtOutlookView.onRendered(() => {
  const province = Session.get('province2')
  $('#preview-select-province').val(province)
})

Template.DroughtOutlookView.events({
  'change #preview-select-province-drought': (e) => {
    const province = e.currentTarget.value
    Session.set('province2', province)
  },

  'click .drought-outlook-more button': () => {
    FlowRouter.go(`/drought`)
  }
})

Template.DroughtOutlookView.helpers({

  monthlyDrought: () => {
      //const region = Session.get('region')
      const province = Session.get('province2')
      const droughtOutlook = 

[
{name: 'Abra',data:[1.02,0.61,0.41,0.58,0.52,0.16]},
{name: 'Agusan del Norte',data:[-0.21,1.18,1.38,0.45,0.04,-0.13]},
{name: 'Agusan del Sur',data:[-0.22,0.16,1.52,1.02,0.53,0.23]},
{name: 'Aklan',data:[-0.82,0.17,1.09,1.07,0.5,0.16]},
{name: 'Albay',data:[-1.58,-0.68,0.09,0.95,0.65,0.55]},
{name: 'Antique',data:[0.12,0.69,0.49,0.77,0.41,-0.29]},
{name: 'Apayao',data:[-1.4,-0.93,0.4,0.31,0.07,-1.96]},
{name: 'Aurora',data:[-0.94,0.1,-1.39,-1.47,-1.48,-0.35]},
{name: 'Basilan',data:[-0.05,0.29,0.46,0.14,-0.08,-0.1]},
{name: 'Bataan',data:[1.3,0.84,1.17,1.02,-0.02,-0.64]},
{name: 'Batanes',data:[0.16,-0.82,0.33,0.26,0.74,-0.49]},
{name: 'Batangas',data:[0.29,0.69,0.65,0.17,-0.07,-0.36]},
{name: 'Benguet',data:[0.06,0.46,0.86,0.39,0.34,-0.18]},
{name: 'Biliran',data:[-0.47,-0.19,-0.11,0.55,0.85,0.23]},
{name: 'Bohol',data:[-0.54,-0.16,0.55,0.99,0.59,0.21]},
{name: 'Bukidnon',data:[-0.02,0.47,0.07,-0.01,-0.41,-1.49]},
{name: 'Bulacan',data:[0.41,0.42,0.39,0.51,-0.3,-1.28]},
{name: 'Cagayan',data:[0.01,0.68,0.17,-0.44,-0.59,-0.92]},
{name: 'Camarines Norte',data:[0.11,0.37,1.13,1.29,0.73,0.34]},
{name: 'Camarines Sur',data:[-1.69,-0.46,0.71,1.03,0.74,0.3]},
{name: 'Camiguin',data:[-0.04,0.22,1.11,0.56,0.64,-0.27]},
{name: 'Capiz',data:[-2,-0.64,-0.04,0.21,0.09,-0.19]},
{name: 'Catanduanes',data:[-0.13,-1.23,1.75,0.7,0.39,-0.08]},
{name: 'Cavite',data:[1.13,0.77,0.33,-0.28,-0.85,-1.85]},
{name: 'Cebu',data:[-1.51,-0.42,0.28,0.64,0.51,-0.1]},
{name: 'Compostela Valley',data:[-0.33,0.66,1.13,0.58,0.54,-0.53]},
{name: 'Davao del Norte',data:[-0.04,0.27,0.61,0.73,0.03,-0.46]},
{name: 'Davao del Sur',data:[0.09,-0.08,-0.04,0.04,-0.5,-0.51]},
{name: 'Davao Oriental',data:[-0.03,0.53,1.34,0.45,0.09,-0.5]},
{name: 'Dinagat Islands',data:[-0.69,0.1,0.21,-0.56,-0.29,-0.31]},
{name: 'Eastern Samar',data:[0.33,0.76,0.39,0.83,0.15,-0.41]},
{name: 'Guimaras',data:[0.16,0.86,1.15,1.11,0.37,-0.41]},
{name: 'Ifugao',data:[-0.76,0.43,0.75,0.19,-0.27,-1.06]},
{name: 'Ilocos Norte',data:[1.21,0.87,1.02,0.9,-0.09,-1.04]},
{name: 'Ilocos Sur',data:[0.76,0.82,0.45,0.02,-0.26,-1.03]},
{name: 'Iloilo',data:[-1.09,-0.08,0.16,0.33,0.01,-0.36]},
{name: 'Isabela',data:[-0.09,0.09,0.55,-0.77,-0.89,-2.58]},
{name: 'Kalinga',data:[-0.58,0.26,0.03,-0.01,-0.03,-1.35]},
{name: 'La Union',data:[1.4,1.51,1.71,1.11,0.1,-0.49]},
{name: 'Laguna',data:[-0.34,0.15,0.57,0.47,-0.05,-0.37]},
{name: 'Lanao del Norte',data:[0.31,0.73,0.73,0.55,0.34,-0.04]},
{name: 'Lanao del Sur',data:[0.04,0.98,0.82,1.09,0.21,-0.54]},
{name: 'Leyte',data:[0.87,0.52,0.43,0.91,0.44,0.28]},
{name: 'Maguindanao',data:[-0.28,-0.31,-0.55,-0.28,-0.4,-1.25]},
{name: 'Marinduque',data:[-0.62,0.23,1.1,0.98,0.7,0.09]},
{name: 'Masbate',data:[-1.75,-0.05,0.38,0.65,0.58,0.16]},
{name: 'Metropolitan Manila',data:[0.2,0.18,0.44,0.36,0.15,-0.29]},
{name: 'Misamis Occidental',data:[0.7,1.73,1.48,1.17,1.09,0.59]},
{name: 'Misamis Oriental',data:[-0.67,0.17,0.33,0.27,0.19,-0.36]},
{name: 'Mountain Province',data:[-0.86,-0.03,0.43,0.28,0.03,-1.26]},
{name: 'Negros Occidental',data:[0.17,0.57,0.57,0.58,0.22,-0.44]},
{name: 'Negros Oriental',data:[0.22,0.75,0.61,0.76,0.51,0.29]},
{name: 'North Cotabato',data:[-1.11,-1.12,-0.18,0.38,0.03,-1.47]},
{name: 'Northern Samar',data:[-0.85,-0.68,-0.22,0.34,0.1,-0.26]},
{name: 'Nueva Ecija',data:[1.27,0.72,0.42,-0.79,-0.44,-2.41]},
{name: 'Nueva Vizcaya',data:[-0.55,0.31,0.69,0.11,-0.31,-0.7]},
{name: 'Mindoro Occidental',data:[1.08,1.34,1.02,0.73,0.19,-0.59]},
{name: 'Mindoro Oriental',data:[-0.8,-0.2,0.45,0.67,0.59,0.68]},
{name: 'Palawan',data:[-1.34,0.21,0.19,0.25,0.1,-0.68]},
{name: 'Pampanga',data:[-0.97,-0.54,0.2,0.79,-0.56,-1.11]},
{name: 'Pangasinan',data:[0.77,0.54,0.33,0.45,0.17,-1.17]},
{name: 'Quezon',data:[-0.1,0.29,-0.12,0.06,0.29,0.22]},
{name: 'Quirino',data:[-0.22,-0.09,-1.11,-0.35,-0.31,-0.37]},
{name: 'Rizal',data:[0.92,0.93,0.37,-0.29,-0.04,-0.44]},
{name: 'Romblon',data:[-1.4,0.13,1.2,1.66,1.44,1.08]},
{name: 'Samar',data:[-1.46,-0.76,0.23,0.58,0.37,-0.15]},
{name: 'Sarangani',data:[-0.86,-0.41,0.44,0.57,0.2,-0.76]},
{name: 'Shariff Kabunsuan',data:[-0.4,-0.35,-0.53,-0.23,-0.07,-0.85]},
{name: 'Siquijor',data:[0.5,0.83,1.37,1.14,0.48,-0.5]},
{name: 'Sorsogon',data:[-1.17,-1.29,-0.41,0.77,0.63,0.42]},
{name: 'South Cotabato',data:[0.01,-0.2,0.66,0.77,-0.01,-0.72]},
{name: 'Southern Leyte',data:[0.94,0.72,1.38,1.2,1.18,0.52]},
{name: 'Sultan Kudarat',data:[-0.16,-0.31,0.09,0.09,-0.27,-0.45]},
{name: 'Sulu',data:[0.41,0.4,0.26,0.23,-0.21,-0.62]},
{name: 'Surigao del Norte',data:[-0.05,0.63,1.02,0.61,-0.11,-0.34]},
{name: 'Surigao del Sur',data:[-0.29,0.05,0.79,1.5,0.57,-0.33]},
{name: 'Tarlac',data:[0.66,-0.13,0.14,1.04,0.09,-0.66]},
{name: 'Tawi-Tawi',data:[-0.83,0.3,0.15,-0.02,-0.64,-0.08]},
{name: 'Zambales',data:[0.96,0.79,1.12,0.88,0.2,-0.39]},
{name: 'Zamboanga del Norte',data:[-0.59,0.22,0.66,0.61,0.26,-0.71]},
{name: 'Zamboanga del Sur',data:[0.34,1.01,0.63,0.29,-0.2,-0.45]},
{name: 'Zamboanga Sibugay',data:[1.15,1.67,1.42,0.86,0.59,0.2]}
]
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
      var current_month = 0; 
      var val;
      let outlook = []
      var current_data;
      
      if(province == "Occidental Mindoro"){
        current_data = {name: province, data: droughtOutlook[56].data}
      }else if(province == "Oriental Mindoro"){
        current_data = {name: province, data: droughtOutlook[57].data}
      }else if(province == "Tawi-tawi"){
        current_data = {name: province, data: droughtOutlook[77].data}
      }else{
        for(var i = 0 ; i < droughtOutlook.length; i++){
          if(droughtOutlook[i].name == province){
            current_data = {name: droughtOutlook[i].name, data: droughtOutlook[i].data}
            break;
          }
        }
      }

      for(var i = 0 ; i < 6; i++){
        val  = current_data.data[i]
        if(val >= -0.5){
          val = 'Normal';
        }else if(val <= -0.51 && val >= -1.00 ){
          val = 'Mild';
        }else if(val <= -1.01 && val >= -2.00){
          val = 'Moderate';
        }else if(val <= -2.01){
          val = 'Severe';
        }
        outlook.push({
          head: months[(i + current_month)%months.length],
          value: val
        })
      }
      return outlook
  },

  provinces: () => {
    const region = Session.get('region')
    const provinces = Provinces.find({province: {$ne:'All'}}, {sort: {province: 1}}).fetch()

    return provinces
  },

  currentlySelectedProvince: (curr) => {
    const province = Session.get('province2')
    $('#preview-select-province-drought').val(province)
  },
})