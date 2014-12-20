define(['bootstrap', 'plugins/router', 'durandal/app'], function (bootstrap, router, app) {
  return {
    router: router,
    search: function() {
      //It's really easy to show a message box.
      //You can add custom options too. Also, it returns a promise for the user's response.
      app.showMessage('Search not yet implemented...');
    },
    activate: function () {
      router.map([
        { route: '', title:'Import', moduleId: 'viewmodels/import', nav: false },
        { route: 'prefix', title:'Prefixes', moduleId: 'viewmodels/prefix', nav: true },
        { route: 'import', title:'Import', moduleId: 'viewmodels/import', nav: true },
        { route: 'export', title:'Export', moduleId: 'viewmodels/export', nav: true },
        { route: 'sparql', title:'SPARQL', moduleId: 'viewmodels/sparql', nav: true },
        { route: 'table', title:'Table', moduleId: 'viewmodels/table', nav: true },
        { route: 'list', title:'List', moduleId: 'viewmodels/list', nav: true },
      ]).buildNavigationModel();
      
      return router.activate();
    }
  };
});