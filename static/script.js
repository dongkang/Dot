var Dot = {};

Dot.Callbacks = (function(){
    var callbacks = {}, contexts = {};
    return function(name, context){
        if(!callbacks[name]){
            callbacks[name] = $.Callbacks();
            contexts[name] = context || window;
        }
        return {
            add: function(func){
                callbacks[name].add(func);
            },
            fire: function(){
                callbacks[name].fireWith.apply(this, [contexts[name]].concat(arguments));
            }
        };
    };
})();

$.extend(Dot, {

    /* const variables */
    MODE_DRAW: 'mode_draw',
    MODE_VIEW: 'mode_view',

    /* attributes */
    color: '#000000',

    initialize: function(){
        //TODO: initialize application
    },
    action: function(value){
        console.log(value + ' ' + this.color);
    }
});

$(document).ready(function(){
    window.Dot.initialize();
});
