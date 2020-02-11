Package.describe({
  name: 'sarai:sarai-main',
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
    "sarai:sarai-main-data",
    "sarai:sarai-services-data",
    "sarai:sarai-blog-data",
    "sarai:sarai-weather-data",
    "clinical:csv"
  ]

  api.use(packages)
  api.imply(packages)

  var lib = [
    "lib/d3.min.js",
    //"lib/leaflet.js",
  ]

  api.addFiles(lib, ["client"])

  var client = [
    "client/components/sarai-home/index.html",
    "client/components/sarai-home/events.js",

    "client/components/sarai-home/includes/banner/banner-events.js",
    "client/components/sarai-home/includes/banner/banner.html",
    "client/components/sarai-home/includes/banner/banner.js",
    "client/components/sarai-home/includes/banner/banner.less",
    "client/components/sarai-home/includes/banner/slider.html",
    "client/components/sarai-home/includes/banner/slider.js",
    "client/components/sarai-home/includes/banner/slider.less",

    "client/components/sarai-home/includes/crop-list/crop-list.html",
    "client/components/sarai-home/includes/crop-list/crop-list.js",
    "client/components/sarai-home/includes/crop-list/crop-list.less",

    "client/components/sarai-home/includes/services-list/services-list.html",
    "client/components/sarai-home/includes/services-list/services-list.js",
    "client/components/sarai-home/includes/services-list/services-list.less",

    "client/components/sarai-home/includes/reports/reports.html",
    "client/components/sarai-home/includes/reports/reports.js",
    "client/components/sarai-home/includes/reports/reports.less",

    "client/components/sarai-home/includes/blog-list/blog-list.html",
    "client/components/sarai-home/includes/blog-list/blog-list.js",
    "client/components/sarai-home/includes/blog-list/blog-list.less",

    "client/components/sarai-home/includes/testimonials/testimonials.html",
    "client/components/sarai-home/includes/testimonials/testimonials.js",
    "client/components/sarai-home/includes/testimonials/testimonials.less",

    "client/components/sarai-home/includes/weather-preview/preview.html",
    "client/components/sarai-home/includes/weather-preview/preview.js",
    "client/components/sarai-home/includes/weather-preview/preview.less",

    "client/components/sarai-home/includes/weather-preview/forecast/preview-col-forecast.html",
    "client/components/sarai-home/includes/weather-preview/forecast/preview-col-forecast.less",

    "client/components/sarai-home/includes/weather-preview/forecast/forecast-view.html",
    "client/components/sarai-home/includes/weather-preview/forecast/forecast-view.js",
    "client/components/sarai-home/includes/weather-preview/forecast/forecast-view.less",

    "client/components/sarai-home/includes/weather-preview/concise/preview-col-concise.html",
    "client/components/sarai-home/includes/weather-preview/concise/preview-col-concise.less",

    "client/components/sarai-home/includes/weather-preview/concise/preview-col-concise.js",
    "client/components/sarai-home/includes/weather-preview/concise/concise-view.html",
    "client/components/sarai-home/includes/weather-preview/concise/concise-view.js",
    "client/components/sarai-home/includes/weather-preview/concise/concise-view.less",

    "client/components/sarai-home/includes/twitter-feed/twitter-feed.html",
    "client/components/sarai-home/includes/twitter-feed/twitter-feed.js",
    "client/components/sarai-home/includes/twitter-feed/twitter-feed.less",

    "client/components/sarai-home/route.js",
    "client/components/sarai-home/helpers.js",
    "client/components/sarai-home/on-created.js",

    "lib/weather-preview/preview-helpers.js",
    "lib/weather-preview/preview-sample-data.js",
    "client/components/sarai-home/includes/rainfall-outlook/preview-col-rainfall-outlook.html",
    "client/components/sarai-home/includes/rainfall-outlook/preview-col-rainfall-outlook.less",

    "client/components/sarai-home/includes/rainfall-outlook/rainfall-outlook-view.html",
    "client/components/sarai-home/includes/rainfall-outlook/rainfall-outlook-view.js",
    "client/components/sarai-home/includes/rainfall-outlook/rainfall-outlook-view.less",

    "client/components/sarai-home/includes/heat-map-rainfall-outlook/heat-map-rainfall-helpers.js",
    "client/components/sarai-home/includes/heat-map-rainfall-outlook/heat-map-rainfall-outlook.html",
    "client/components/sarai-home/includes/heat-map-rainfall-outlook/heat-map-rainfall-outlook.js",
    "client/components/sarai-home/includes/heat-map-rainfall-outlook/heat-map-rainfall-outlook.less",
    "client/components/sarai-home/includes/heat-map-rainfall-outlook/route.js",

    "client/components/sarai-home/includes/drought-outlook/drought-outlook.html",
    "client/components/sarai-home/includes/drought-outlook/drought-outlook.js",
    "client/components/sarai-home/includes/drought-outlook/drought-outlook.less",
    "client/components/sarai-home/includes/drought-outlook/route.js",

    "client/components/sarai-home/includes/seams-images/seams-images.html",
    "client/components/sarai-home/includes/seams-images/seams-images.js",
    "client/components/sarai-home/includes/seams-images/seams-images.less",
    "client/components/sarai-home/includes/seams-images/route.js",

    "client/components/sarai-home/includes/drought-landing/drought-landing-view.html",
    "client/components/sarai-home/includes/drought-landing/drought-landing-view.js",
    "client/components/sarai-home/includes/drought-landing/drought-landing-view.less",

    "client/components/sarai-home/includes/weather-preview/graph/graph-view.html",
    "client/components/sarai-home/includes/weather-preview/graph/graph-view.js",
    "client/components/sarai-home/includes/weather-preview/graph/graph-view.less",

    "client/components/sarai-home/includes/partner-institutions/partner-institutions.html",
    "client/components/sarai-home/includes/partner-institutions/partner-institutions.js",
    "client/components/sarai-home/includes/partner-institutions/partner-institutions.less",

    "client/components/sarai-home/includes/weather-advisory/weather-advisory.html",
    "client/components/sarai-home/includes/weather-advisory/weather-advisory.js",

    "client/components/sarai-home/includes/suitability-maps/suitability-maps.html",
    "client/components/sarai-home/includes/suitability-maps/suitability-maps.js",
    "client/components/sarai-home/includes/suitability-maps/suitability-maps.less",

    "client/components/sarai-home/includes/planting-guide/planting-guide.html",
    "client/components/sarai-home/includes/planting-guide/planting-guide.js",
    "client/components/sarai-home/includes/planting-guide/planting-guide.less",

    "client/components/sarai-home/includes/advisories/advisories.html",
    "client/components/sarai-home/includes/advisories/advisories.js",
    "client/components/sarai-home/includes/advisories/advisories.less",
    "client/components/sarai-home/includes/advisories/route.js",

    "client/components/sarai-home/includes/contact-us/contact-us.html",
    "client/components/sarai-home/includes/contact-us/contact-us.js",
    "client/components/sarai-home/includes/contact-us/contact-us.less",
    "client/components/sarai-home/includes/contact-us/route.js",

    "client/components/sarai-home/includes/satellite-landing/satellite-landing.html",
    "client/components/sarai-home/includes/satellite-landing/satellite-landing.js",
    "client/components/sarai-home/includes/satellite-landing/satellite-landing.less",

    "client/components/sarai-home/includes/forecast-display/forecast-display.html",
    "client/components/sarai-home/includes/forecast-display/forecast-display.js",
    "client/components/sarai-home/includes/forecast-display/forecast-display.less",
    "client/components/sarai-home/includes/forecast-display/route.js",

    "client/components/sarai-home/includes/summary/route.js",
    "client/components/sarai-home/includes/summary/summary.js",
    "client/components/sarai-home/includes/summary/summary.html",
    "client/components/sarai-home/includes/summary/summary.less",

    "client/components/sarai-home/includes/geographic-insurance/geographic-insurance.html",
    "client/components/sarai-home/includes/geographic-insurance/geographic-insurance.js",
    "client/components/sarai-home/includes/geographic-insurance/geographic-insurance.less",
    "client/components/sarai-home/includes/geographic-insurance/route.js",


    "lib/rainfall-graph-helpers.js",
    "lib/rainfall-map-helpers.js",
    "lib/drought-map-helpers.js",
    "lib/advisories-helpers.js",


    "lib/cropping-advisories/barili-helpers.js",
    "lib/cropping-advisories/batac-helpers.js",
    "lib/cropping-advisories/butuan-helpers.js",
    "lib/cropping-advisories/calapan-helpers.js",
    "lib/cropping-advisories/cagayandeoro-helpers.js",
    "lib/cropping-advisories/echague-helpers.js",
    "lib/cropping-advisories/guinobatan-helpers.js",
    "lib/cropping-advisories/iloilo-helpers.js",
    "lib/cropping-advisories/lacarlota-helpers.js",
    "lib/cropping-advisories/lambunao-helpers.js",
    "lib/cropping-advisories/legazpi-helpers.js",
    "lib/cropping-advisories/ligao-helpers.js",
    "lib/cropping-advisories/losbanos-helpers.js",
    "lib/cropping-advisories/malaybalay-helpers.js",
    "lib/cropping-advisories/maramag-helpers.js",
    "lib/cropping-advisories/munoz-helpers.js",


    //"lib/leaflet.css",
  ]

  api.addFiles(client, "client")

  api.addAssets([
    //"public/images/pest_banner.png"
    ], "client")
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('sarai:sarai-main');
});