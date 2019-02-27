FlowRouter.route("/crop-advisories", {
  action: function() {
    BlazeLayout.render("MonitoringLayout", {main: "CropAdvisories"})
  }
})