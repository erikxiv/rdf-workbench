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

## Entailment Rules

Source: http://www.w3.org/TR/rdf11-mt/#rdf-entailment

 | if S contains | then S RDF entails, recognizing D
-|---------------|----------------------------------
rdfD1 | xxx aaa "sss"^^ddd .<br/>for ddd in D | xxx aaa _:nnn .<br/>_:nnn rdf:type ddd .
rdfD2 | xxx aaa yyy . | aaa rdf:type rdf:Property .

 | if S contains | then S RDFS entails, recognizing D
-|---------------|----------------------------------
rdfs1 | any IRI aaa in D | aaa rdf:type rdfs:Datatype .
rdfs2 | aaa rdfs:domain xxx .<br/>yyy aaa zzz . | yyy rdf:type xxx .
rdfs3 | aaa rdfs:range xxx .<br/>yyy aaa zzz . | zzz rdf:type xxx .
rdfs4a | xxx aaa yyy . | xxx rdf:type rdfs:Resource .
rdfs4b | xxx aaa yyy. | yyy rdf:type rdfs:Resource .
rdfs5 | xxx rdfs:subPropertyOf yyy .<br/>yyy rdfs:subPropertyOf zzz . | xxx rdfs:subPropertyOf zzz .
rdfs6 | xxx rdf:type rdf:Property . | xxx rdfs:subPropertyOf xxx .
rdfs7 | aaa rdfs:subPropertyOf bbb .<br/>xxx aaa yyy . | xxx bbb yyy .
rdfs8 | xxx rdf:type rdfs:Class . | xxx rdfs:subClassOf rdfs:Resource .
rdfs9 | xxx rdfs:subClassOf yyy .<br/>zzz rdf:type xxx . | zzz rdf:type yyy .
rdfs10 | xxx rdf:type rdfs:Class . | xxx rdfs:subClassOf xxx .
rdfs11 | xxx rdfs:subClassOf yyy .<br/>yyy rdfs:subClassOf zzz . | xxx rdfs:subClassOf zzz .
rdfs12 | xxx rdf:type rdfs:ContainerMembershipProperty . | xxx rdfs:subPropertyOf rdfs:member .
rdfs13 | xxx rdf:type rdfs:Datatype . | xxx rdfs:subClassOf rdfs:Literal .

### OWL Entailment Rules

Source:  http://www.w3.org/TR/owl2-profiles/

#### The Semantics of Equality
 | If | then
eq-ref | T(?s, ?p, ?o) | T(?s, owl:sameAs, ?s)<br/>T(?p, owl:sameAs, ?p)<br/>T(?o, owl:sameAs, ?o)
eq-sym | T(?x, owl:sameAs, ?y) | T(?y, owl:sameAs, ?x)
eq-trans | T(?x, owl:sameAs, ?y)<br/>T(?y, owl:sameAs, ?z) | T(?x, owl:sameAs, ?z)
eq-rep-s | T(?s, owl:sameAs, ?s')<br/>T(?s, ?p, ?o) | T(?s', ?p, ?o)
eq-rep-p | T(?p, owl:sameAs, ?p')<br/>T(?s, ?p, ?o) | T(?s, ?p', ?o)
eq-rep-o | T(?o, owl:sameAs, ?o')<br/>T(?s, ?p, ?o) | T(?s, ?p, ?o')
eq-diff1 | T(?x, owl:sameAs, ?y)<br/>T(?x, owl:differentFrom, ?y) | false
eq-diff2 | T(?x, rdf:type, owl:AllDifferent)<br/>T(?x, owl:members, ?y)<br/>LIST[?y, ?z1, ..., ?zn]<br/>T(?zi, owl:sameAs, ?zj) | false | for each 1 ≤ i < j ≤ n
eq-diff3 | T(?x, rdf:type, owl:AllDifferent)<br/>T(?x, owl:distinctMembers, ?y)<br/>LIST[?y, ?z1, ..., ?zn]<br/>T(?zi, owl:sameAs, ?zj) | false | for each 1 ≤ i < j ≤ n

