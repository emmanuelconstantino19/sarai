Template.Slider.onRendered(() => {

})

Template.Slider.helpers({

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

      return filtered
    }
  },

  setSliderIndex: (index, image) => {
    console.log(`index: ${index}, image: ${image}`)
  }
})

// SliderContent Stuff starts here
Template.SliderContent.onRendered(() => {

  $('#main-carousel').slick({
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
  })

})

Template.SliderContent.events({

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