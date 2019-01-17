Package.describe({
  name: 'sarai:sarai-lib',
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
    "meteor-base@1.0.1",
    "mongo@1.1.2",
    "blaze-html-templates@1.0.1",
    "session@1.1.1",
    "jquery@1.11.4",
    "tracker@1.0.9",
    "standard-minifiers@1.0.1",
    "es5-shim@4.1.13",
    "ecmascript@0.1.5",
    "reactive-var",
    "http@1.1.1",
    "email@1.0.7",
    "less@2.5.0_3",
    "underscore@1.0.4",
    "check",
    "chuangbo:marked@0.3.5_1",
    "meteorhacks:kadira@2.23.6",
    "meteorhacks:kadira-profiler@1.2.1",
    "kadira:debug@2.2.4",
    "kadira:flow-router@2.7.0",
    "kadira:blaze-layout@2.2.0",
    "meteorhacks:sikka@1.0.1",
    "ongoworks:security@1.3.0",
    "zodiase:mdl@1.1.3_1",
    "chrismbeckett:toastr@2.1.2_1",
    "dburles:google-maps@1.1.5",
    "momentjs:moment@2.10.6",
    "arillo:flow-router-helpers",
    "matteodem:easy-search@1.5.6",
    "meteorhacks:search-source@1.3.0",
    "sacha:spin",
    "copleykj:shower",
    "mrt:underscore-string-latest",
    "themeteorchef:jquery-validation",
    "tomi:upload-server@1.3.1",
    "tomi:upload-jquery@2.2.3",
    "raix:ui-dropped-event",
    // "cfs:standard-packages",
    // "cfs:gridfs",
    "udondan:slick",
    "summernote:summernote",
    "j4507:datatables-bootstrap-3",
    // "jhuenges:highstock",
    // "highcharts:highcharts-meteor",
    "random"
  ]

  api.use(packages)
  api.imply(packages)

  api.addFiles("init.js")

  api.export([
    "Sarai"
    ])
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('sarai:sarai-lib');
});
