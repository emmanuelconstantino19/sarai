Template.MainHeader.helpers({

  isSuitability: function(){
    var routeName = FlowRouter.getRouteName();
    console.log("Current route name is: ", routeName);
    if("SuitabilityMaps"== routeName){
      return true;
    }else{
      return false;
    }
  },
  navAdmin: function(){
    if(Meteor.userId()===null){
      $("#navA").hide();
    }
    else{
      $("#navA").show();
    }
  },

  topHeader: function(){
    //return Home.find({'title': 'Hello World'});
    return Main.find({'name': 'topHeader'}).fetch()[0];
  },

  mainLinks: function(){
    var obj = Main.findOne({'name': 'mainHeader'}, {sort: {rank: 1}});

    if (obj) {
      return sortByRank(obj.links)
    }
  },

  mainH: function(){
    var obj = Main.findOne({'name' : 'mainHeader'}, {sort: {rank: 1}});
    if(typeof obj !== 'undefined'){
      return obj;
    }
  },

  hasSubLinks: (mainLink) => {
    if (mainLink.links && mainLink.links.length > 0) {
      return true
    } else {
      return false
    }
  },

  sortByRank: (links) => {
    return sortByRank(links)
  }

});

Template.MainHeader.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        FlowRouter.go("/pests");
    }
});


sortByRank = (items) => {
  //temporary code to remove SPIDTech and SARAi Eskwela as sublink for Services
  const filtered = items.filter(function(value, index, arr){
    return value.name!="SPIDTech" && value.name!="SARAi Eskwela" && value.name!="Crop Production Area"
  })

  
  const sorted = filtered.sort((a, b) => {
    return a.rank - b.rank
  })

  return sorted
}

LoggedIn = function(){
  if(Meteor.userId()===null){
    return false;
  }
  else{
    return true;
  }
}