requirejs.config({
  paths: {
    'text': '../vendor/requirejs-text/text',
    'jquery-base64': '../vendor/jquery-base64/jquery.base64',
    'knockout': '../vendor/knockoutjs/knockout',
    'jquery': '../vendor/jquery/jquery',
    'bootstrap': '../vendor/bootstrap/bootstrap',
    'durandal':'../vendor/durandal',
    'plugins' : '../vendor/durandal/plugins',
    'rdfstore' : '../vendor/rdfstore/rdf_store_min',
    'underscore' : '../vendor/underscore/underscore',
    'papaparse' : '../vendor/papaparse/papaparse',
    'transitions' : '../vendor/durandal/transitions'
  },
  shim: {
    'rdfstore': {
      deps: [],
      exports: 'rdfstore'
    },
    'papaparse': {
      deps: [],
      exports: 'Papa'
    },
    'bootstrap': {
      deps: ['jquery'],
      exports: 'jQuery'
    },
    'jquery-base64': {
      deps: ['jquery'],
      exports: 'jQuery'
    }
  }
});

define(function(require) {
  var app = require('durandal/app'),
    viewLocator = require('durandal/viewLocator'),
    system = require('durandal/system');

  //>>excludeStart("build", true);
  system.debug(true);
  //>>excludeEnd("build");

  app.title = 'Workbench';

  app.configurePlugins({
    router:true,
    dialog: true,
    widget: true
  });

  app.start().then(function() {
    //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
    //Look for partial views in a 'views' folder in the root.
    viewLocator.useConvention();

    //Show the app by setting the root view model for our application with a transition.
    app.setRoot('viewmodels/shell', 'entrance');
  });
});