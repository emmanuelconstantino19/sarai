Package.describe({
  name: 'sarai:sarai-weather-data',
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
    "sarai:sarai-lib"
  ]

  api.use(packages)
  api.imply(packages)

  var lib = [
    "lib/collections/sarai-dss-settings.js",
    "lib/collections/sarai-heat-map-data.js",
    "lib/collections/sarai-weather-data.js",
    "lib/collections/sarai-weather-stations.js",
    "lib/collections/sarai-wunderground-data.js"
  ]

  api.addFiles(lib, ["client", "server"])

  var server = [
    "server/methods.js",
    "server/publications.js",

    "server/fixtures/dss-settings-fixtures.js",
    "server/fixtures/weather-stations-fixtures.js"
  ]

  api.addFiles(server, "server")

  api.addAssets([
    ], "client")

  api.export([
    "HeatMapData",
    "WeatherData",
    "WeatherStations",
    "DSSSettings",
    "WundergroundData"
  ])
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('sarai:sarai-weather-data');
});
