define(['underscore', 'knockout', 'state', 'typeahead'], function (_, ko, state, typeahead) {
  var _headers = ko.observableArray([
    { label: 'Verifikationsnummer', predicate: 'seb:verifikationsnummer'},
    { label: 'Text', predicate: 'seb:text'},
    { label: 'Belopp', predicate: 'seb:belopp'},
  ]);
  var _rows = ko.observableArray();

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
    _rows(_.map(data, function(o) {      
      return { columns: _.map(_headers(), function(header, hi) {
          return { value: o[hi].value };
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

  // ToDo: Change p.p.value to something more stable (state is currently publishing sparql query results)
  function updatePredicateHound(ps) {
    predicateHound.clear();
    predicateHound.add(_.map(ps, function(p) {
      return {
        iri: p.p.value,
        prefixed: state.store.rdf.prefixes.shrink(p.p.value),
      };
    }));
  }
  state.predicates.subscribe(updatePredicateHound);
  updatePredicateHound(state.predicates());

  return {
    displayName: 'Table',
    state: state,
    headers: _headers,
    rows: _rows,
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