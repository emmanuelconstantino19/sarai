Template.Bloglist.helpers({
  blogMain: function(){
    var obj = Main.findOne({'name': 'blogs'});
    if(typeof obj !== 'undefined'){
      return obj;
    }
   },
  blogs: function(){
    var names = [
      'training-cms',
      'simplifying-cs',
      'bringing-amdt',
      'project-sm',
      'joins-dost'
    ];
    var obj = Blog.find({name: {$in: names}}, {sort: {date: -1}}).fetch();
    if(typeof obj !== 'undefined'){
      var list = obj.slice(0,3);
      return list;
    }
  }
});

Template.registerHelper("makeString", function(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if(typeof date != 'undefined'){
      var month = monthNames[date.getMonth()];
      var day = date.getDate();
      var year = date.getFullYear();
      var fulldatestring = month + " " + day + ", " + year;
      return fulldatestring;
    }
});

Template.registerHelper("count", function(comments) {
    if(typeof comments != 'undefined'){
      return comments.length;
    }
});