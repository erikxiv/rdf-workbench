define(['underscore', 'knockout', 'state'], function (_, ko, state) {
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

  return {
    displayName: 'Table',
    state: state,
    headers: _headers,
    rows: _rows,
    attached: function (view, parent) {
    },
    compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
    }
  };
});