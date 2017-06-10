const loginCtx = document.currentScript.ownerDocument;

class Login extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        const template = loginCtx.querySelector('#myradio-login-template');
        shadow.appendChild( document.importNode(template.content, true) );

    }
}

customElements.define('myradio-login', Login);