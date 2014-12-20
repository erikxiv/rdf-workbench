define(['bootstrap-tabs', 'jquery-base64', 'rdfstore', 'underscore', 'knockout', 'state'], function (jq1, jq2, rdfstore, _, ko, state) {
  var _verifications = ko.observableArray();
  function reload() {
    console.log("Loading RDF");
    state.store.execute("PREFIX eco:  <urn:eco:20140101:>\
      SELECT ?date ?description ?amount ?category WHERE {\
        ?s eco:amount ?amount;\
        eco:description ?description;\
        eco:date ?date .\
        OPTIONAL { ?s eco:category ?category }\
      }\
      ORDER BY DESC(?date)",
      function(status, result) {
        if (result[0]) console.log(result[0]);
        _verifications(result);
      });
  }
  return {
    displayName: 'List',
    state: state,
    verifications: _verifications,
    attached: function (view, parent) {
      var cb = function(event, triples){ 
        // it will receive a notifications where a triple matching
        // the pattern s:http://example/boogk, p:*, o:*, g:*
        // is inserted or removed.
        if(event === 'added') {
          console.log(triples.length+" triples have been added");  
          reload();
        } else if(event === 'deleted') {
          console.log(triples.length+" triples have been deleted");  
          reload();
        }
      }

      state.store.subscribe(null,"http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "urn:eco:20140101:verification",null,cb);
      reload();
    },
    compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
    }
  }
});