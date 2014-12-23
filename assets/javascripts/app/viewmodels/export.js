define(['underscore', 'knockout', 'state'], function (_, ko, state) {
  return {
    displayName: 'Import',
    state: state,
    attached: function (view, parent) {
      // Wire up Import buttons
      $('#button_export').click(function (e) {
        state.store.graph(function (status, g) {
          $("#textarea_export").html(g.toNT());
        });
      });
    },
    compositionComplete: function(view, parent) {
      // Make ko available to console (TODO: Remove)
      window.context = this;
      // Make sure the caret is in the textbox on load
      state.store.graph(function (status, g) {
        $("#textarea_export").html(g.toNT());
      });
    }
  };
});