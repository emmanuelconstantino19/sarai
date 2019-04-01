Template.MainHeader.helpers({
  mainLinks: function(){
    return [ 

    { "name" : "About Us", "href" : "/about-us", "links" : [ ], "id" : "about-us-link", "withsublinks" : false}, 

    { "name" : "Crops", "href" : "", "links" : [ { "name" : "Rice", "href" : "/icm-rice"}, { "name" : "Corn", "href" : "/icm-corn"}, { "name" : "Banana", "href" : "/icm-banana"}, { "name" : "Coconut", "href" : "/icm-coconut"}, { "name" : "Coffee", "href" : "/icm-coffee"}, { "name" : "Cacao", "href" : "/icm-cacao"} ], "id" : "explore-link", "withsublinks" : true}, 

    { "name" : "Maps", "href" : "", "links" : [ { "name" : "Suitability Maps", "href" : "http://139.59.125.198/suitability-maps"}, { "name" : "Normalized Difference Vegetation Index", "href" : "http://139.59.125.198/ndvi"}, { "name" : "Rainfall Map", "href" : "http://139.59.125.198/rainfall-maps"}, { "name" : "SVTR Map", "href" : "http://139.59.125.198/agri-drought"},, { "name" : "Enhanced Vegetation Index", "href" : "http://139.59.125.198/evi"} ], "id" : "dss-link", "withsublinks" : true}, 

    { "name" : "Services", "href" : "", "links" : [ { "name" : "Rainfall Outlook", "href" : "/heat-map-rainfall-outlook"}, { "name" : "Suitability", "href" : "/suitability-gallery"},  { "name" : "Drought Forecast", "href" : "/drought"},  { "name" : "Weather Monitoring", "href" : "/weather-monitoring"}], "id" : "get-involved-link", "withsublinks" : true} 
      
    //{ "name" : "Contact Us", "href" : "", "links" : [ { "name" : "Subscribe", "href" : "https://goo.gl/forms/i4jW7LshCSQpuyZ23"} ], "id" : "contact-us-link", "withsublinks" : true} 

    ]
  },

  hasSubLinks: (mainLink) => {
    if (mainLink.links && mainLink.links.length > 0) {
      return true
    } else {
      return false
    }
  }

});

Template.MainHeader.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        FlowRouter.go("/pests");
    }
});

LoggedIn = function(){
  if(Meteor.userId()===null){
    return false;
  }
  else{
    return true;
  }
}