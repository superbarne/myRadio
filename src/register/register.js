const registerCtx = document.currentScript.ownerDocument;

class Register extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        const template = registerCtx.querySelector('#myradio-register-template');
        this.shadow.appendChild( document.importNode(template.content, true) );
        this.shadow.querySelector('#register').addEventListener('click', () => this.register());
        this.socket = new Socket();
        this.socket.on(['info','join'],(e) => console.log(e))
    }

    register() { // wird beim klick auf regisrieren aufgerufen
        let username = this.shadow.querySelector('#username').value;
        let password = this.shadow.querySelector('#password').value;

        let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');
        if(!userdata[`${username}:${password}`]) { // überprüfen ob es den Nutzer schon gibt
            userdata[`${username}:${password}`] = { // und dann ein leeren inistaliesieren
                name: username,
                playlists: {}
            };
            this.socket.meta.userdata = userdata;
            this.socket.broadcast('info');
            localStorage.setItem('userdata',JSON.stringify(userdata)); // speicher und bekanntgeben
            location.href='#/login'; // nach login weiterleiten
        } else {
            alert('Benutzer schon vergeben'); // Fehlermedlung
        }
    }
}

customElements.define('myradio-register', Register);