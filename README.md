# RDF Workbench

Single page app to manipulate RDF

# RDF Schema Constructs
Construct | Syntactic form | Description
----------|----------------|------------
Class (a class) | C rdf:type rdfs:Class | C (a resource) is an RDF class
Property (a class) | P rdf:type rdf:Property | P (a resource) is an RDF property
type (a property) | I rdf:type C | I (a resource) is an instance of C (a class)
subClassOf (a property) | C1 rdfs:subClassOf C2 | C1 (a class) is a subclass of C2 (a class)
subPropertyOf (a property) | P1 rdfs:subPropertyOf P2 | P1 (a property) is a sub-property of P2 (a property)
domain (a property) | P rdfs:domain C | domain of P (a property) is C (a class)
range (a property) | P rdfs:range C | range of P (a property) is C (a class)