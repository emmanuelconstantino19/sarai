Template.WaterDeficitChart.onRendered(function() {
    var self = this;

    self.autorun(function() {
        var data = Template.currentData();
        $('#' + data.chartId).highcharts(data.chartData);
    });
});