window.Dot = {};

$.extend(window.Dot, {

    /* const variables */
    MODE_DRAW: 'mode_draw',
    MODE_VIEW: 'mode_view',

    /* attributes */
    color: '#000000',

    initialize: function(){
        //TODO: initialize application
    }
});

$(document).ready(function(){
    window.Dot.initialize();
});
