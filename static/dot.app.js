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

dot.Util = {
    cssPrefix: function() {
        var b = $.browser;
        return (b["mozilla"] ? "moz" : b["webkit"] ? "webkit" : b["opera"] ? "opera" : "").replace(/(.*)/, "-$1-");
    }
};

dot.Text = {
    loc: "ko",
    get: function(id) {
        try {
            return this[this.loc][id];
        } catch(ex) {
            return "???";
        }
    },
    change: function(l) {
        this.loc = l;
    },

    "ko": {
        "LANGUAGE": "언어",
        "C_CLEAR": "정말 삭제 하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
        "CANT_SAVE": "저장을 지원하지 않는 기기 입니다."
    },
    "en": {
        "LANGUAGE": "Language",
        "C_CLEAR": "Do you want clear?\nIt can't be restore!"
    }
};

$.extend(dot, {
    initialize: function(){
        //TODO: initialize application
    },
    action: function(value){
        console.log(value + ' ' + this.color);
    }
});
