define(['knockout', 'underscore', 'rdfstore', 'state'], function(ko, _, rdfstore, state) {
  'use strict';

  // Create state object (singleton)
  var rdf = state.store.rdf;
  rdf.resolved = function(prefixed) {
    return rdf.createNamedNode(rdf.resolve(prefixed));
  }

  return rdf;
});