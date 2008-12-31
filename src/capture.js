(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        listeners = [],
        fires = [];

    /**
    * This is a COMPLETE hack, the YUI Event utility doesn't allow us
    * to get a list of all listeners, or know when any of them are fired.
    */
    Event.__simpleAdd = Event._simpleAdd;
    Event._simpleAdd = function(el, sType, wrappedFn, capture) {
        listeners.push(arguments);
        var fn = function() {
            //console.log(el, sType, arguments);
            fires.push([el, sType, arguments, (new Date()).getTime()]);
            wrappedFn.call();
        };
        Event.__simpleAdd.apply(Event, [el, sType, fn, capture]);
    };
    

    var Capture = function() {
    };

    var proto = {
        _started: null,
        _stopped: null,
        start: function() {
            this._started = (new Date()).getTime();
            this._stopped = null;
            console.log('start');
        },
        stop: function() {
            this._stopped = (new Date()).getTime();
            console.log('stop');
            //console.log(this._getEvents());
        },
        play: function() {
            var c = Dom.get('cursor');

            c.style.display = 'block';
            console.log('play');
            var f = this._getEvents();
            console.log(fires.length, ' :: ', f.length);
            for (var i = 0; i < f.length; i++) {
                if (fires[i][1] == 'mousemove') {
                    console.log(fires[i][2][0]);
                    c.style.top = fires[i][2][0].pageY + 'px';
                    c.style.left = fires[i][2][0].pageX + 'px';
                }
            }
        },
        _getEvents: function() {
            var out = [];
            for (var i = 0; i < fires.length; i++) {
                if (fires[i][3]) {
                    if ((fires[i][3] > this._started) && (fires[i][3] < this._stopped)) {
                        //console.log(fires[i][3]);
                        out.push(fires[i]);
                    }
                }
            }
            return out;
        }
    };

    Capture.prototype = proto;
    YAHOO.util.Capture = Capture;

})();
