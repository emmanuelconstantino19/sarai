Template.DroughtOutlookView.onCreated(() => {
  Meteor.subscribe('regions')
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna and Los Baños
  Session.set('province-drought', 'Laguna')
})

Template.DroughtOutlookView.onRendered(() => {
  const province = Session.get('province-drought')
  $('#preview-select-province-drought-landing').val(province)
})

Template.DroughtOutlookView.events({
  'change #preview-select-province-drought-landing': (e) => {
    const province = e.currentTarget.value
    Session.set('province-drought', province)
  },

  'click .drought-outlook-more button': () => {
    FlowRouter.go(`/drought`)
  }
})

Template.DroughtOutlookView.helpers({

  monthlyDrought: () => {
      //const region = Session.get('region')
      const province = Session.get('province-drought')
      const droughtOutlook = 

      [
      
        {name: 'Abra',data:[-0.09,0.04,-0.03,-0.15,0.00,0.55]},
        {name: 'Agusan del Norte',data:[0.53,0.14,0.45,0.48,0.31,-0.05]},
        {name: 'Agusan del Sur',data:[0.62,0.13,0.60,0.62,0.30,-0.10]},
        {name: 'Aklan',data:[0.21,-0.09,0.22,0.33,0.01,-0.12]},
        {name: 'Albay',data:[-0.09,-0.34,0.13,0.21,0.07,-0.23]},
        {name: 'Antique',data:[-0.59,-0.58,-0.27,0.07,0.10,0.23]},
        {name: 'Apayao',data:[-0.15,0.10,-0.03,0.22,0.34,0.82]},
        {name: 'Aurora',data:[-0.08,-0.24,0.02,0.07,-0.08,0.23]},
        {name: 'Basilan',data:[-0.51,-0.68,-0.30,0.09,-0.15,-0.44]},
        {name: 'Bataan',data:[0.03,0.19,0.29,-0.06,-0.05,0.41]},
        {name: 'Batanes',data:[-0.68,-0.29,0.28,-0.14,0.77,0.08]},
        {name: 'Batangas',data:[-1.12,-1.13,-0.31,-0.28,-0.37,0.03]},
        {name: 'Benguet',data:[0.40,0.45,0.24,0.16,-0.02,0.10]},
        {name: 'Biliran',data:[-0.08,-0.71,-0.11,-0.15,-0.14,-0.29]},
        {name: 'Bohol',data:[0.00,-0.16,0.19,-0.01,-0.08,-0.10]},
        {name: 'Bukidnon',data:[-1.07,-0.70,-0.22,-0.23,-0.44,-0.36]},
        {name: 'Bulacan',data:[-0.70,-0.30,-0.02,0.12,0.03,0.25]},
        {name: 'Cagayan',data:[-0.34,0.30,0.15,0.13,0.07,0.30]},
        {name: 'Camarines Norte',data:[0.23,-0.24,0.11,0.06,-0.02,-0.10]},
        {name: 'Camarines Sur',data:[-0.10,-0.24,0.06,0.13,-0.11,-0.26]},
        {name: 'Camiguin',data:[-0.05,0.40,0.24,0.28,0.67,-0.37]},
        {name: 'Capiz',data:[-0.23,-0.51,-0.35,0.28,-0.09,-0.48]},
        {name: 'Catanduanes',data:[0.32,-0.08,0.19,0.08,-0.38,-0.27]},
        {name: 'Cavite',data:[-1.25,-0.78,-0.22,0.03,0.02,0.11]},
        {name: 'Cebu',data:[-0.12,-0.51,-0.03,-0.07,-0.36,-0.44]},
        {name: 'Compostela Valley',data:[0.09,0.02,0.30,0.43,0.04,-0.43]},
        {name: 'Davao del Norte',data:[-0.34,-0.25,0.33,0.42,-0.03,-0.55]},
        {name: 'Davao del Sur',data:[-0.50,-0.24,0.25,0.38,0.07,-0.49]},
        {name: 'Davao Oriental',data:[0.22,0.05,0.46,0.78,0.31,-0.07]},
        {name: 'Dinagat Islands',data:[0.36,0.09,0.57,0.67,0.09,-0.63]},
        {name: 'Eastern Samar',data:[-0.06,-0.19,0.22,0.08,-0.27,-0.23]},
        {name: 'Guimaras',data:[0.13,-0.57,-0.29,0.22,0.06,-0.04]},
        {name: 'Ifugao',data:[-0.32,-0.05,0.12,0.23,0.26,0.72]},
        {name: 'Ilocos Norte',data:[-0.40,0.00,-0.31,-0.26,0.17,0.67]},
        {name: 'Ilocos Sur',data:[-0.30,0.06,-0.24,-0.26,0.19,0.60]},
        {name: 'Iloilo',data:[-0.18,-0.57,-0.57,-0.08,-0.09,-0.25]},
        {name: 'Isabela',data:[-0.18,-0.08,-0.15,-0.13,-0.03,0.62]},
        {name: 'Kalinga',data:[-0.92,-0.26,0.02,0.09,0.24,0.89]},
        {name: 'La Union',data:[0.05,0.36,-0.01,-0.23,-0.02,0.58]},
        {name: 'Laguna',data:[-0.18,-0.27,0.07,0.46,0.24,0.27]},
        {name: 'Lanao del Norte',data:[0.08,-0.02,0.13,0.04,-0.09,-0.02]},
        {name: 'Lanao del Sur',data:[0.01,-0.20,-0.15,-0.05,-0.03,-0.04]},
        {name: 'Leyte',data:[0.31,-0.12,0.13,-0.01,-0.17,-0.04]},
        {name: 'Maguindanao',data:[-1.04,-0.71,-0.92,-0.80,-0.72,-0.44]},
        {name: 'Marinduque',data:[-0.21,-0.72,-0.29,-0.11,-0.34,-0.63]},
        {name: 'Masbate',data:[-0.19,-0.62,-0.07,-0.09,-0.40,-0.55]},
        {name: 'Metropolitan Manila',data:[-0.30,-0.06,0.15,0.17,0.19,0.27]},
        {name: 'Misamis Occidental',data:[0.13,0.15,0.60,0.77,0.49,0.29]},
        {name: 'Misamis Oriental',data:[-0.17,-0.74,-0.45,-0.29,-0.33,-0.41]},
        {name: 'Mountain Province',data:[-0.29,-0.24,-0.02,0.08,-0.04,0.51]},
        {name: 'Negros Occidental',data:[-0.38,-0.73,-0.41,-0.11,-0.05,0.00]},
        {name: 'Negros Oriental',data:[-0.38,-0.78,-0.20,0.01,-0.09,-0.17]},
        {name: 'North Cotabato',data:[-1.09,-0.74,-0.38,-0.13,-0.44,-0.42]},
        {name: 'Northern Samar',data:[-0.31,-0.19,0.09,0.15,-0.42,-0.78]},
        {name: 'Nueva Ecija',data:[-0.42,-0.07,-0.07,-0.53,-0.47,0.29]},
        {name: 'Nueva Vizcaya',data:[-0.28,-0.27,-0.07,0.10,0.06,0.42]},
        {name: 'Occidental Mindoro',data:[-0.42,-0.31,-0.23,-0.23,-0.30,0.16]},
        {name: 'Oriental Mindoro',data:[0.16,0.01,0.15,0.10,-0.11,-0.02]},
        {name: 'Palawan',data:[-0.49,-0.46,-0.03,0.11,0.09,0.05]},
        {name: 'Pampanga',data:[-0.64,-0.13,-0.24,-0.50,-0.14,0.68]},
        {name: 'Pangasinan',data:[-0.09,0.30,-0.13,-0.59,-0.10,0.86]},
        {name: 'Quezon',data:[-0.07,-0.37,0.12,0.30,0.06,0.07]},
        {name: 'Quirino',data:[-0.18,-0.30,-0.34,-0.27,-0.01,0.63]},
        {name: 'Rizal',data:[-0.57,-0.59,-0.13,0.17,-0.18,-0.06]},
        {name: 'Romblon',data:[0.30,-0.24,-0.07,0.44,0.22,0.37]},
        {name: 'Samar',data:[-0.10,-0.28,0.20,0.15,-0.27,-0.57]},
        {name: 'Sarangani',data:[-0.29,-0.48,-0.19,0.08,-0.09,-0.40]},
        {name: 'Shariff Kabunsuan',data:[-1.06,-0.87,-0.38,-0.18,-0.18,-0.08]},
        {name: 'Siquijor',data:[-0.71,-1.30,-0.56,-0.09,-0.44,-0.30]},
        {name: 'Sorsogon',data:[0.23,-0.07,0.30,0.51,-0.01,-0.15]},
        {name: 'South Cotabato',data:[-0.65,-0.88,-0.53,-0.17,-0.45,-0.28]},
        {name: 'Southern Leyte',data:[0.28,0.13,0.45,0.36,0.05,-0.11]},
        {name: 'Sultan Kudarat',data:[-0.43,-0.60,-0.57,-0.33,-0.54,-0.47]},
        {name: 'Sulu',data:[-0.83,-1.10,-0.92,-0.39,-0.90,-0.79]},
        {name: 'Surigao del Norte',data:[0.33,-0.21,0.51,0.43,0.13,-0.26]},
        {name: 'Surigao del Sur',data:[0.59,-0.16,0.52,0.59,0.08,-0.30]},
        {name: 'Tarlac',data:[-0.34,0.12,-0.10,-0.84,-0.27,0.80]},
        {name: 'Tawi-Tawi',data:[0.33,0.07,0.06,0.30,0.23,-0.28]},
        {name: 'Zambales',data:[0.16,0.35,0.13,-0.01,0.16,0.41]},
        {name: 'Zamboanga del Norte',data:[-0.24,-0.19,0.07,0.11,0.14,-0.17]},
        {name: 'Zamboanga del Sur',data:[-0.46,-0.51,-0.18,0.04,0.07,0.05]},
        {name: 'Zamboanga Sibugay',data:[0.06,-0.14,0.04,0.18,0.47,0.80]}
        
      ]

      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
      var current_month = 5; 
      var val;
      let outlook = []
      var current_data;
      var color;
      
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
        val  = current_data.data[i].toFixed(2)
        if(val >= -0.5){
          val = 'Normal';
          color = "black";
        }else if(val <= -0.51 && val >= -1.00 ){
          val = 'Mild';
          color = "#ffcc00";
        }else if(val <= -1.01 && val >= -2.00){
          val = 'Moderate';
          color = "orange";
        }else if(val <= -2.01){
          val = 'Severe';
          color = "red";
        }
        outlook.push({
          head: months[(i + current_month)%months.length],
          value: val,
          color: color
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
    const province = Session.get('province-drought')
    $('#preview-select-province-drought-landing').val(province)
  },
})