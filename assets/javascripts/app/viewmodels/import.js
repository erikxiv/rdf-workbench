define(['bootstrap-tabs', 'jquery-base64', 'rdfstore', 'underscore', 'knockout', 'state'], function (jq1, jq2, rdfstore, _, ko, state) {
  // var store = rdfstore.create();
  state.setPrefix('ecoi', 'urn:eco:20140101:import:');
  var sebFormat = {
    prefix: 'seb',
    namespace: 'urn:eco:banks:seb:20140101:',
    uniqueFunction: function(columns) { return 'urn:_:verification:seb:' + columns[2]; },
    columns : [
      { title: 'Bokföringsdatum', predicate: 'seb:bokforingsdatum', datatype: 'xsd:date' },
      { title: 'Valutadatum', predicate: 'seb:valutadatum', datatype: 'xsd:date' },
      { title: 'Verifikationsnummer', predicate: 'seb:verifikationsnummer' },
      { title: 'Text', predicate: 'seb:text' },
      { title: 'Belopp', predicate: 'seb:belopp', datatype: 'xsd:float', fn: function(x) { return parseFloat(x.replace(' ', '').replace(',','.')); } },
      { title: 'Saldo', predicate: 'seb:saldo', datatype: 'xsd:float', fn: function(x) { return parseFloat(x.replace(' ', '').replace(',','.')); } }
    ]
  };
  function testImport(csv) {
    // console.log("testImport start: " + csv);
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
    console.log(importSession.toString());
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
            ?v  eco:amount ?amount ;\
              eco:date  ?date ;\
              eco:description ?description .\
            ?v rdf:type eco:verification\
          }\
                WHERE {\
                  ?v  seb:belopp ?amount ;\
                    seb:valutadatum ?date ;\
                    seb:text ?description ;\
                    ecoi:import_session " + importSession.toString() + " .\
                }", 
                function(success, graph){
                  //console.log(graph.toNT());
                  state.store.insert(graph, function(success) {});
        });
            // ?v eco:date ?date .\
            // ?v eco:description ?description .\

        //console.log(g.toNT());
        console.log("Store triples: ", g.toArray().length);
      });
    });

    //console.log("RDF: " + graph.toNT());
    console.log("Graph triples: ", graph.toArray().length);
    console.log("testImport end");
  }
    return {
        displayName: 'Import',
        state: state,
        attached: function (view, parent) {
      // Wire up Import buttons
      $('#button_import').click(function (e) {
        testImport($('#textarea_import').val());
      });
        },
        compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
          // Make sure the caret is in the textbox on load
      $("#textarea_import").focus().select();
      //testImport($('#textarea_base64').text());
        }
    };
});