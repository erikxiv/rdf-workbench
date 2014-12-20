define(['knockout', 'underscore', 'rdfstore'], function(ko, _, rdfstore) {
  'use strict';

  var _store = rdfstore.create();
  var _prefixes = ko.observableArray();

  // Initialize prefix map
  _prefixes($.map(
    _store.rdf.prefixes.values(), 
    function(value, index) {
      return {
        prefix: index,
        namespace: value};
      }
  ));
  sortPrefixes();

  function setPrefix(prefix, namespace) {
    if (resolvePrefix(prefix))
      removePrefix(prefix);
    _store.rdf.setPrefix(prefix, namespace);
    _prefixes.push({prefix: prefix, namespace: namespace});
    sortPrefixes();
  }

  function resolvePrefix(prefix) {
    return _store.rdf.prefixes[prefix];
  }

  function removePrefix(prefix) {
    _store.rdf.setPrefix(prefix, null);
    _prefixes.remove(function(item) { return item.prefix === prefix; });
  }

  function sortPrefixes(byNamespace) {
    if (!byNamespace)
      _prefixes.sort(function(left, right) { return left.prefix < right.prefix ? -1 : 1; });
    else
      _prefixes.sort(function(left, right) { return left.namespace === right.namespace ? 0 : left.namespace < right.namespace ? -1 : 1; });
  }

  // Create state object (singleton)
  var state = {
    store: _store,
    prefixes: _prefixes,
    setPrefix: setPrefix,
    resolvePrefix: resolvePrefix,
    removePrefix: removePrefix,
    sortPrefixes: sortPrefixes
  };

  // Return state object (singleton)
  window.state = state;
  return state;
});