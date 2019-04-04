Package.describe({
  name: 'sarai:sarai-services',
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
    "sarai:sarai-services-data"
  ]

  api.use(packages)
  api.imply(packages)

  var client = [
    "client/components/sarai-pest/sarai-pest.html",
    "client/components/sarai-pest/sarai-pest.js",
    "client/components/sarai-pest/sarai-pest.less",
    "client/components/sarai-pest/route.js",

    "client/components/sarai-waiss/sarai-waiss.html",
    "client/components/sarai-waiss/sarai-waiss.js",
    "client/components/sarai-waiss/sarai-waiss.less",
    "client/components/sarai-waiss/route.js",

    "client/components/sarai-soil/sarai-soil.html",
    "client/components/sarai-soil/sarai-soil.js",
    "client/components/sarai-soil/sarai-soil.less",
    "client/components/sarai-soil/route.js",

    "client/components/sarai-kp/sarai-kp.html",
    "client/components/sarai-kp/sarai-kp.js",
    "client/components/sarai-kp/sarai-kp.less",
    "client/components/sarai-kp/route.js",

    "client/components/sarai-seams/sarai-seams.html",
    "client/components/sarai-seams/sarai-seams.js",
    "client/components/sarai-seams/sarai-seams.less",
    "client/components/sarai-seams/route.js",

    "client/components/sarai-eskwela/sarai-eskwela.html",
    "client/components/sarai-eskwela/sarai-eskwela.js",
    "client/components/sarai-eskwela/sarai-eskwela.less",
    "client/components/sarai-eskwela/route.js",

    "client/components/sarai-dcaf/sarai-dcaf.html",
    "client/components/sarai-dcaf/sarai-dcaf.js",
    "client/components/sarai-dcaf/sarai-dcaf.less",
    "client/components/sarai-dcaf/route.js",

    "client/components/sarai-aws/sarai-aws.html",
    "client/components/sarai-aws/sarai-aws.js",
    "client/components/sarai-aws/sarai-aws.less",
    "client/components/sarai-aws/route.js"
  ]

  api.addFiles(client, "client")

  api.addAssets([
    //"public/images/pest_banner.png"
    ], "client")
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('sarai:sarai-services');
});
