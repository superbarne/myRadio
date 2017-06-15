const loginCtx = document.currentScript.ownerDocument;

class Login extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        const template = loginCtx.querySelector('#myradio-login-template');
        this.shadow.appendChild( document.importNode(template.content, true) );
        this.shadow.querySelector('button').addEventListener('click', () => this.login()); // wenn auf Login gedrückt wird
        this.socket = new Socket();
    }

    login() {
        let username = this.shadow.querySelector('#username').value;
        let password = this.shadow.querySelector('#password').value;

        let data = JSON.parse(localStorage.getItem('userdata') || '{}'); //die Nutzerdaten aus dem localstrage holen, falls keine vorhanden sind bekommt er ein leeres object

        if(data[`${username}:${password}`]) { // überprüft die Nutzerdaten, der key wird in user:pass format hinterlegt
            localStorage.setItem('me',`${username}:${password}`);
            this.socket.broadcast('info'); //anmeldung wird bekanntgegeben
            location.href = '#/stations'; // stations auflistung weiterleiten
        } else {
            alert('Falsch'); //Fehlermeldung bie faslcheingabe
        }
    }
}

customElements.define('myradio-login', Login);