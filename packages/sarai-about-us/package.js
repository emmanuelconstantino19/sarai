Package.describe({
  name: 'sarai:sarai-about-us',
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
    "sarai:sarai-about-data"
  ]

  api.use(packages)
  api.imply(packages)

  var client = [
    "client/components/sarai-about/index.html",
    "client/components/sarai-about/events.js",
    "client/components/sarai-about/includes/banner/banner.html",
    "client/components/sarai-about/includes/banner/banner.js",
    "client/components/sarai-about/includes/banner/banner.less",

    "client/components/sarai-about/includes/story/story.html",
    "client/components/sarai-about/includes/story/story.js",
    "client/components/sarai-about/includes/story/story.less",

    "client/components/sarai-about/includes/projects/projects.less",
   "client/components/sarai-about/includes/projects/projects.html",
    "client/components/sarai-about/includes/projects/projects.js",


    "client/components/sarai-about/includes/project-leaders/leaders.less",
    "client/components/sarai-about/includes/project-leaders/leaders.html",
    "client/components/sarai-about/includes/project-leaders/leaders.js",

    "client/components/sarai-about/includes/partner-institutions/partners.less",
    "client/components/sarai-about/includes/partner-institutions/partners.html",
    "client/components/sarai-about/includes/partner-institutions/partners.js",


    "client/components/sarai-about/includes/title/title.less",
    "client/components/sarai-about/includes/title/title.html",
    "client/components/sarai-about/includes/title/title.js",

      "client/components/sarai-about/includes/videos/videos.less",
    "client/components/sarai-about/includes/videos/videos.html",
    "client/components/sarai-about/includes/videos/videos.js",

    "client/components/sarai-about/includes/suc-map/suc.less",
    "client/components/sarai-about/includes/suc-map/suc.html",
    "client/components/sarai-about/includes/suc-map/suc.js",
    /*"client/components/sarai-about/includes/videos/videos.js",
    "client/components/sarai-about/includes/videos/videos.html",*/
    "client/components/sarai-about/route.js",
    "client/components/sarai-about/helpers.js",
    "client/components/sarai-about/on-created.js"
  ]

  api.addFiles(client, "client")

  api.addAssets([
    //"public/images/pest_banner.png"
    ], "client")
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('sarai:sarai-about-us');
});