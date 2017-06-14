const userCtx = document.currentScript.ownerDocument;

class User extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        const template = userCtx.querySelector('#myradio-user-template');
        this.shadow.appendChild( document.importNode(template.content, true) );
        this.shadow.querySelector('#logout').addEventListener('click', () => this.logout());

        this.socket = new Socket();
        this.socket.on('connected', () => {
            let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');
            this.socket.meta.userdata = userdata;
            this.socket.broadcast('info');
        });

        this.socket.on(['info','join'], (e) => {
            if(e.meta.userdata) {
                let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');
                Object.assign(userdata, e.meta.userdata);
                localStorage.setItem('userdata',JSON.stringify(userdata));
            }
        })
    }

    logout() {
        localStorage.setItem('me', null);
        location.href = '#/login';
    }

}

customElements.define('myradio-user', User);