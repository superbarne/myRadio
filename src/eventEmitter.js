class EventEmitter {
    constructor() {
        this.listener = [];
        this.listenerFunc = [];
        this.cb = [];
    }

    /**
     * listen on an event
     * @param  {String} event event type for example data
     * @param  {Function} callback callback when data is emited
     * @return {void}       returns nothing
     */
    on(event, callback) {
        if(!Array.isArray(event)) event = [event];
        for (var i = 0; i < event.length; i++) {
            this.listener.push(event[i]);
            this.listenerFunc.push(callback);
        }
    }

    /**
     * emits data to the socket
     * @param  {String} event event wich should be emited
     * @param  {Object} args  arguments to pass to listener
     * @return {Promise}       resolves when message is send and rejects when an error happens
     */
    emit(event, args) {
        let calls = this.listener.reduce((prev, cur, i) => cur == event ? prev.concat(this.listenerFunc[i]) : prev,[])
        for (var i = 0; i < calls.length; i++) calls[i](args);
        for (var i = 0; i < this.cb.length; i++) this.cb[i](event, args);
    }

    /**
     * um alle events zu erfassen
     **/
    use(cb) {
        this.cb.push(cb);
    }
}