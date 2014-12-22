define(['underscore', 'knockout', 'state', 'typeahead'], function (_, ko, state, typeahead) {
  var _class = ko.observable({ iri: 'http://www.w3.org/2000/01/rdf-schema#Class', prefixed: 'rdfs:Class'});
  var _headers = ko.observableArray([
    { label: 'subClassOf', predicate: 'http://www.w3.org/2000/01/rdf-schema#subClassOf'}
  ]);
  var _rows = ko.observableArray();

  function produceQuery() {
    var variableString = ' ?s';
    var filterString = '';
    _.each(_headers(), function(header, index) {
      variableString += ' ?' + index;
      filterString += 'OPTIONAL { ?s <' + header.predicate + '> ?' + index + ' . }\n';
    });
    var sparql = 'SELECT' + variableString + ' WHERE { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <'+_class().iri+'>\n' + filterString + '}';
    console.log(sparql);
    return sparql;
  }

  function reload(data) {
    console.log("Updating table: row count = " + data.length);
    // console.log(data);
    _rows(_.map(data, function(o) {      
      return { subject: state.store.rdf.prefixes.shrink(o.s.value),
          columns: _.map(_headers(), function(header, hi) {
            return { value: o[hi] ? o[hi].token === 'uri' ? state.store.rdf.prefixes.shrink(o[hi].value) : o[hi].value : '' };
        })
      };
    }));
  }

  // Subscribe to updates to table-backing query
  state.store.startObservingQuery(produceQuery(), reload);

  // constructs the suggestion engine
  var predicateHound = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.nonword('iri', 'prefixed'),
    queryTokenizer: Bloodhound.tokenizers.nonword,
    // `states` is an array of state names defined in "The Basics"
    // local: $.map(state.predicates(), function(p) {
    //   return { value: p.value }; 
    // })
    // local: [{value: 'x:qwer', other: 'yngew'}, {value:'y:qwer', other:'Albert'}, {value: 'Kalle', other:'Akva'}]
    local: []
  });
   
  // kicks off the loading/processing of `local` and `prefetch`
  predicateHound.initialize();

  // Keep typeahead updated with fresh predicates
  function updatePredicateHound(ps) {
    predicateHound.clear();
    predicateHound.add(ps);
  }
  state.predicates.subscribe(updatePredicateHound);
  updatePredicateHound(state.predicates());

  return {
    displayName: 'Table',
    state: state,
    classes: state.classes,
    selectedClass: _class,
    headers: _headers,
    rows: _rows,
    changeTableToClass: function(prefixedClass) {
      _class(prefixedClass);
      // Get properties of class, update headers, update query and refresh table
      // get label and predicate
      console.log("Getting properties...");
      var sparql = 'SELECT ?label ?predicate WHERE { ?predicate <http://www.w3.org/2000/01/rdf-schema#domain> <' + prefixedClass.iri + '> ; <http://www.w3.org/2000/01/rdf-schema#label> ?label . }';
      console.log(sparql);
      state.store.execute(sparql, function(success, graph) {
        console.log(graph);
        // Update headers
        _headers(_.map(graph, function(p) {
          return {
            label: p.label.value,
            predicate: p.predicate.value
          };
        }));
        console.log('new headers');
        console.log(_headers());
        // Start observing new query
        state.store.stopObservingQuery(reload);
        state.store.startObservingQuery(produceQuery(), reload);
      });
    },
    attached: function (view, parent) {
      $('#filter_predicate .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        name: 'predicateHound',
        displayKey: 'prefixed',
        // `ttAdapter` wraps the suggestion engine in an adapter that
        // is compatible with the typeahead jQuery plugin
        source: predicateHound.ttAdapter()
      });  
    },
    compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
    }
  };
});