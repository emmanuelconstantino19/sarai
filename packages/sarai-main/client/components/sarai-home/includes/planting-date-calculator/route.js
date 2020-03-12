FlowRouter.route("/planting-date-calculator", {
  action: function() {
    BlazeLayout.render("MonitoringLayout", {main: "PlantingDateCalculator"})
  }
})