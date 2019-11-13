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
      
        {name: 'Abra',data:[-0.29,-0.87,-0.65,-0.52,-0.13,0.74]},
        {name: 'Agusan del Norte',data:[0.24,0.60,-0.03,0.09,-0.15,0.06]},
        {name: 'Agusan del Sur',data:[0.11,0.27,0.09,0.07,0.20,0.27]},
        {name: 'Aklan',data:[0.09,0.21,-0.29,-0.31,-0.08,0.12]},
        {name: 'Albay',data:[-0.11,0.01,-0.18,-0.11,0.21,0.25]},
        {name: 'Antique',data:[0.21,0.15,-0.08,-0.14,-0.14,0.02]},
        {name: 'Apayao',data:[-0.46,-0.58,-1.03,-1.26,-0.94,0.58]},
        {name: 'Aurora',data:[-0.14,-0.40,-0.94,-0.62,-0.12,0.47]},
        {name: 'Basilan',data:[-0.39,-0.65,-0.74,-0.39,0.09,0.36]},
        {name: 'Bataan',data:[-0.12,0.07,-0.10,-0.01,0.23,1.29]},
        {name: 'Batanes',data:[0.65,-0.38,-1.13,-0.68,-0.25,0.90]},
        {name: 'Batangas',data:[-0.48,-0.32,-0.13,0.12,-0.01,0.30]},
        {name: 'Benguet',data:[-0.34,-0.53,-0.42,-0.15,0.06,0.27]},
        {name: 'Biliran',data:[0.19,0.16,-0.15,-0.65,-0.64,-0.30]},
        {name: 'Bohol',data:[-0.10,0.01,-0.13,-0.14,0.11,0.64]},
        {name: 'Bukidnon',data:[-0.64,-0.16,-0.20,-0.22,-0.11,0.16]},
        {name: 'Bulacan',data:[-0.03,0.10,-0.29,-0.51,-0.27,0.62]},
        {name: 'Cagayan',data:[-0.47,-0.42,-0.79,-0.96,-0.75,0.33]},
        {name: 'Camarines Norte',data:[0.28,0.22,-0.33,-0.26,-0.49,-0.05]},
        {name: 'Camarines Sur',data:[-0.10,-0.08,-0.40,-0.25,-0.16,0.06]},
        {name: 'Camiguin',data:[-0.24,-0.30,-0.23,-0.15,0.39,0.76]},
        {name: 'Capiz',data:[-0.37,-0.01,-0.01,0.08,-0.20,-0.11]},
        {name: 'Catanduanes',data:[-0.21,-0.01,-0.34,-0.38,-0.24,0.06]},
        {name: 'Cavite',data:[-0.81,-0.51,-0.06,0.21,0.03,0.43]},
        {name: 'Cebu',data:[-0.29,-0.01,-0.08,0.10,0.21,0.38]},
        {name: 'Compostela Valley',data:[-0.21,0.03,-0.16,-0.19,0.14,0.40]},
        {name: 'Davao del Norte',data:[-0.16,0.21,-0.42,-0.25,0.17,0.35]},
        {name: 'Davao del Sur',data:[-0.17,-0.06,-0.33,-0.14,0.05,0.26]},
        {name: 'Davao Oriental',data:[0.02,0.11,-0.24,-0.10,0.33,0.39]},
        {name: 'Dinagat Islands',data:[-0.01,-0.17,-0.23,-0.30,-0.07,-0.14]},
        {name: 'Eastern Samar',data:[-0.02,0.04,-0.06,-0.22,0.06,0.27]},
        {name: 'Guimaras',data:[0.31,0.79,0.31,0.29,0.09,0.26]},
        {name: 'Ifugao',data:[-0.48,-0.87,-1.33,-0.81,-0.36,0.31]},
        {name: 'Ilocos Norte',data:[-0.20,-0.66,-0.56,-0.52,0.07,0.98]},
        {name: 'Ilocos Sur',data:[-0.41,-0.78,-0.49,-0.20,0.11,0.59]},
        {name: 'Iloilo',data:[-0.16,-0.03,0.18,0.12,-0.23,-0.18]},
        {name: 'Isabela',data:[-0.21,-0.03,-0.59,-0.74,-0.63,0.22]},
        {name: 'Kalinga',data:[-0.33,-0.87,-1.20,-1.03,-0.54,0.37]},
        {name: 'La Union',data:[0.10,-0.33,-0.28,-0.08,0.00,0.35]},
        {name: 'Laguna',data:[0.02,-0.05,-0.20,-0.17,-0.22,0.38]},
        {name: 'Lanao del Norte',data:[-0.15,-0.06,-0.21,-0.16,0.08,0.31]},
        {name: 'Lanao del Sur',data:[-0.20,-0.36,-0.39,-0.28,0.06,0.28]},
        {name: 'Leyte',data:[0.26,0.29,0.09,-0.08,-0.05,0.18]},
        {name: 'Maguindanao',data:[-0.82,-0.53,-0.65,-0.71,-0.41,-0.16]},
        {name: 'Marinduque',data:[-0.54,-0.41,-0.66,-0.29,-0.34,0.17]},
        {name: 'Masbate',data:[-0.12,-0.12,-0.14,0.08,-0.14,-0.09]},
        {name: 'Metropolitan Manila',data:[-0.22,-0.36,-0.23,0.11,0.13,0.35]},
        {name: 'Misamis Occidental',data:[0.44,0.07,-0.05,0.20,0.35,0.60]},
        {name: 'Misamis Oriental',data:[-0.25,0.08,-0.12,0.00,-0.06,0.21]},
        {name: 'Mountain Province',data:[-0.41,-0.88,-0.93,-0.70,-0.44,0.19]},
        {name: 'Negros Occidental',data:[0.28,0.36,0.17,0.16,-0.07,-0.01]},
        {name: 'Negros Oriental',data:[0.05,0.21,0.11,0.10,0.11,0.30]},
        {name: 'North Cotabato',data:[-0.46,-0.18,-0.33,-0.30,-0.02,0.24]},
        {name: 'Northern Samar',data:[-0.31,-0.05,-0.27,-0.43,-0.51,-0.25]},
        {name: 'Nueva Ecija',data:[-0.30,-0.17,0.13,-0.14,-0.12,0.41]},
        {name: 'Nueva Vizcaya',data:[-0.04,-0.41,-0.66,-0.52,-0.10,0.42]},
        {name: 'Occidental Mindoro',data:[0.30,0.21,0.16,-0.22,-0.46,-0.12]},
        {name: 'Oriental Mindoro',data:[-0.05,0.05,-0.12,-0.41,-0.40,0.02]},
        {name: 'Palawan',data:[-0.19,-0.30,-0.44,-0.39,-0.12,0.10]},
        {name: 'Pampanga',data:[0.26,0.35,-0.23,-0.60,0.02,1.20]},
        {name: 'Pangasinan',data:[0.14,0.16,-0.03,-0.17,0.08,0.59]},
        {name: 'Quezon',data:[0.14,-0.08,-0.52,-0.28,-0.23,0.05]},
        {name: 'Quirino',data:[0.23,-0.13,-0.70,-0.76,-0.51,0.28]},
        {name: 'Rizal',data:[-0.12,0.01,0.10,0.24,0.23,0.55]},
        {name: 'Romblon',data:[0.00,-0.28,-0.46,-0.11,0.10,0.30]},
        {name: 'Samar',data:[-0.23,0.07,-0.08,-0.10,-0.18,0.09]},
        {name: 'Sarangani',data:[-0.15,0.17,-0.20,-0.21,0.09,0.18]},
        {name: 'Siquijor',data:[-0.27,0.03,-0.34,-0.31,-0.07,-0.12]},
        {name: 'Sorsogon',data:[0.11,-0.10,-0.18,-0.38,-0.13,-0.14]},
        {name: 'South Cotabato',data:[-0.42,-0.13,-0.35,-0.35,0.08,0.26]},
        {name: 'Southern Leyte',data:[0.29,0.06,-0.11,-0.38,0.12,0.30]},
        {name: 'Sultan Kudarat',data:[-0.67,-0.49,-0.58,-0.47,-0.10,0.02]},
        {name: 'Sulu',data:[-0.45,-0.77,-0.38,-0.24,0.12,0.08]},
        {name: 'Surigao del Norte',data:[-0.08,-0.07,-0.28,-0.10,-0.07,-0.07]},
        {name: 'Surigao del Sur',data:[-0.01,0.32,-0.03,0.18,0.16,0.29]},
        {name: 'Tarlac',data:[-0.27,0.02,-0.03,-0.24,0.19,1.23]},
        {name: 'Tawi-Tawi',data:[-0.59,-0.45,-0.45,-0.29,-0.17,-0.13]},
        {name: 'Zambales',data:[0.12,-0.28,-0.36,-0.34,0.11,0.73]},
        {name: 'Zamboanga del Norte',data:[-0.09,-0.17,-0.26,-0.06,0.25,0.31]},
        {name: 'Zamboanga del Sur',data:[0.22,-0.22,-0.51,-0.58,-0.22,-0.04]},
        {name: 'Zamboanga Sibugay',data:[0.70,0.14,-0.23,-0.08,0.15,0.28]}
        
      ]

      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
      var current_month = 10; 
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
    const province = Session.get('province2')
    $('#preview-select-province-drought').val(province)
  },
})