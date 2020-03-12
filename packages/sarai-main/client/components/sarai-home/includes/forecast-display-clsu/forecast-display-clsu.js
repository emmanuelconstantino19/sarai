Template.ForecastDisplayCLSU.onCreated(() => {
  Meteor.subscribe('wunderground-data', ()=>{
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const uplb_data = WundergroundData.findOne({code:'ICENTRAL91'})
    //TIME FORECAST

      var date = uplb_data.date[0].split('/')
      var month = months[parseInt(date[0]-1)]
      var day = date[1]

      var date2 = uplb_data.date[1].split('/')
      var month2 = months[parseInt(date2[0]-1)]
      var day2 = date2[1]

      let forecast1 = {
        date : day + ' ' + month,
        icon : uplb_data.icons[0],
        tempHigh : uplb_data.tempMaxDaily[0],
        tempLow : uplb_data.tempMinDaily[0],
        dayOfWeek : uplb_data.dayOfWeek[0].substring(0,3),
        precipChance : (parseInt(uplb_data.precipChance[0]) > parseInt(uplb_data.precipChance[1])) ? uplb_data.precipChance[0] : uplb_data.precipChance[1],
        rainfall: uplb_data.rainfall[0]
      }

      Session.set('forecast1',forecast1)
    
      var date = uplb_data.date[1].split('/')
      var month = months[parseInt(date[0]-1)]
      var day = date[1]

      var date2 = uplb_data.date[2].split('/')
      var month2 = months[parseInt(date2[0]-1)]
      var day2 = date2[1]

      var date3 = uplb_data.date[3].split('/')
      var month3 = months[parseInt(date3[0]-1)]
      var day3 = date3[1]

      var date4 = uplb_data.date[4].split('/')
      var month4 = months[parseInt(date4[0]-1)]
      var day4 = date4[1]

      let forecast1Daily = {
        date : day + ' ' + month,
        time : 'AM',
        icon : uplb_data.icons[2],
        tempHigh : uplb_data.tempMaxDaily[1],
        tempLow : uplb_data.tempMinDaily[1],
        dayOfWeek : uplb_data.dayOfWeek[1].substring(0,3),
        precipChance : (parseInt(uplb_data.precipChance[2]) > parseInt(uplb_data.precipChance[3])) ? uplb_data.precipChance[2] : uplb_data.precipChance[3],
      }

      Session.set('forecast1Daily',forecast1Daily)

      let forecast2 = {
        date : day2 + ' ' + month2,
        time : 'AM',
        icon : uplb_data.icons[4],
        tempHigh : uplb_data.tempMaxDaily[2],
        tempLow : uplb_data.tempMinDaily[2],
        dayOfWeek : uplb_data.dayOfWeek[2].substring(0,3),
        precipChance : (parseInt(uplb_data.precipChance[4]) > parseInt(uplb_data.precipChance[5])) ? uplb_data.precipChance[4] : uplb_data.precipChance[5],
      }

      Session.set('forecast2Daily',forecast2)

      let forecast3 = {
        date : day3 + ' ' + month3,
        time : 'AM',
        icon : uplb_data.icons[6],
        tempHigh : uplb_data.tempMaxDaily[3],
        tempLow : uplb_data.tempMinDaily[3],
        dayOfWeek : uplb_data.dayOfWeek[3].substring(0,3),
        precipChance : (parseInt(uplb_data.precipChance[6]) > parseInt(uplb_data.precipChance[7])) ? uplb_data.precipChance[6] : uplb_data.precipChance[7],
      }

      Session.set('forecast3Daily',forecast3)

      let forecast4 = {
        date : day4 + ' ' + month4,
        time : 'AM',
        icon : uplb_data.icons[8],
        tempHigh : uplb_data.tempMaxDaily[4],
        tempLow : uplb_data.tempMinDaily[4],
        dayOfWeek : uplb_data.dayOfWeek[4].substring(0,3),
        precipChance : (parseInt(uplb_data.precipChance[8]) > parseInt(uplb_data.precipChance[9])) ? uplb_data.precipChance[8] : uplb_data.precipChance[9],
      }

      Session.set('forecast4Daily',forecast4)

  })
})

Template.ForecastDisplayCLSU.onRendered(() => {

})

Template.ForecastDisplayCLSU.helpers({
  slides: () => {
    return [
      {'type':'ForecastTime'},
      {'type':'ForecastDay'},
      {'type':'ForecastNight'},
    ]
  },
});

Template.ForecastContentCLSU.helpers({
  formatQPF: (qpf) => {
    if (qpf < 1) {
      return "< 1"
    }
    else {
      return qpf
    }
  },
  isSlideOne: (type) => {
    if(type=="ForecastTime"){
      return true
    }
    return false
  },
  isSlideTwo: (type) => {
    if(type=="ForecastDay"){
      return true
    }
    return false
  },
  forecast1: () =>{
    return Session.get('forecast1')
  },
  forecast2: () =>{
    return Session.get('forecast2')
  },
  forecast3: () =>{
    return Session.get('forecast3')
  },
  forecast1Daily: () =>{
    return Session.get('forecast1Daily')
  },
  forecast2Daily: () =>{
    return Session.get('forecast2Daily')
  },
  forecast3Daily: () =>{
    return Session.get('forecast3Daily')
  },
  forecast4Daily: () =>{
    return Session.get('forecast4Daily')
  },
  forecast1Night: () =>{
    return Session.get('forecast1Night')
  },
  forecast2Night: () =>{
    return Session.get('forecast2Night')
  },
  forecast3Night: () =>{
    return Session.get('forecast3Night')
  },
  forecast4Night: () =>{
    return Session.get('forecast4Night')
  },

});

Template.ForecastContentCLSU.onRendered(() => {
  
  $('#main-carousel').slick({
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 10000,
  })

})