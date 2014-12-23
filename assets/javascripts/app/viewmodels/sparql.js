define(['underscore', 'knockout', 'state'], function (_, ko, state) {
  return {
    displayName: 'SPARQL',
    state: state,
    attached: function (view, parent) {
      // Wire up Import buttons
      //
      $('#button_construct').click(function (e) {
        $("#textarea_sparql").val("construct { ?s ?p ?o } where { ?s ?p ?o }");
      });
      $('#button_select').click(function (e) {
        $("#textarea_sparql").val("select * where { ?s ?p ?o }");
      });
      $('#button_insert').click(function (e) {
        $("#textarea_sparql").val("PREFIX dc: <http://purl.org/dc/elements/1.1/>\nINSERT DATA\n{ \n  <http://example/book1> dc:title \"A new book\" ;\n                         dc:creator \"A.N.Other\" .\n}");
      });
      $('#button_sparql').click(function (e) {
        console.log(state.getPrefixesForSparql() + $("#textarea_sparql").val());
        state.store.execute(
          state.getPrefixesForSparql() + $("#textarea_sparql").val(), 
          function(success, graph){
            if (success) {
              if (Object.prototype.toString.call(graph) === '[object Array]') {
                console.log("Array length: " + graph.length);
                window.debug = graph;
                var headers = "";
                for (var property in graph[0]) {
                  if (graph[0].hasOwnProperty(property)) {
                    headers = headers + property + "\t";
                  }
                }
                $("#textarea_result").html(_.reduce(graph, function(memo, value, index) {
                  var result = memo;
                  for (var property in value) {
                    if (value.hasOwnProperty(property)) {
                      result = result + value[property].value + "\t";
                    }
                  }
                  return result + "\n";
                }, headers+"\n"));
              }
              else if(! graph) {
                $("#textarea_result").html("undefined result");
              }
              else if(graph.toNT) {
                $("#textarea_result").html(graph.toNT());
              }
              else {
                $("#textarea_result").html(graph.toString());
              }
            }
            else {
              $("#textarea_result").html(success);
            }
          }
        );
      });
    },
    compositionComplete: function(view, parent) {
      // Make ko available to console (TODO: Remove)
      window.context = this;
      $("#textarea_sparql").focus().select();
    }
  };
});