FlowRouter.route("/forecast-display-clsu", {
  action: function() {
    BlazeLayout.render("ForecastDisplayLayout", {main: "ForecastDisplayCLSU"})
  }
})