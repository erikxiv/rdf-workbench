define(['underscore', 'knockout', 'state', 'rquery'], function (_, ko, state, rq) {
  return {
    displayName: 'Instance',
    iri: ko.observable(''),
    state: state,
    rdf: state.store.rdf,
    instance: ko.observable(),
    rq: rq,
    activate: function(iri) {
      this.iri(iri);
      this.instance(rq(iri));
    },
    attached: function (view, parent) {
    },
    compositionComplete: function(view, parent) {
          // Make ko available to console (TODO: Remove)
          window.context = this;
    }
  };
});