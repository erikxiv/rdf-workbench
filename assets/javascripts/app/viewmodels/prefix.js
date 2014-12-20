define(['underscore', 'knockout', 'state'], function (_, ko, state) {

  function maybeAddPrefix(prefix, namespace) {
    console.log('new? ' + prefix + ' ' + namespace);
  }

  return {
    displayName: 'Prefixes',
    state: state,
    headers: [
      { title: "Prefix", sortKey: "prefix" },
      { title: "Namespace", sortKey: "namespace" }
    ],
    prefixes: state.prefixes,
    prefix: ko.observable("newprefix"),
    namespace: ko.observable("newnamespace"),
    
    addPrefix: function(d, e) {
      // Add prefix if Enter is pressed
      if (e.keyCode === 13) {
        state.setPrefix(this.prefix(), this.namespace());
        this.prefix("newprefix");
        this.namespace("newnamespace");
      }
      return true;
    },
    sort: function(e) {
      state.sortPrefixes(e.sortKey!=="prefix");
    },
    attached: function (view, parent) {
    },
    compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
    }
  };
});