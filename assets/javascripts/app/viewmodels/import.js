define(['underscore', 'knockout', 'state', 'papaparse', 'rdf'], function (_, ko, state, papaparse, rdf) {
  var _detecting = ko.observable(false);
  var _importable = ko.observable(false);
  var _mime = ko.observable('');
  var _csv = null;

  var RDF_TURTLE = '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix owl: <http://www.w3.org/2002/07/owl#> .\n@prefix dc: <http://purl.org/dc/elements/1.1/> .\n\n<http://www.w3.org/1999/02/22-rdf-syntax-ns#> a owl:Ontology ;\n\tdc:title "The RDF Concepts Vocabulary (RDF)" ;\n\tdc:description "This is the RDF Schema for the RDF vocabulary terms in the RDF Namespace, defined in RDF 1.1 Concepts." .\n\nrdf:HTML a rdfs:Datatype ;\n\trdfs:subClassOf rdfs:Literal ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:seeAlso <http://www.w3.org/TR/rdf11-concepts/#section-html> ;\n\trdfs:label "HTML" ;\n\trdfs:comment "The datatype of RDF literals storing fragments of HTML content" .\n\nrdf:langString a rdfs:Datatype ;\n\trdfs:subClassOf rdfs:Literal ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:seeAlso <http://www.w3.org/TR/rdf11-concepts/#section-Graph-Literal> ;\n\trdfs:label "langString" ;\n\trdfs:comment "The datatype of language-tagged string values" .\n\nrdf:PlainLiteral a rdfs:Datatype ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:subClassOf rdfs:Literal ;\n\trdfs:seeAlso <http://www.w3.org/TR/rdf-plain-literal/> ;\n\trdfs:label "PlainLiteral" ;\n\trdfs:comment "The class of plain (i.e. untyped) literal values, as used in RIF and OWL 2" .\n\nrdf:type a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "type" ;\n\trdfs:comment "The subject is an instance of a class." ;\n\trdfs:range rdfs:Class ;\n\trdfs:domain rdfs:Resource .\n\nrdf:Property a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Property" ;\n\trdfs:comment "The class of RDF properties." ;\n\trdfs:subClassOf rdfs:Resource .\n\nrdf:Statement a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Statement" ;\n\trdfs:subClassOf rdfs:Resource ;\n\trdfs:comment "The class of RDF statements." .\n\nrdf:subject a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "subject" ;\n\trdfs:comment "The subject of the subject RDF statement." ;\n\trdfs:domain rdf:Statement ;\n\trdfs:range rdfs:Resource .\n\nrdf:predicate a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "predicate" ;\n\trdfs:comment "The predicate of the subject RDF statement." ;\n\trdfs:domain rdf:Statement ;\n\trdfs:range rdfs:Resource .\n\nrdf:object a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "object" ;\n\trdfs:comment "The object of the subject RDF statement." ;\n\trdfs:domain rdf:Statement ;\n\trdfs:range rdfs:Resource .\n\nrdf:Bag a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Bag" ;\n\trdfs:comment "The class of unordered containers." ;\n\trdfs:subClassOf rdfs:Container .\n\nrdf:Seq a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Seq" ;\n\trdfs:comment "The class of ordered containers." ;\n\trdfs:subClassOf rdfs:Container .\n\nrdf:Alt a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "Alt" ;\n\trdfs:comment "The class of containers of alternatives." ;\n\trdfs:subClassOf rdfs:Container .\n\nrdf:value a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "value" ;\n\trdfs:comment "Idiomatic property used for structured values." ;\n\trdfs:domain rdfs:Resource ;\n\trdfs:range rdfs:Resource .\n\nrdf:List a rdfs:Class ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "List" ;\n\trdfs:comment "The class of RDF Lists." ;\n\trdfs:subClassOf rdfs:Resource .\n\nrdf:nil a rdf:List ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "nil" ;\n\trdfs:comment "The empty list, with no items in it. If the rest of a list is nil then the list has no more items in it." .\n\nrdf:first a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "first" ;\n\trdfs:comment "The first item in the subject RDF list." ;\n\trdfs:domain rdf:List ;\n\trdfs:range rdfs:Resource .\n\nrdf:rest a rdf:Property ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "rest" ;\n\trdfs:comment "The rest of the subject RDF list after the first item." ;\n\trdfs:domain rdf:List ;\n\trdfs:range rdf:List .\n\nrdf:XMLLiteral a rdfs:Datatype ;\n\trdfs:subClassOf rdfs:Literal ;\n\trdfs:isDefinedBy <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ;\n\trdfs:label "XMLLiteral" ;\n\trdfs:comment "The datatype of XML literal values." .\n';
  var RDFS_TURTLE = '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix owl: <http://www.w3.org/2002/07/owl#> .\n@prefix dc: <http://purl.org/dc/elements/1.1/> .\n\n<http://www.w3.org/2000/01/rdf-schema#> a owl:Ontology ;\n  dc:title "The RDF Schema vocabulary (RDFS)" .\n\nrdfs:Resource a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Resource" ;\n  rdfs:comment "The class resource, everything." .\n\nrdfs:Class a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Class" ;\n  rdfs:comment "The class of classes." ;\n  rdfs:subClassOf rdfs:Resource .\n\nrdfs:subClassOf a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "subClassOf" ;\n  rdfs:comment "The subject is a subclass of a class." ;\n  rdfs:range rdfs:Class ;\n  rdfs:domain rdfs:Class .\n\nrdfs:subPropertyOf a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "subPropertyOf" ;\n  rdfs:comment "The subject is a subproperty of a property." ;\n  rdfs:range rdf:Property ;\n  rdfs:domain rdf:Property .\n\nrdfs:comment a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "comment" ;\n  rdfs:comment "A description of the subject resource." ;\n  rdfs:domain rdfs:Resource ;\n  rdfs:range rdfs:Literal .\n\nrdfs:label a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "label" ;\n  rdfs:comment "A human-readable name for the subject." ;\n  rdfs:domain rdfs:Resource ;\n  rdfs:range rdfs:Literal .\n\nrdfs:domain a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "domain" ;\n  rdfs:comment "A domain of the subject property." ;\n  rdfs:range rdfs:Class ;\n  rdfs:domain rdf:Property .\n\nrdfs:range a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "range" ;\n  rdfs:comment "A range of the subject property." ;\n  rdfs:range rdfs:Class ;\n  rdfs:domain rdf:Property .\n\nrdfs:seeAlso a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "seeAlso" ;\n  rdfs:comment "Further information about the subject resource." ;\n  rdfs:range rdfs:Resource ;\n  rdfs:domain rdfs:Resource .\n\nrdfs:isDefinedBy a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:subPropertyOf rdfs:seeAlso ;\n  rdfs:label "isDefinedBy" ;\n  rdfs:comment "The defininition of the subject resource." ;\n  rdfs:range rdfs:Resource ;\n  rdfs:domain rdfs:Resource .\n\nrdfs:Literal a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Literal" ;\n  rdfs:comment "The class of literal values, eg. textual strings and integers." ;\n  rdfs:subClassOf rdfs:Resource .\n\nrdfs:Container a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Container" ;\n  rdfs:subClassOf rdfs:Resource ;\n  rdfs:comment "The class of RDF containers." .\n\nrdfs:ContainerMembershipProperty a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "ContainerMembershipProperty" ;\n  rdfs:comment """The class of container membership properties, rdf:_1, rdf:_2, ...,\n                    all of which are sub-properties of \'member\'.""" ;\n  rdfs:subClassOf rdf:Property .\n\nrdfs:member a rdf:Property ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "member" ;\n  rdfs:comment "A member of the subject resource." ;\n  rdfs:domain rdfs:Resource ;\n  rdfs:range rdfs:Resource .\n\nrdfs:Datatype a rdfs:Class ;\n  rdfs:isDefinedBy <http://www.w3.org/2000/01/rdf-schema#> ;\n  rdfs:label "Datatype" ;\n  rdfs:comment "The class of RDF datatypes." ;\n  rdfs:subClassOf rdfs:Class .\n\n<http://www.w3.org/2000/01/rdf-schema#> rdfs:seeAlso <http://www.w3.org/2000/01/rdf-schema-more> .\n';
  var SEB_TSV = '2011-12-05\t2011-12-05\t5484164894\tSTORE &amp; COFF/11-12-02\t-64\t6 807,87\n2011-12-02\t2011-12-02\t5484632508\tHEADWEB /11-12-01\t-200\t6 871,87\n2011-12-02\t2011-12-02\t5484632508\tHEADWEB /11-12-01\t-200\t6 871,87\n2011-11-30\t2011-11-29\t1332900710S\tCENTRALA STUDIESTÖDSNÄMN\t-4 873,00\t9 690,16';

  function detectFormat(data) {
    _detecting(true);
    _importable(false);
    _mime('');
    _csv = null;
    // Check for csv, rdf/xml etc...

    // MIME types
    // Turtle (.ttl) - text/turtle
    // N-Triples (.nt) - application/n-triples
    // N-Quads (.nq) - application/n-quads
    // Notation3 (.n3) - text/n3
    // RDF/JSON (.rj) - USE JSON-LD instead
    // JSON-LD (.jsonld) - application/ld+json
    // RDF/XML (.rdf, .owl) - application/rdf+xml
    // RDFa (.html) - text/html
    // Comma separated values (.csv) - text/csv
    // Tab separated values (.tsv) - text/tab-separated-values

    // Check input empty
    if (data.trim().length === 0) {
      _detecting(false);
      return;
    }

    // Check turtle by using prefix (not fool-proof)
    if (data.trim().substring(0,7) === '@prefix') {
      _detecting(false);
      _importable(true);
      _mime('text/turtle');
      return;
    }

    // Check for RDF/XML - Test XML and RDF as root node
    var domParser = new DOMParser();
    var xml = domParser.parseFromString(data, 'text/xml');
    if (xml.documentElement.nodeName === 'rdf:RDF' || xml.documentElement.nodeName === 'RDF') {
      _detecting(false);
      _importable(true);
      _mime('application/rdf+xml');
      return;
    }

    // Check if JSON
    try {
      JSON.parse(data);
      _detecting(false);
      _importable(true);
      _mime('application/ld+json');
      return;
    }
    catch (e) {}

    // Check if CSV
    _csv = papaparse.parse(data);
    if (_csv.data.length > 0 && _csv.data[0].length > 0) {
      _detecting(false);
      _importable(true);
      _mime('text/csv');
      return;
    }

    _detecting(false);
    return;
  }

  function generateColumnLabel(index) {
    var result = '';
    while (index > 26) {
      result += String.fromCharCode(65 + (index % 26));
      index = Math.floor(index / 26);
    }
    result += String.fromCharCode(65 + index);
    return result;
  }

  function importData(data) {
    // console.log("importData start: " + data);
    if (_importable()) {
      // Create a result graph
      var graph = rdf.createGraph();
      if (_mime() === 'text/csv') {
        console.log('Importing csv [' + _csv.data[0].length + ',' + _csv.data.length + ']...');
        // Create new Class for this import
        var unique = new Date().toISOString().replace(/[-:\.]/g,'');
        var importClass = rdf.resolved(':'+unique);
        graph.add(rdf.createTriple(importClass, rdf.resolved('rdf:type'), rdf.resolved('rdfs:Class')));
        graph.add(rdf.createTriple(importClass, rdf.resolved('rdfs:label'), rdf.createLiteral(unique)));
        var importProperties = [];
        _.each(_csv.data[0], function(column, index) {
          // Create a property for every column
          var property = rdf.createNamedNode(rdf.resolve(':'+unique+'#'+generateColumnLabel(index)));
          importProperties.push(property);
          graph.add(rdf.createTriple(property, rdf.resolved('rdf:type'), rdf.resolved('rdf:Property')));
          graph.add(rdf.createTriple(property, rdf.resolved('rdfs:domain'), importClass));
          graph.add(rdf.createTriple(property, rdf.resolved('rdfs:range'), rdf.resolved('xsd:string')));
          graph.add(rdf.createTriple(property, rdf.resolved('rdfs:label'), rdf.createLiteral(generateColumnLabel(index))));
        });
        // Iterate each line
        _.each(_csv.data, function(line, rowIndex) {
          var subject = rdf.createBlankNode();
          // Add row number statement per line
          graph.add(rdf.createTriple(subject, rdf.resolved(':row'), rdf.createLiteral(rowIndex)));
          // Add link to import session
          graph.add(rdf.createTriple(subject, rdf.resolved('rdf:type'), importClass));
          // Iterate cells
          _.each(line, function(column, index) {
            // Add cell value as columnN property
            graph.add(rdf.createTriple(subject, importProperties[index], rdf.createLiteral(column)));
          });
        });
        // Store in state
        state.store.insert(graph, function() {});

        //console.log("RDF: " + graph.toNT());
        console.log('Imported ' + graph.toArray().length + ' triples');
      }
      else {
        state.store.load(_mime(), data, graph, function(e) { /* Todo: add error handling */ });
      }
    }
  }

  return {
    displayName: 'Import',
    mime: _mime,
    detecting: _detecting,
    importable: _importable,
    dataToImport: ko.observable(SEB_TSV),
    state: state,
    testDataSeb: function() {
      this.dataToImport(SEB_TSV);
    },
    testDataRdf: function() {
      this.dataToImport(RDF_TURTLE);
    },
    testDataRdfs: function() {
      this.dataToImport(RDFS_TURTLE);
    },
    startImport: function() {
      importData(this.dataToImport());
    },
    attached: function (view, parent) {
      // Detect format as soon as import data changes
      this.dataToImport.subscribe(function(s) { detectFormat(s); });
      detectFormat(this.dataToImport());
    },
    compositionComplete: function(view, parent) {
      // Make ko available to console (TODO: Remove)
      window.context = this;
      // Make sure the caret is in the textbox on load
      $("#textarea_import").focus().select();
    }
  };
});