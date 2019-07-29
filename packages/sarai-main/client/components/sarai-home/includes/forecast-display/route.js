FlowRouter.route("/forecast-display", {
  action: function() {
    BlazeLayout.render("ForecastDisplayLayout", {main: "ForecastDisplay"})
  }
})