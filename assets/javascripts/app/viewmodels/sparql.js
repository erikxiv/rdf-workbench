define(['underscore', 'knockout', 'state'], function (_, ko, state) {
  function testImport(csv) {
    console.log("testImport start: " + csv);
    // Create a result graph
    var graph = state.store.rdf.createGraph();
    state.setPrefix(sebFormat.prefix, sebFormat.namespace);
    var predicates = _.map(sebFormat.columns, function(column) {
      return state.store.rdf.createNamedNode(state.store.rdf.resolve(column.predicate));
    });
    // Parse CSV
    var lines = csv.split("\n");
    var importSession = state.store.rdf.createBlankNode();
    _.each(lines, function(line) {
      // console.log("line: " + line);
      var columns = line.split("\t");
      var subject = state.store.rdf.createNamedNode(sebFormat.uniqueFunction(columns));
      graph.add(state.store.rdf.createTriple(
        subject,
        state.store.rdf.createNamedNode(state.store.rdf.resolve('ecoi:csv_line')),
        state.store.rdf.createLiteral(line)
      ));
      graph.add(state.store.rdf.createTriple(
        subject,
        state.store.rdf.createNamedNode(state.store.rdf.resolve('ecoi:import_session')),
        importSession
      ));
      _.each(columns, function(column, index) {
        var predicate = predicates[index];//state.store.rdf.createNamedNode(sebFormat.columns[index].title);
        var value = sebFormat.columns[index].fn ? sebFormat.columns[index].fn(column) : column;
        var object = sebFormat.columns[index].datatype ?
          state.store.rdf.createLiteral(value, null, sebFormat.columns[index].datatype) :
          state.store.rdf.createLiteral(value);
        // console.log("column: " + value);
        graph.add(state.store.rdf.createTriple(subject, predicate, object));
      });
    });
    // Store in state
    state.store.insert(graph, function(success) {
      state.store.graph(function(s, g) {
        // Map to standard schema
        state.store.execute(
          "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
          PREFIX seb:  <urn:eco:banks:seb:20140101:>\
          PREFIX eco:  <urn:eco:20140101:>\
          PREFIX ecoi:  <urn:eco:20140101:import:>\
          CONSTRUCT {\
            ?v eco:amount ?amount .\
            ?v rdf:type eco:verification\
          }\
                WHERE {\
                  ?v seb:belopp ?amount .\
                }", 
                function(success, graph){
                  console.log(graph.toNT());
        });
            // ?v eco:date ?date .\
            // ?v eco:description ?description .\
                    // seb:valutadatum ?date ;\
                    // seb:text ?description .\

        //console.log(g.toNT());
        console.log("Store triples: ", g.toArray().length);
      });
    });

    //console.log("RDF: " + graph.toNT());
    console.log("Graph triples: ", graph.toArray().length);
    console.log("testImport end");
  }
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
        $("#textarea_sparql").val("PREFIX dc: <http://purl.org/dc/elements/1.1/>\n\
INSERT DATA\n\
{ \n\
  <http://example/book1> dc:title \"A new book\" ;\n\
                         dc:creator \"A.N.Other\" .\n\
}");
      });
      $('#button_sparql').click(function (e) {
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
                    //$("#textarea_result").html((graph.toNT()));
                  }
                  else {
                    $("#textarea_result").html(success);
                  }
        });
      });
        },
        compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
      $("#textarea_sparql").focus().select();
        }
    };
});