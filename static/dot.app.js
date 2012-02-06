var dot = {};

dot.Callbacks = (function(){
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

$.extend(dot, {

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




dot.Util = {
    cssPrefix: function() {
        var b = $.browser;
        return (b["mozilla"] ? "moz" : b["webkit"] ? "webkit" : b["opera"] ? "opera" : "").replace(/(.*)/, "-$1-");
    }
};