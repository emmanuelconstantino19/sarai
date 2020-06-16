Template.MainHeader.helpers({
  mainLinks: function(){
    return [ 

    { "name" : "About Us", "href" : "/about-us", "links" : [ ], "id" : "about-us-link", "withsublinks" : false}, 
    
    //{ "name" : "Sarai Community", "href" : "https://sarai-community.net/", "links" : [ ], "id" : "sarai-community", "withsublinks" : false },

    //{ "name" : "Crops", "href" : "", "links" : [ { "name" : "Rice", "href" : "http://202.92.144.48/group/beuabwyiDZra2oijS"}, { "name" : "Corn", "href" : "http://202.92.144.48/group/aiJfWbo2EJ8PWn7Pi"}, { "name" : "Banana", "href" : "http://202.92.144.48/group/Ekr3Jio4mMEFR7nYs"}, { "name" : "Coconut", "href" : "http://202.92.144.48/group/Po7X6NYHpiYTYY2h9"}, { "name" : "Coffee", "href" : "http://202.92.144.48/group/3x5kngCzoxGWeN9rr"}, { "name" : "Cacao", "href" : "http://202.92.144.48/group/fTWm5oaZMZHkpevrT"}, { "name" : "Sugarcane", "href" : "http://202.92.144.48/group/iPsngYWob8vQr87fj"}, { "name" : "Tomato", "href" : "http://202.92.144.48/group/v4rCJArpPkX9GgaEb"}, { "name" : "Soybean", "href" : "http://202.92.144.48/group/9kXG5BBFjYJiH5ztJ"} ], "id" : "explore-link", "withsublinks" : true}, 

    { "name" : "Advisories", "href" : "/advisories", "links" : [ ], "id" : "advisories-link", "withsublinks" : false},

    { "name" : "Maps", "href" : "", "links" : [ { "name" : "Suitability Maps", "href" : "http://139.59.125.198/suitability-maps"}, { "name" : "Normalized Difference Vegetation Index", "href" : "http://139.59.125.198/ndvi"}, { "name" : "Rainfall Map", "href" : "http://139.59.125.198/rainfall-maps"}, { "name" : "SVTR Map", "href" : "http://139.59.125.198/agri-drought"},, { "name" : "Enhanced Vegetation Index", "href" : "http://139.59.125.198/evi"} ], "id" : "dss-link", "withsublinks" : true}, 

    { "name" : "Services", "href" : "", "links" : [ { "name" : "Rainfall Outlook", "href" : "/heat-map-rainfall-outlook"},  { "name" : "Drought Forecast", "href" : "/drought"},  { "name" : "Weather Monitoring", "href" : "/weather-monitoring"},  { "name" : "Sarai Community", "href" : "http://202.92.144.48/"}], "id" : "get-involved-link", "withsublinks" : true} 
      
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