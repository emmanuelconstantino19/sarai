Package.describe({
  name: 'sarai:sarai-rainfall-distribution',
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
    "sarai:sarai-rainfall-distribution-data",
    "sarai:sarai-weather-data"
  ]

  api.use(packages)
  api.imply(packages)

  var lib = [
    "lib/d3.min.js"
  ]
  
  api.addFiles(lib, ["client", "server"])

  var client = [
    "client/components/route.js",

    "client/components/rainfall-distribution.html",
    "client/components/rainfall-distribution.js",
    "client/components/rainfall-distribution.less",

    "lib/rainfall-distribution-helpers.js",
    "lib/sample-data.js"
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
