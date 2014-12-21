define(['underscore', 'knockout', 'state'], function (_, ko, state) {
  var _types = ko.observableArray();

  function produceQuery() {
    var variableString = '';
    var filterString = '';
    _.each(_headers(), function(header, index) {
      variableString += ' ?' + index;
      filterString += '?s <' + state.store.rdf.resolve(header.predicate) + '> ?' + index + ' .\n';
    });
    var sparql = 'SELECT' + variableString + ' WHERE {\n' + filterString + '}';
    // console.log(sparql);
    return sparql;
  }

  function reload(data) {
    console.log("Updating table: row count = " + data.length);
    // console.log(data);
    _types(_.map(data, function(o) {      
      return { 
        iri: o.iri.value,
        label: o.label ? o.label.value : ''
      };
    }));
  }

  // Subscribe to updates to table-backing query
  // var sparql = 'SELECT ?label ?iri WHERE { ?iri is rdfs:Class . OPTIONAL { ?iri rdfs:label ?label } }';
  var sparql = 'SELECT ?label ?iri WHERE { ?iri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> . OPTIONAL { ?iri <http://www.w3.org/2000/01/rdf-schema#label> ?label } }';
  state.store.startObservingQuery(sparql, reload);

  return {
    displayName: 'Types',
    state: state,
    types: _types,
    attached: function (view, parent) {
    },
    compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
    }
  };
});