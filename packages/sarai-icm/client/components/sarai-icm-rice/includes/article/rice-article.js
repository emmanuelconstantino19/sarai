Template.RiceArticle.onCreated(() => {

});


Template.RiceArticle.onRendered(() => {
  $('#intro').hide();
  $('#preface').hide();
});

Template.RiceArticle.helpers({
  rice_article: function(){
  	var obj = ICM.findOne({'name': 'rice_article'});
    if(typeof obj !== 'undefined'){
      return obj;
    }
  },

  isEnabled: function(){
  	var obj = ICM.findOne({'name': 'rice_article'});
    if(typeof obj !== 'undefined'){
      return obj.enabled;
    }
  }

});


Template.RiceArticle.events({
   'click #module1-1' : function (){
      // something
     }

});