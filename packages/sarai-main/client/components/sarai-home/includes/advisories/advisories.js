Template.CropAdvisories.onRendered(() => {
  $('<div class="meteogram">').appendTo('#new_chart').highcharts(Meteor.PlantingGuideGraph.constructChart())
})/** function end of onrendered **/
