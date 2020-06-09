Template.Slider.onRendered(() => {

})

Template.Slider.helpers({
  isCommunity: (title) => {
    if (title == "community") {
      return true
    }
    return false
  },

  slides: () => {
    const record = Main.findOne({name: 'banner'})

    if (record) {
      const sorted = record.slides

      const filtered = sorted.filter(function(value, index, arr){
        return value.title!="SARAi KNOWLEDGE PORTAL"
              && value.title!="SARAI-Enhanced Agricultural Monitoring System"
              && value.title!="SMARTER PEST IDENTIFICATION TECHNOLOGY"
              && value.title!="CHAMPIONING SARAi"
      })

      filtered.sort((a, b) => {
        return a.rank > b.rank ? 1 : ((b.rank > a.rank ? -1 : 0))
      })

      filtered.push({title:'community'})

      return filtered
    }
  },

  setSliderIndex: (index, image) => {
  }
})

// SliderContent Stuff starts here
Template.SliderContent.onRendered(() => {

  $('#main-carousel').slick({
    dots:true,
    arrows: true,
    autoplay: true,
    pauseOnHover:true,
    pauseOnFocus:true,
    autoplaySpeed: 10000,
  })

})

Template.Slider.events({
  'click #play-next': (e) => {
    if($('#slider-video').attr('src') == "https://www.youtube.com/embed/VDf7TkWeU6k"){
      $('#slider-video').attr('src','https://www.youtube.com/embed/s5s6gBN0dpU')
      $('#video-description').text('Know what to do on your Taal Ashfall affected crops as advised by Dr. Calixto Protacio, professor from the College of Agriculture (CAFS) - UPLB and crop expert of Project SARAi.')
      $('#play-next').html('<span class="	glyphicon glyphicon-play-circle"></span> Watch SARAi analysis of Taal Ashfall</span>')
    }else{
      $('#slider-video').attr('src','https://www.youtube.com/embed/VDf7TkWeU6k')
      $('#video-description').text("Watch as Dr. Vic Bato, professor from the College of Agriculture and Food Science (CAFS) - UPLB and soil scientist of Project SARAi, explains his team's analysis of the Taal Ashfall.")
      $('#play-next').html('<span class="	glyphicon glyphicon-play-circle"></span> Watch SARAi Taal Ashfall Crop Advisory</span>')
    }
    
  },
})

Template.SliderContent.helpers({
  textPosition: () => {
    const record = Main.findOne({name: 'banner'})

    return record && record.textPosition
  },

  positionClasses: (position) => {
    switch(position) {
      case ('left'):
        return {
          class: 'mdl-cell mdl-cell--1-offset-desktop mdl-cell--6-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone banner-slide-content'
        }
      case ('right'):
        return {
          class: 'mdl-cell mdl-cell--6-offset-desktop mdl-cell--6-col-desktop mdl-cell--4-offset-tablet mdl-cell--4-col-tablet mdl-cell--4-col-phone banner-slide-content'
        }
      default:
        return {
          class: 'mdl-cell mdl-cell--1-offset-desktop mdl-cell--6-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone banner-slide-content'
        }
    }
  }
})