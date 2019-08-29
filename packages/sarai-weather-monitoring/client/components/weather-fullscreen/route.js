FlowRouter.route("/weather-fullscreen", {
  action: () => {
    BlazeLayout.render("MonitoringLayout", {main: "WeatherFullscreen"})
  }
})