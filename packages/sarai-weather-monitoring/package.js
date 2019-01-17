Package.describe({
  name: 'sarai:sarai-weather-monitoring',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  var packages = [
    "sarai:sarai-lib",
    "sarai:sarai-user",
    "sarai:sarai-admin",
    "sarai:sarai-layout",
    "sarai:sarai-weather-data"
  ]

  api.use(packages)
  api.imply(packages)

  var client = [
    // weather monitoring v2
    "client/components/weather-monitoring-v2/weather-monitoring-v2.html",
    "client/components/weather-monitoring-v2/weather-monitoring-v2.js",
    "client/components/weather-monitoring-v2/weather-monitoring-v2.less",

    // temperature heatmap
    "client/components/weather-monitoring-v2/temperature-heatmap.html",
    "client/components/weather-monitoring-v2/temperature-heatmap.js",

    // rain heatmap
    "client/components/weather-monitoring-v2/rain-heatmap.html",
    "client/components/weather-monitoring-v2/rain-heatmap.js",

    // weather stations
    "client/components/weather-monitoring-v2/weather-stations.html",
    "client/components/weather-monitoring-v2/weather-stations.js",

    // route
    "client/components/weather-monitoring-v2/route.js",

    // helpers
    "lib/chart-helpers.js",
    "lib/accumulated-rain-helpers.js",
    "lib/year-chart-helpers.js",
    "lib/sample-data.js",
    "lib/rainfall-forecast-helpers.js"
  ]

  api.addFiles(client, "client")

  api.addAssets([
    //"public/images/pest_banner.png"
    ], "client")
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
});
