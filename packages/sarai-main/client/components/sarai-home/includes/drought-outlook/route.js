FlowRouter.route("/drought", {
  action: function() {
    BlazeLayout.render("MonitoringLayout", {main: "DroughtOutlook"})
  }
})