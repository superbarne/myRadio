const stationsnCtx = document.currentScript.ownerDocument;

class Stations extends HTMLElement {
    constructor(params) {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        const template = stationsnCtx.querySelector('#myradio-stations-template');
        this.shadow.appendChild(document.importNode(template.content, true));
        this.endpoint = 'stations/popular';
        this.query = {
            page: 0,
            offset: 0,
            per_page: 15
        }
    }

    connectedCallback() {
        this.fetch();
        this.shadow.querySelector('#next').addEventListener('click', () => this.next());
        this.shadow.querySelector('#prev').addEventListener('click', () => this.prev());
        this.shadow.querySelector('#search').addEventListener('keydown', (e) => this.search(e));
    }

    search(e) {
        if(e.which!==13) return;
        this.endpoint = 'search';
        this.query.query = 'test'
        this.fetch();
    }

    fetch() {
        return this.getStations()
        .then(stations => this.stations = stations)
        .then(() => this.renderStations())
    }

    next() {
        this.query.page++;
        this.fetch();
    }

    prev() {
        if(this.query.page!==0) this.query.page--;
        this.fetch();
    }

    getStations() {
        let params = Object.keys(this.query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(this.query[k])}`).join('&');

        return fetch(`http://borsti.inf.fh-flensburg.de/dirble/getDirbleCORS.php?dirbleRequest=http://api.dirble.com/v2/${this.endpoint}&${params}`, {
            method: 'get'
        })
        .then(res => res.json())
    }

    renderStations() {
        let holder = this.shadow.querySelector('#stations-holder');
        holder.innerHTML = '';
        this.shadow.querySelector('#curPage').innerText = this.query.page+1;
        const template = stationsnCtx.querySelector('#myradio-stations-item-template');
        for(let i in this.stations) {
            const station = this.stations[i];
            let element = document.importNode(template.content, true);
            element.querySelector('#station-name').innerText = station.name;
            element.querySelector('#station-img').setAttribute('src',station.image.url || 'assets/images/ionicons_2-0-1_radio-waves_256_0_8b8b8b_none.png')
            holder.appendChild(element);
        }
    }

}

customElements.define('stations-login', Stations);