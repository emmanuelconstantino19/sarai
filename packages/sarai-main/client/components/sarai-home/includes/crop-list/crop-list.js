Template.Croplist.helpers({
  crop: function(){
  	var obj = Main.findOne({'name': 'crop-list'});
    if(typeof obj !== 'undefined'){
      return obj;
    }
  },
  crops: function(){
  	var obj = Main.findOne({'name': 'crop-list'});
    if(typeof obj !== 'undefined'){
      return obj.crops;
    }
   }
});