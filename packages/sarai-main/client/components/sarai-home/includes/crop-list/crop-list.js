Template.Croplist.helpers({
  crop: function(){
  	var obj = Main.findOne({'name': 'crop-list'});
    if(typeof obj !== 'undefined'){
      console.log(obj);
      return obj;
    }
  },
  crops: function(){
  	var obj = Main.findOne({'name': 'crop-list'});
    if(typeof obj !== 'undefined'){
      console.log(obj.crops)
      return obj.crops;
    }
   }
});