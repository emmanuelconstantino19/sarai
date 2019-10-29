FlowRouter.route("/seams-images", {
  action: function() {
    BlazeLayout.render("MonitoringLayout", {main: "SeamsImages"})
  }
})