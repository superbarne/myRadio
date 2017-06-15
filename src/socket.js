let socketInstance = null;

class Socket extends EventEmitter {
    constructor() {
        if(socketInstance) return socketInstance; // Socket Klasse nur einal instanzieren (Singleton);
        super();

        this.id = +new Date+''+Math.round(Math.random()*10000);
        /**
         * Meta informationen
         **/
        this.meta = {};

        /**
         * WEbsocket Verbindung
         **/
        this.ws = new WebSocket("ws://127.0.0.1:8080");

        this.sockets = {};

        // binding von websocket auf den eigenn EventEmitter
        this.ws.onopen = (event) => this.emit('connected', event);
        this.ws.onmessage = (data) => this.emit('data',data);
        this.ws.onclose = (event) => this.emit('closed', event)


        this.on('connected', () => this.broadcast('join'));
        this.on('leave', (message) => delete this.sockets[message.id]); // beim verlassen socket aus interner liste entfernen
        this.on('data', (message) => this.parseMessage(message)); // bei ws daten sie parsen
        this.on('message', (message) => console.log(message)); // debug output
        this.on('message', (message) => message.event ? this.emit(message.event, message) : null ); // message mit event emiten
        this.on(['info', 'join'], (message) => this.sockets[message.id] = message);
        this.on('join', (message) => this.broadcast('info')); // wenn jemadn joint sie über ein informieren
        window.addEventListener("beforeunload", () => this.close()); // wenn man den tab schließt sich verabschieden

        socketInstance = this;
    }

    /**
     * eingenhende nachrichten parsen
     **/
    parseMessage(message) {
        return this.decrypt(message.data)
            .then((message) => {
                return JSON.parse(message);
            })
            .then((obj) => {
                if(!obj.target) return obj;
                if(obj.target == this.id) return obj;
                return Promise.reject();
            })
            .then((obj) => this.emit('message', obj))
            .catch(() => {})
    }

    /**
     * nachricht an alle clients sendne
     **/
    broadcast(event, message) {
        message = message || {};
        message.event = event;
        message.id = this.id;
        message.meta = this.meta;
        message.date = new Date;
        this.emit(event, message);
        return this.encrypt(JSON.stringify(message))
            .then((str) => this.ws.send(str))
    }

    /**
     * nachricht an einem client senden
     **/
    send(event, message, target) {
        message.target = target;
        this.broadcast(event, message);
    }


    /**
     * verschlüsselungs methode
     **/
    encrypt(string) {
        var code = [];
        for (var i = 0; i < string.length; i++) {
            code.push(string.charCodeAt(i)+5);
        }
        return Promise.resolve(code.reduce(function(str, i) {
            return str += String.fromCharCode(i);
        }, ''))
    }

    /**
     * entschlüsselungs methode
     **/
    decrypt(string) {
        let code = [];
        for (let i = 0; i < string.length; i++) {
            code.push(string.charCodeAt(i)-5);
        }
        return Promise.resolve(code.reduce(function(str, i) {
            return str += String.fromCharCode(i);
        }, ''))
    }

    /**
     * wird aufgerufen, wenn das browserfenster geschlossen wird
     **/
    close() {
        this.broadcast('leave');
    }
}