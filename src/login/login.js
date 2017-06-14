const loginCtx = document.currentScript.ownerDocument;

class Login extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        const template = loginCtx.querySelector('#myradio-login-template');
        this.shadow.appendChild( document.importNode(template.content, true) );
        this.shadow.querySelector('button').addEventListener('click', () => this.login());
        this.socket = new Socket();
    }

    login() {
        let username = this.shadow.querySelector('#username').value;
        let password = this.shadow.querySelector('#password').value;

        let data = JSON.parse(localStorage.getItem('userdata') || '{}');
        if(data[`${username}:${password}`]) {
            localStorage.setItem('me',`${username}:${password}`);
            this.socket.broadcast('info');
            location.href = '#/stations';
        } else {
            alert('Falsch');
        }
    }
}

customElements.define('myradio-login', Login);