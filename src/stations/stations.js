const stationsnCtx = document.currentScript.ownerDocument;

class Stations extends HTMLElement {
    constructor(params) {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        const template = stationsnCtx.querySelector('#myradio-stations-template');
        this.shadow.appendChild(document.importNode(template.content, true));
    }

    connectedCallback() {
        this.getStations()
        .then(stations => this.stations = stations)
        .then(() => this.renderStations())
    }

    getStations() {
        return fetch('http://borsti.inf.fh-flensburg.de/dirble/getDirbleCORS.php?dirbleRequest=http://api.dirble.com/v2/stations/popular', {
            method: 'get'
        })
        .then(res => res.json())
    }

    renderStations() {
        let holder = this.shadow.querySelector('#stations-holder');
        const template = stationsnCtx.querySelector('#myradio-stations-item-template');
        for(let i in this.stations) {
            const station = this.stations[i];
            console.log(station)
            let element = document.importNode(template.content, true);
            element.querySelector('#station-name').innerText = station.name;
            element.querySelector('#station-img').setAttribute('src',station.image.url || 'assets/images/ionicons_2-0-1_radio-waves_256_0_8b8b8b_none.png')
            holder.appendChild(element);
        }
    }

}

customElements.define('stations-login', Stations);