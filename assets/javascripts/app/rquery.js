define(['knockout', 'underscore', 'rdfstore', 'state'], function(ko, _, rdfstore, state) {
  'use strict';
  var store = state.store;
  var rdf = state.store.rdf;
  /* 
  q.RDFNode
  interfaceName: "NamedNode" | "Literal" | "BlankNode"
  nominalValue: IRI | value
  attributes: ["interfaceName", "nominalValue"]
  toNT(), toString(), valueOf()

  q.Graph
  actions: []
  duplicates:
  length: Number of triples
  triples: Array of q.Triple
  add(), addAction(), addAll(), every(), filter(), forEach(), match(),
  merge(), remove(), removeMatches(), some(), toArray(), toNT()

  q.Triple
  subject:
  object:
  predicate:
  equals(), toString()
  */

  function wrap(o) {
    if (typeof o === 'string')
      return rdf.resolve(o) ? rdf.resolve(o) : o;
    if (o)
      return o;
    return '';
  }

  var RQuery = function(selection, graph) {
    this.graph = graph;
    this.dummy = [];
    if (! graph)
      store.graph(function(s, graph) { this.graph = graph; }.bind(this));
    // Current set of selected nodes. Array of q.RDFNode
    this.selection = Array.isArray(selection) ? selection : [wrap(selection)];
    if (this.selection.length > 1)
      this.data = ko.observableArray(this.selection.map(function(x) { return new RQuery(x, this.graph); }.bind(this)));
    else
      this.data = ko.observableArray([this]);
    // console.log("RQuery: " + this.valueOf());
    // console.log(this.data);
  };
  // follow predicate(s) of current set
  RQuery.prototype.follow = function(predicate) {
    return new RQuery(this.graph.filter(function(triple) {
      return triple.predicate.equals(wrap(predicate)) && _.reduce(this.selection, function(memo, node) { return memo || triple.subject.equals(node); }, false);
    }.bind(this)).toArray().map(function(triple) { return triple.object; }), this.graph);
  };
  // follow predicate(s) of current set
  RQuery.prototype.reverse = function(predicate) {
    return new RQuery(this.graph.filter(function(triple) {
      return triple.predicate.equals(wrap(predicate)) && _.reduce(this.selection, function(memo, node) { return memo || triple.object.equals(node); }, false);
    }.bind(this)).toArray().map(function(triple) { return triple.subject; }), this.graph);
  };
  // Retrieve value of first item in selection
  RQuery.prototype.valueOf = function() {
    if (this.selection.length === 0)
      return "";
    return this.selection[0].valueOf();
  };
  // Pretty print value
  RQuery.prototype.pretty = function() {
    if (this.selection.length === 0)
      return "";
    if (typeof this.selection[0] === 'string')
      return rdf.prefixes.shrink(this.selection[0]);
    if (this.selection[0].interfaceName === 'NamedNode')
      return rdf.prefixes.shrink(this.selection[0].nominalValue);
    if (this.selection[0].interfaceName === 'Literal')
      return this.selection[0].valueOf();
    if (this.selection[0].interfaceName === 'BlankNode')
      return this.selection[0].valueOf();
    console.log("miss: " + (typeof this.selection[0]) + ' ' + this.selection[0].interfaceName);
    return this.selection[0].valueOf();
  };


  return function(selection, graph) { return new RQuery(selection, graph); };
});