const playerCtx = document.currentScript.ownerDocument;

class Player extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        const template = playerCtx.querySelector('#myradio-player-template');
        shadow.appendChild( document.importNode(template.content, true) );

    }
}

customElements.define('myradio-player', Player);