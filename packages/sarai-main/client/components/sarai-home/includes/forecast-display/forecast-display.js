Template.ForecastDisplay.onCreated(() => {
  Meteor.subscribe('wunderground-data', ()=>{
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const uplb_data = WundergroundData.findOne({code:'ICALABAR18'})
    //TIME FORECAST

    if(uplb_data.icons[0]!=null){ // MORNING
      var date = uplb_data.date[0].split('/')
      var month = months[parseInt(date[0]-1)]
      var day = date[1]

      var date2 = uplb_data.date[1].split('/')
      var month2 = months[parseInt(date2[0]-1)]
      var day2 = date2[1]

      let forecast1 = {
        date : day + ' ' + month,
        time : 'AM',
        icon : uplb_data.icons[0],
        temp : uplb_data.tempMax[0],
        dayOfWeek : uplb_data.dayOfWeek[0].substring(0,3),
        precipChance : uplb_data.precipChance[0],
        rainfall: uplb_data.rainfallDayNight[0]
      }

      Session.set('forecast1',forecast1)

      let forecast2 = {
        date : day + ' ' + month,
        time : 'PM',
        icon : uplb_data.icons[1],
        temp : uplb_data.tempMax[1],
        dayOfWeek : uplb_data.dayOfWeek[0].substring(0,3),
        precipChance : uplb_data.precipChance[1],
        rainfall: uplb_data.rainfallDayNight[1]
      }

      Session.set('forecast2',forecast2)

      let forecast3 = {
        date : day2 + ' ' + month2,
        time : 'AM',
        icon : uplb_data.icons[2],
        temp : uplb_data.tempMax[2],
        dayOfWeek : uplb_data.dayOfWeek[1].substring(0,3),
        precipChance : uplb_data.precipChance[2],
        rainfall: uplb_data.rainfallDayNight[2]
      }

      Session.set('forecast3',forecast3)

    }else{  //EVENING
      var date = uplb_data.date[0].split('/')
      var month = months[parseInt(date[0]-1)]
      var day = date[1]

      var date2 = uplb_data.date[1].split('/')
      var month2 = months[parseInt(date2[0]-1)]
      var day2 = date2[1]

      let forecast1 = {
        date : day + ' ' + month,
        time : 'PM',
        icon : uplb_data.icons[1],
        temp : uplb_data.tempMax[1],
        dayOfWeek : uplb_data.dayOfWeek[0].substring(0,3),
        precipChance : uplb_data.precipChance[1],
        rainfall: uplb_data.rainfallDayNight[1]
      }

      Session.set('forecast1',forecast1)

      let forecast2 = {
        date : day2 + ' ' + month2,
        time : 'AM',
        icon : uplb_data.icons[2],
        temp : uplb_data.tempMax[2],
        dayOfWeek : uplb_data.dayOfWeek[1].substring(0,3),
        precipChance : uplb_data.precipChance[2],
        rainfall: uplb_data.rainfallDayNight[2]
      }

      Session.set('forecast2',forecast2)

      let forecast3 = {
        date : day2 + ' ' + month2,
        time : 'PM',
        icon : uplb_data.icons[3],
        temp : uplb_data.tempMax[3],
        dayOfWeek : uplb_data.dayOfWeek[1].substring(0,3),
        precipChance : uplb_data.precipChance[3],
        rainfall: uplb_data.rainfallDayNight[3]
      }

      Session.set('forecast3',forecast3)
    }


    //DAILY FORECAST 

   // if(uplb_data.icons[0]!=null){ // MORNING
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

      let forecast1 = {
        date : day + ' ' + month,
        time : 'AM',
        icon : uplb_data.icons[2],
        temp : uplb_data.tempMax[2],
        dayOfWeek : uplb_data.dayOfWeek[1].substring(0,3),
        precipChance : uplb_data.precipChance[2],
        rainfall: uplb_data.rainfallDayNight[2]
      }

      Session.set('forecast1Daily',forecast1)

      let forecast2 = {
        date : day2 + ' ' + month2,
        time : 'AM',
        icon : uplb_data.icons[4],
        temp : uplb_data.tempMax[4],
        dayOfWeek : uplb_data.dayOfWeek[2].substring(0,3),
        precipChance : uplb_data.precipChance[4],
        rainfall: uplb_data.rainfallDayNight[4]
      }

      Session.set('forecast2Daily',forecast2)

      let forecast3 = {
        date : day3 + ' ' + month3,
        time : 'AM',
        icon : uplb_data.icons[6],
        temp : uplb_data.tempMax[6],
        dayOfWeek : uplb_data.dayOfWeek[3].substring(0,3),
        precipChance : uplb_data.precipChance[6],
        rainfall: uplb_data.rainfallDayNight[6]
      }

      Session.set('forecast3Daily',forecast3)

      let forecast4 = {
        date : day4 + ' ' + month4,
        time : 'AM',
        icon : uplb_data.icons[8],
        temp : uplb_data.tempMax[8],
        dayOfWeek : uplb_data.dayOfWeek[4].substring(0,3),
        precipChance : uplb_data.precipChance[8],
        rainfall: uplb_data.rainfallDayNight[8]
      }

      Session.set('forecast4Daily',forecast4)

   // }else{  //EVENING
      /*var date = uplb_data.date[1].split('/')
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
      var day4 = date4[1]*/

      let forecast1night = {
        date : day + ' ' + month,
        time : 'PM',
        icon : uplb_data.icons[3],
        temp : uplb_data.tempMax[3],
        dayOfWeek : uplb_data.dayOfWeek[1].substring(0,3),
        precipChance : uplb_data.precipChance[3],
        rainfall: uplb_data.rainfallDayNight[3]
      }

      Session.set('forecast1Night',forecast1night)

      let forecast2night = {
        date : day2 + ' ' + month2,
        time : 'PM',
        icon : uplb_data.icons[5],
        temp : uplb_data.tempMax[5],
        dayOfWeek : uplb_data.dayOfWeek[2].substring(0,3),
        precipChance : uplb_data.precipChance[5],
        rainfall: uplb_data.rainfallDayNight[5]
      }

      Session.set('forecast2Night',forecast2night)

      let forecast3night = {
        date : day3 + ' ' + month3,
        time : 'PM',
        icon : uplb_data.icons[7],
        temp : uplb_data.tempMax[7],
        dayOfWeek : uplb_data.dayOfWeek[3].substring(0,3),
        precipChance : uplb_data.precipChance[7],
        rainfall: uplb_data.rainfallDayNight[7]
      }

      Session.set('forecast3Night',forecast3night)

      let forecast4night = {
        date : day4 + ' ' + month4,
        time : 'PM',
        icon : uplb_data.icons[9],
        temp : uplb_data.tempMax[9],
        dayOfWeek : uplb_data.dayOfWeek[4].substring(0,3),
        precipChance : uplb_data.precipChance[9],
        rainfall: uplb_data.rainfallDayNight[9]
      }

      Session.set('forecast4Night',forecast4night)
  //  }

  })
})

Template.ForecastDisplay.onRendered(() => {

})

Template.ForecastDisplay.helpers({
  slides: () => {
    return [
      {'type':'ForecastTime'},
      {'type':'ForecastDay'},
      {'type':'ForecastNight'},
    ]
  },
});

Template.ForecastContent.helpers({
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

Template.ForecastContent.onRendered(() => {
  
  $('#main-carousel').slick({
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 10000,
  })

})