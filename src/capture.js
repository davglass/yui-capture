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
            fires.push([el, sType, arguments, (new Date()).getTime()]);
            wrappedFn.call();
        };
        Event.__simpleAdd.apply(Event, [el, sType, fn, capture]);
    };
    

    var Capture = function() {
        this.cursor = Dom.get('cursor');
    };

    var proto = {
        _started: null,
        _stopped: null,
        _handleMouseMove: function(e) {
            this.cursor.style.top = e.pageY + 'px';
            this.cursor.style.left = e.pageX + 'px';
        },
        _handleClick: function(e) {
            var tar = Event.getTarget(e);

            try {
                tar.focus();
            } catch (e) {};
            YAHOO.util.UserAction.mousedown(tar, e);
            YAHOO.util.UserAction.mouseup(tar, e);
            YAHOO.util.UserAction.click(tar, e);
        },
        _handleKeyPress: function(e) {
            var tar = Event.getTarget(e);

            try {
                tar.focus();
            } catch (e) {};
            YAHOO.util.UserAction.keyup(tar, e);
            YAHOO.util.UserAction.keydown(tar, e);
            YAHOO.util.UserAction.keypress(tar, e);
        },
        start: function() {
            this._started = (new Date()).getTime();
            this._stopped = null;
        },
        stop: function() {
            this._stopped = (new Date()).getTime();
        },
        play: function() {

            this.cursor.style.display = 'block';
            var f = this._getEvents(),
                index = 0,
                method = null;

            for (var i = 0; i < f.length; i++) {
                index = (f[i][3] - this._started);
                switch (f[i][1]) {
                    case 'keypress':
                        method = this._handleKeyPress;
                        break;
                    case 'click':
                        method = this._handleClick;
                        break;
                    case 'mousemove':
                        method = this._handleMouseMove;
                        break;
                }
                YAHOO.lang.later(index, this, method, [f[i][2][0]]);
            }
        },
        _getEvents: function() {
            var out = [];
            for (var i = 0; i < fires.length; i++) {
                if (fires[i][3]) {
                    if ((fires[i][3] > this._started) && (fires[i][3] < this._stopped)) {
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
