Template.MonitoringHeader.helpers({

  monitoringLinks: function(){
    var obj = Main.findOne({'name': 'monitoringHeader'}, {sort: {rank: 1}});
    
    if(obj){
    const monitoring_links = obj.links;
    const filtered = monitoring_links.filter(function(value, index, arr){
      return value.name!="Comparative Satellite Images"
    })
      return sortByRank(filtered)
    }
  },

  monitoringH: function(){
    var obj = Main.findOne({'name' : 'monitoringHeader'}, {sort: {rank: 1}});
    if(typeof obj !== 'undefined'){
      return obj;
    }
  },

  hasMonitoringSubLinks: (monitoringLink) => {
    if (monitoringLink.links && monitoringLink.links.length > 0) {
      return true
    } else {
      return false
    }
  },

  monitoringSortByRank: (links) => {
    return monitoringSortByRank(links)
  }

});

monitoringSortByRank = (items) => {
  const sorted = items.sort((a, b) => {
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