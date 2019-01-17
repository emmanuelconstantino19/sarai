Template.RainfallOutlookView.onCreated(() => {
  Meteor.subscribe('regions')
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna and Los Baños
  Session.set('region', 'Region IV-A: CALABARZON')
  Session.set('province', 'Laguna')
  Session.set('municipality', 'Los Baños')
})

Template.RainfallOutlookView.onRendered(() => {
  const region = Session.get('region')
  $('#preview-select-region').val(region)

  const province = Session.get('province')
  $('#preview-select-province').val(province)

  const municipality = Session.get('municipality')
  $('#preview-select-municipality').val(municipality)
})

Template.RainfallOutlookView.events({
  'change #preview-select-region': (e) => {
    const region = e.currentTarget.value
    Session.set('region', region)

    const province = Regions.findOne({region:region}).province[0]

    // sets province to first province in the chosen region 
    Session.set('province',Regions.findOne({region:region}).province[0])

    // sets municipality to first municipality in the chosen province 
    Session.set('municipality',Provinces.findOne({province:province}).municipality[0])
  },
  
  'change #preview-select-province': (e) => {
    const province = e.currentTarget.value
    Session.set('province', province)

    // sets municipality to first municipality in the chosen province 
    Session.set('municipality',Provinces.findOne({province:province}).municipality[0])
  },

  'change #preview-select-municipality': (e) => {
    const municipality = e.currentTarget.value
    Session.set('municipality', municipality)
  },

  'click .rainfall-outlook-more button': () => {
    // const stationID = Session.get('stationID')
    // FlowRouter.go(`/accumulated-rainfall/${stationID}`)
    FlowRouter.go(`/heat-map-rainfall-outlook`)
  }
})

Template.RainfallOutlookView.helpers({

  monthlyRainfall: () => {
      //const region = Session.get('region')
      const province = Session.get('province')
      const municipality = Session.get('municipality')
      const weatherOutlook = WeatherOutlook.findOne({province: province, municipality: municipality})
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
      var d = new Date()
      var current_month = 1; 
      var val;

      if (weatherOutlook){
        let outlook = []

        for(var i = 0 ; i < 6; i++){
          val = (weatherOutlook.data.month[months[(i + current_month)%months.length]]==null) ? "--" : Math.round(weatherOutlook.data.month[months[(i + current_month)%months.length]])
          outlook.push({
            head: months[(i + current_month)%months.length],
            value: val
          })
        }
        // outlook.push({
        //   head: 'January',
        //   value: Math.round(weatherOutlook.data.month.January * 10) / 10
        // })
        /*
        outlook.push({
          head: 'Dec',
          value: Math.round(weatherOutlook.data.month.Dec)
        })

        outlook.push({
          head: 'Jan',
          value: Math.round(weatherOutlook.data.month.Jan)
        })

        outlook.push({
          head: 'Feb',
          value: Math.round(weatherOutlook.data.month.Feb)
        })

        outlook.push({
          head: 'Mar',
          value: Math.round(weatherOutlook.data.month.Mar)
        })

        outlook.push({
          head: 'Apr',
          value: Math.round(weatherOutlook.data.month.Apr)
        })*/

        return outlook
      }
  },

  regions: () => {
    const regions = Regions.find({}, {sort: {id: 1}}).fetch()

    return regions
  },

  currentlySelectedRegion: (curr) => {
    const region = Session.get('region')
    $('#preview-select-region').val(region)
  },

  provinces: () => {
    const region = Session.get('region')
    const provinces = Provinces.find({province: {$ne:'All'}}, {sort: {province: 1}}).fetch()

    return provinces
  },

  currentlySelectedProvince: (curr) => {
    const province = Session.get('province')
    $('#preview-select-province').val(province)
  },

  municipalities: () => {
    const province = Session.get('province')
    const municipalities = Provinces.findOne({province:province})

    return municipalities && municipalities.municipality
  },

  currentlySelectedMunicipality: (curr) => {
    const municipality = Session.get('municipality')
    $('#preview-select-municipality').val(municipality)
  },
})