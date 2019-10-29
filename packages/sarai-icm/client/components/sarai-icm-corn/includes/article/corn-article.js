Template.CornArticle.helpers({
  corn_article: function(){
  	var obj = ICM.findOne({'name': 'corn_article'});
    if(typeof obj !== 'undefined'){
      return obj;
    }
  },

  isEnabled: function(){
  	var obj = ICM.findOne({'name': 'corn_article'});
    if(typeof obj !== 'undefined'){
      return obj.enabled;
    }
  },
});

Template.CornTriviaSlider.onRendered(() => {
  // *****************
  $('#trivia-carousel').slick({
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    variableWidth: false,
    infinite: true,
    slidesToShow: 1,
  })
  // *****************
});

Template.CornTriviaSlider.helpers({
  // *****************
  slides: () => {
    const record = ICM.findOne({name: 'corn_trivia'})

    return record && record.slides
  },

  setSliderIndex: (index, image) => {
  }
  // *****************

});