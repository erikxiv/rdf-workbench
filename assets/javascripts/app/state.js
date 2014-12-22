define(['knockout', 'underscore', 'rdfstore'], function(ko, _, rdfstore) {
  'use strict';

  var _store = rdfstore.create();
  var _prefixes = ko.observableArray();
  var _defaultPrefix = ko.observable('urn:x-default:');
  var _statementCount = ko.observable(0);
  var _classes = ko.observableArray();
  var _predicates = ko.observableArray();

  // Initialize store
  _store.setBatchLoadEvents(true);
  _store.registerDefaultProfileNamespaces();
  _store.setDefaultPrefix(_defaultPrefix());
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
    _store.registerDefaultNamespace(prefix, namespace);
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

  function getPrefixesForSparql() {
    return $.map(
      _store.rdf.prefixes.values(), 
      function(value, index) {
        return 'PREFIX ' + index + ': <' + value + '>\n';
      }
    ).join(['']);
  }

  _store.startObservingQuery('SELECT * WHERE { ?s ?p ?o }', function(result) { _statementCount(result.length); });
  // C rdf:type rdfs:Class
  // P rdf:type rdf:Property
  // I rdf:type C
  // P rdfs:domain C
  // P rdfs:range C
  // Observe any class definitions to keep an up-to-date observableArray
  // Class = { iri: iri, prefixed: prefixed }
  _store.startObservingQuery('SELECT DISTINCT ?class WHERE { ?class <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> }', function(result) {
    _classes(_.map(result, function(c) {
      return {
        type: '<http://www.w3.org/2000/01/rdf-schema#Class>',
        iri: c.class.value,
        prefixed: _store.rdf.prefixes.shrink(c.class.value)
      };
    }));
    console.log("Classes updated:");
    console.log(_classes());
  });
  // Observe any properties to keep an up-to-date observableArray
  // Property = { iri: iri, prefixed: prefixed }
  _store.startObservingQuery('SELECT DISTINCT ?p WHERE { ?s ?p ?o }', function(result) {
    _predicates(_.map(result, function(c) {
      return {
        type: '<http://www.w3.org/1999/02/22-rdf-syntax-ns#Property>',
        iri: c.p.value,
        prefixed: _store.rdf.prefixes.shrink(c.p.value)
      };
    }));
    console.log("Predicates updated:");
    console.log(_predicates());
  });

  // Create state object (singleton)
  var state = {
    store: _store,
    defaultPrefix: _defaultPrefix,
    prefixes: _prefixes,
    setPrefix: setPrefix,
    resolvePrefix: resolvePrefix,
    removePrefix: removePrefix,
    sortPrefixes: sortPrefixes,
    statementCount: _statementCount,
    classes: _classes,
    predicates: _predicates,
    classCount: ko.computed(function() { return _classes().length; }),
    predicateCount: ko.computed(function() { return _predicates().length; }),
    getPrefixesForSparql: getPrefixesForSparql
  };

  // Return state object (singleton)
  window.state = state;
  return state;
});