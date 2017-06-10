const stationsnCtx = document.currentScript.ownerDocument;

class Stations extends HTMLElement {
    constructor(params) {
        super();
        console.log(params)
        const shadow = this.attachShadow({mode: 'open'});
        const template = stationsnCtx.querySelector('#myradio-stations-template');
        shadow.appendChild( document.importNode(template.content, true) );

    }
}

customElements.define('stations-login', Stations);