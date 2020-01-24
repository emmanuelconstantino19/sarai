FlowRouter.route("/summary", {
  action: function() {
    BlazeLayout.render("MonitoringLayout", {main: "Summary"})
  }
})