...

### SPIN

#### rdfD1
Can we SPARQL for datatypes?

#### rdfD2
construct {
  ?p rdf:type rdf:Property
}
where {
  ?s ?p ?o
  FILTER NOT EXISTS { ?p rdf:type rdf:Property }
}

#### rdfs1
Can we SPARQL for IRIs?

#### rdfs2
construct {
  ?yyy rdf:type ?xxx
}
where {
  ?aaa rdfs:domain ?xxx .
    ?yyy ?aaa ?zzz .
  FILTER NOT EXISTS { ?yyy rdf:type ?xxx }
}

#### rdfs3
construct {
  ?zzz rdf:type ?xxx
}
where {
    ?aaa rdfs:range ?xxx .
    ?yyy ?aaa ?zzz .
  FILTER NOT EXISTS { ?zzz rdf:type ?xxx }
}

#### rdfs4a
construct {
  ?xxx rdf:type rdfs:Resource
}
where {
    ?xxx ?aaa ?yyy .
  FILTER NOT EXISTS { ?xxx rdf:type rdfs:Resource }
}

#### rdfs4b
construct {
  ?yyy rdf:type rdfs:Resource
}
where {
    ?xxx ?aaa ?yyy .
  FILTER NOT EXISTS { ?yyy rdf:type rdfs:Resource }
}

#### rdfs5
construct {
  ?xxx rdfs:subPropertyOf ?zzz
}
where {
    ?xxx rdfs:subPropertyOf ?yyy .
    ?yyy rdfs:subPropertyOf ?zzz .
  FILTER NOT EXISTS { ?xxx rdfs:subPropertyOf ?zzz }
}

#### rdfs6
construct {
  ?xxx rdfs:subPropertyOf ?xxx
}
where {
    ?xxx rdf:type rdf:Property .
  FILTER NOT EXISTS { ?xxx rdfs:subPropertyOf ?xxx }
}

#### rdfs7
construct {
  ?xxx ?bbb ?yyy
}
where {
    ?aaa rdfs:subPropertyOf ?bbb .
    ?xxx ?aaa ?yyy .
  FILTER NOT EXISTS { ?xxx ?bbb ?yyy }
}

#### rdfs8
construct {
  ?xxx rdfs:subClassOf rdfs:Resource
}
where {
    ?xxx rdf:type rdfs:Class .
  FILTER NOT EXISTS { ?xxx rdfs:subClassOf rdfs:Resource }
}

#### rdfs9
construct {
  ?zzz rdf:type ?yyy
}
where {
    ?xxx rdfs:subClassOf ?yyy .
    ?zzz rdf:type ?xxx .
  FILTER NOT EXISTS { ?zzz rdf:type ?yyy }
}

#### rdfs10
construct {
  ?xxx rdfs:subClassOf ?xxx
}
where {
    ?xxx rdf:type rdfs:Class .
  FILTER NOT EXISTS { ?xxx rdfs:subClassOf ?xxx }
}

#### rdfs11
construct {
  ?xxx rdfs:subClassOf ?zzz
}
where {
    ?xxx rdfs:subClassOf ?yyy .
    ?yyy rdfs:subClassOf ?zzz .
  FILTER NOT EXISTS { ?xxx rdfs:subClassOf ?zzz }
}

#### rdfs12
construct {
  ?xxx rdfs:subPropertyOf rdfs:member
}
where {
    ?xxx rdf:type rdfs:ContainerMembershipProperty .
  FILTER NOT EXISTS { ?xxx rdfs:subPropertyOf rdfs:member }
}

#### rdfs13
construct {
  ?xxx rdfs:subClassOf rdfs:Literal
}
where {
    ?xxx rdf:type rdfs:Datatype .
  FILTER NOT EXISTS { ?xxx rdfs:subClassOf rdfs:Literal }
}
