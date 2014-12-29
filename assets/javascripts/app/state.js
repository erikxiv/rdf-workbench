define(['knockout', 'underscore', 'rdfstore'], function(ko, _, rdfstore) {
  'use strict';

  var RDF_TURTLE = '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix owl: <http://www.w3.org/2002/07/owl#> .\n@prefix dc: <http://purl.org/dc/elements/1.1/> .\n\n<http://www.w3.org/1999/02/22-rdf-syntax-ns#> a owl:Ontology ;\n\tdc:title "The RDF Concepts Vocabulary (RDF)" ;\n\tdc:description "This is the RDF Schema for the RDF vocabulary terms in the RDF Namespace, defined in RDF 1.1 Concepts." .\n\nrdf:HTML a rdfs:Datatype ;\n\trdfs:subClassOf rdfs:Literal ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:seeAlso <http://www.w3.org/TR/rdf11-concepts/#section-html> ;\n\trdfs:label "HTML" ;\n\trdfs:comment "The datatype of RDF literals storing fragments of HTML content" .\n\nrdf:langString a rdfs:Datatype ;\n\trdfs:subClassOf rdfs:Literal ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:seeAlso <http://www.w3.org/TR/rdf11-concepts/#section-Graph-Literal> ;\n\trdfs:label "langString" ;\n\trdfs:comment "The datatype of language-tagged string values" .\n\nrdf:PlainLiteral a rdfs:Datatype ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:subClassOf rdfs:Literal ;\n\trdfs:seeAlso <http://www.w3.org/TR/rdf-plain-literal/> ;\n\trdfs:label "PlainLiteral" ;\n\trdfs:comment "The class of plain (i.e. untyped) literal values, as used in RIF and OWL 2" .\n\nrdf:type a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "type" ;\n\trdfs:comment "The subject is an instance of a class." ;\n\trdfs:range rdfs:Class ;\n\trdfs:domain rdfs:Resource .\n\nrdf:Property a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Property" ;\n\trdfs:comment "The class of RDF properties." ;\n\trdfs:subClassOf rdfs:Resource .\n\nrdf:Statement a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Statement" ;\n\trdfs:subClassOf rdfs:Resource ;\n\trdfs:comment "The class of RDF statements." .\n\nrdf:subject a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "subject" ;\n\trdfs:comment "The subject of the subject RDF statement." ;\n\trdfs:domain rdf:Statement ;\n\trdfs:range rdfs:Resource .\n\nrdf:predicate a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "predicate" ;\n\trdfs:comment "The predicate of the subject RDF statement." ;\n\trdfs:domain rdf:Statement ;\n\trdfs:range rdfs:Resource .\n\nrdf:object a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "object" ;\n\trdfs:comment "The object of the subject RDF statement." ;\n\trdfs:domain rdf:Statement ;\n\trdfs:range rdfs:Resource .\n\nrdf:Bag a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Bag" ;\n\trdfs:comment "The class of unordered containers." ;\n\trdfs:subClassOf rdfs:Container .\n\nrdf:Seq a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Seq" ;\n\trdfs:comment "The class of ordered containers." ;\n\trdfs:subClassOf rdfs:Container .\n\nrdf:Alt a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Alt" ;\n\trdfs:comment "The class of containers of alternatives." ;\n\trdfs:subClassOf rdfs:Container .\n\nrdf:value a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "value" ;\n\trdfs:comment "Idiomatic property used for structured values." ;\n\trdfs:domain rdfs:Resource ;\n\trdfs:range rdfs:Resource .\n\nrdf:List a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "List" ;\n\trdfs:comment "The class of RDF Lists." ;\n\trdfs:subClassOf rdfs:Resource .\n\nrdf:nil a rdf:List ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "nil" ;\n\trdfs:comment "The empty list, with no items in it. If the rest of a list is nil then the list has no more items in it." .\n\nrdf:first a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "first" ;\n\trdfs:comment "The first item in the subject RDF list." ;\n\trdfs:domain rdf:List ;\n\trdfs:range rdfs:Resource .\n\nrdf:rest a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "rest" ;\n\trdfs:comment "The rest of the subject RDF list after the first item." ;\n\trdfs:domain rdf:List ;\n\trdfs:range rdf:List .\n\nrdf:XMLLiteral a rdfs:Datatype ;\n\trdfs:subClassOf rdfs:Literal ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "XMLLiteral" ;\n\trdfs:comment "The datatype of XML literal values." .\n';
  var RDFS_TURTLE = '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix owl: <http://www.w3.org/2002/07/owl#> .\n@prefix dc: <http://purl.org/dc/elements/1.1/> .\n\n<http://www.w3.org/2000/01/rdf-schema#> a owl:Ontology ;\n  dc:title "The RDF Schema vocabulary (RDFS)" .\n\nrdfs:Resource a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Resource" ;\n  rdfs:comment "The class resource, everything." .\n\nrdfs:Class a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Class" ;\n  rdfs:comment "The class of classes." ;\n  rdfs:subClassOf rdfs:Resource .\n\nrdfs:subClassOf a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "subClassOf" ;\n  rdfs:comment "The subject is a subclass of a class." ;\n  rdfs:range rdfs:Class ;\n  rdfs:domain rdfs:Class .\n\nrdfs:subPropertyOf a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "subPropertyOf" ;\n  rdfs:comment "The subject is a subproperty of a property." ;\n  rdfs:range rdf:Property ;\n  rdfs:domain rdf:Property .\n\nrdfs:comment a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "comment" ;\n  rdfs:comment "A description of the subject resource." ;\n  rdfs:domain rdfs:Resource ;\n  rdfs:range rdfs:Literal .\n\nrdfs:label a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "label" ;\n  rdfs:comment "A human-readable name for the subject." ;\n  rdfs:domain rdfs:Resource ;\n  rdfs:range rdfs:Literal .\n\nrdfs:domain a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "domain" ;\n  rdfs:comment "A domain of the subject property." ;\n  rdfs:range rdfs:Class ;\n  rdfs:domain rdf:Property .\n\nrdfs:range a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "range" ;\n  rdfs:comment "A range of the subject property." ;\n  rdfs:range rdfs:Class ;\n  rdfs:domain rdf:Property .\n\nrdfs:seeAlso a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "seeAlso" ;\n  rdfs:comment "Further information about the subject resource." ;\n  rdfs:range rdfs:Resource ;\n  rdfs:domain rdfs:Resource .\n\nrdfs:isDefinedBy a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:subPropertyOf rdfs:seeAlso ;\n  rdfs:label "isDefinedBy" ;\n  rdfs:comment "The defininition of the subject resource." ;\n  rdfs:range rdfs:Resource ;\n  rdfs:domain rdfs:Resource .\n\nrdfs:Literal a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Literal" ;\n  rdfs:comment "The class of literal values, eg. textual strings and integers." ;\n  rdfs:subClassOf rdfs:Resource .\n\nrdfs:Container a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Container" ;\n  rdfs:subClassOf rdfs:Resource ;\n  rdfs:comment "The class of RDF containers." .\n\nrdfs:ContainerMembershipProperty a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "ContainerMembershipProperty" ;\n  rdfs:comment """The class of container membership properties, rdf:_1, rdf:_2, ...,\n                    all of which are sub-properties of \'member\'.""" ;\n  rdfs:subClassOf rdf:Property .\n\nrdfs:member a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "member" ;\n  rdfs:comment "A member of the subject resource." ;\n  rdfs:domain rdfs:Resource ;\n  rdfs:range rdfs:Resource .\n\nrdfs:Datatype a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Datatype" ;\n  rdfs:comment "The class of RDF datatypes." ;\n  rdfs:subClassOf rdfs:Class .\n\n<http://www.w3.org/2000/01/rdf-schema#> rdfs:seeAlso <http://www.w3.org/2000/01/rdf-schema-more> .\n';
  var RDF = {
    Alt: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt',
    Bag: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag',
    first: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#first',
    HTML : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML ',
    langString : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString ',
    List : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#List ',
    nil: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil',
    object : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#object ',
    PlainLiteral : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral ',
    predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate',
    Property : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property ',
    rest : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#rest ',
    Seq: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq',
    Statement: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement',
    subject: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#subject',
    type : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type ',
    value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
    XMLLiteral : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral '
  };
  var RDFS = {
    Class: 'http://www.w3.org/2000/01/rdf-schema#Class',
    comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
    Container: 'http://www.w3.org/2000/01/rdf-schema#Container',
    ContainerMembershipProperty: 'http://www.w3.org/2000/01/rdf-schema#ContainerMembershipProperty',
    Datatype : 'http://www.w3.org/2000/01/rdf-schema#Datatype ',
    domain : 'http://www.w3.org/2000/01/rdf-schema#domain ',
    isDefinedBy: 'http://www.w3.org/2000/01/rdf-schema#isDefinedBy',
    label: 'http://www.w3.org/2000/01/rdf-schema#label',
    Literal: 'http://www.w3.org/2000/01/rdf-schema#Literal',
    member : 'http://www.w3.org/2000/01/rdf-schema#member ',
    range: 'http://www.w3.org/2000/01/rdf-schema#range',
    Resource : 'http://www.w3.org/2000/01/rdf-schema#Resource ',
    seeAlso: 'http://www.w3.org/2000/01/rdf-schema#seeAlso',
    subClassOf : 'http://www.w3.org/2000/01/rdf-schema#subClassOf ',
    subPropertyOf: 'http://www.w3.org/2000/01/rdf-schema#subPropertyOf'
  };

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
  var graph = _store.rdf.createGraph();
  _store.load("text/turtle", RDF_TURTLE, graph, function(e) { evaluateRules(); });
  _store.load("text/turtle", RDFS_TURTLE, graph, function(e) { evaluateRules(); });
  

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
    RDF: RDF,
    RDFS: RDFS,
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