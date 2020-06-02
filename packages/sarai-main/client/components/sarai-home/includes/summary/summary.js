Template.SummaryPage.onRendered(() => {
    $('<div class="meteogram">').appendTo('#rainfall-nueva').highcharts(Meteor.RainfallGraph.constructChart('Nueva Ecija', [100,200,300,400,500]))
})