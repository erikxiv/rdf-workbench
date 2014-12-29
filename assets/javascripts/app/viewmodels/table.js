define(['underscore', 'knockout', 'state', 'typeahead', 'rquery'], function (_, ko, state, typeahead, rq) {
  // // constructs the suggestion engine
  // var predicateHound = new Bloodhound({
  //   datumTokenizer: Bloodhound.tokenizers.obj.nonword('iri', 'prefixed'),
  //   queryTokenizer: Bloodhound.tokenizers.nonword,
  //   // `states` is an array of state names defined in "The Basics"
  //   // local: $.map(state.predicates(), function(p) {
  //   //   return { value: p.value }; 
  //   // })
  //   // local: [{value: 'x:qwer', other: 'yngew'}, {value:'y:qwer', other:'Albert'}, {value: 'Kalle', other:'Akva'}]
  //   local: []
  // });
   
  // // kicks off the loading/processing of `local` and `prefetch`
  // predicateHound.initialize();

  // // Keep typeahead updated with fresh predicates
  // function updatePredicateHound(ps) {
  //   predicateHound.clear();
  //   predicateHound.add(ps);
  // }
  // state.predicates.subscribe(updatePredicateHound);
  // updatePredicateHound(state.predicates());

  return {
    displayName: 'Table',
    state: state,
    rdf: state.store.rdf,
    iri: ko.observable(),
    instance: ko.observable(),
    classes: ko.observable(rq('rdfs:Class')),
    activate: function(iri) {
      if (! iri)
        iri = state.store.rdf.prefixes.resolve('rdfs:Class');
      this.iri(iri);
      this.instance(rq(iri));
    },
    attached: function (view, parent) {
    //   $('#filter_predicate .typeahead').typeahead({
    //     hint: true,
    //     highlight: true,
    //     minLength: 1
    //   },
    //   {
    //     name: 'predicateHound',
    //     displayKey: 'prefixed',
    //     // `ttAdapter` wraps the suggestion engine in an adapter that
    //     // is compatible with the typeahead jQuery plugin
    //     source: predicateHound.ttAdapter()
    //   });  
    },
    compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
    }
  };
});