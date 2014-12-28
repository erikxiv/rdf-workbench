define(['knockout', 'underscore', 'rdfstore'], function(ko, _, rdfstore) {
  'use strict';

  var _store = rdfstore.create();
  var _prefixes = ko.observableArray();
  var _defaultPrefix = ko.observable('urn:x-default:');
  var _statementCount = ko.observable(0);
  var _classes = ko.observableArray();
  var _predicates = ko.observableArray();
  var _rules = [
    { rule: 'rdfD2', construct: 'construct { ?p rdf:type rdf:Property } where { ?s ?p ?o FILTER NOT EXISTS { ?p rdf:type rdf:Property } }' },
    { rule: 'rdfs2', construct: 'construct { ?yyy rdf:type ?xxx } where { ?aaa rdfs:domain ?xxx . ?yyy ?aaa ?zzz . FILTER NOT EXISTS { ?yyy rdf:type ?xxx } }' },
// Must filter out literals in subject position
//    { rule: 'rdfs3', construct: 'construct { ?zzz rdf:type ?xxx } where { ?aaa rdfs:range ?xxx . ?yyy ?aaa ?zzz . FILTER NOT EXISTS { ?zzz rdf:type ?xxx } }' },
    { rule: 'rdfs4a', construct: 'construct { ?xxx rdf:type rdfs:Resource } where { ?xxx ?aaa ?yyy . FILTER NOT EXISTS { ?xxx rdf:type rdfs:Resource } }' },
// Must filter out literals in subject position
//    { rule: 'rdfs4b', construct: 'construct { ?yyy rdf:type rdfs:Resource } where { ?xxx ?aaa ?yyy . FILTER NOT EXISTS { ?yyy rdf:type rdfs:Resource } }' },
    { rule: 'rdfs5', construct: 'construct { ?xxx rdfs:subPropertyOf ?zzz } where { ?xxx rdfs:subPropertyOf ?yyy . ?yyy rdfs:subPropertyOf ?zzz . FILTER NOT EXISTS { ?xxx rdfs:subPropertyOf ?zzz } }' },
    { rule: 'rdfs6', construct: 'construct { ?xxx rdfs:subPropertyOf ?xxx } where { ?xxx rdf:type rdf:Property . FILTER NOT EXISTS { ?xxx rdfs:subPropertyOf ?xxx } }' },
    { rule: 'rdfs7', construct: 'construct { ?xxx ?bbb ?yyy } where { ?aaa rdfs:subPropertyOf ?bbb . ?xxx ?aaa ?yyy . FILTER NOT EXISTS { ?xxx ?bbb ?yyy } }' },
    { rule: 'rdfs8', construct: 'construct { ?xxx rdfs:subClassOf rdfs:Resource } where { ?xxx rdf:type rdfs:Class . FILTER NOT EXISTS { ?xxx rdfs:subClassOf rdfs:Resource } }' },
    { rule: 'rdfs9', construct: 'construct { ?zzz rdf:type ?yyy } where { ?xxx rdfs:subClassOf ?yyy . ?zzz rdf:type ?xxx . FILTER NOT EXISTS { ?zzz rdf:type ?yyy } }' },
    { rule: 'rdfs10', construct: 'construct { ?xxx rdfs:subClassOf ?xxx } where { ?xxx rdf:type rdfs:Class . FILTER NOT EXISTS { ?xxx rdfs:subClassOf ?xxx } }' },
    { rule: 'rdfs11', construct: 'construct { ?xxx rdfs:subClassOf ?zzz } where { ?xxx rdfs:subClassOf ?yyy . ?yyy rdfs:subClassOf ?zzz . FILTER NOT EXISTS { ?xxx rdfs:subClassOf ?zzz } }' },
    { rule: 'rdfs12', construct: 'construct { ?xxx rdfs:subPropertyOf rdfs:member } where { ?xxx rdf:type rdfs:ContainerMembershipProperty . FILTER NOT EXISTS { ?xxx rdfs:subPropertyOf rdfs:member } }' },
    { rule: 'rdfs13', construct: 'construct { ?xxx rdfs:subClassOf rdfs:Literal } where { ?xxx rdf:type rdfs:Datatype . FILTER NOT EXISTS { ?xxx rdfs:subClassOf rdfs:Literal } } ' }
  ];

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

  // Infer new triples using entailment rules
  function evaluateRules() {
    var triplesAdded = false;
    var triplesBefore = _statementCount();
    do {
      triplesAdded = false;
      // Iterate and execute rules. Break if any triples are added
      for (var i = 0; i < _rules.length && !triplesAdded; i++) {
        _store.execute(
          getPrefixesForSparql() + _rules[i].construct,
          function(success, graph) {
            if (success) {
              if (graph.length > 0) {
                console.log('Rule ' + _rules[i].rule + ' +' + graph.length);
                _store.insert(graph, function() {});
                triplesAdded = true;
              }
            }
            else
              console.log("Failed to execute rule " + _rules[i].rule);
          }
        );
      }
    }
    while (triplesAdded);
    triplesAdded = _statementCount() - triplesBefore;
    console.log("Rule entailment evaluation: " + triplesBefore + " + " + triplesAdded + " = " + (triplesBefore+triplesAdded));
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
    // console.log("Classes updated:");
    // console.log(_classes());
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
    // console.log("Predicates updated:");
    // console.log(_predicates());
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
    getPrefixesForSparql: getPrefixesForSparql,
    evaluateRules: evaluateRules
  };

  // Return state object (singleton)
  window.state = state;
  return state;
});