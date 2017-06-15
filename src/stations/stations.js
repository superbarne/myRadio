const stationsnCtx = document.currentScript.ownerDocument;

class Stations extends HTMLElement {
    constructor(params) {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        const template = stationsnCtx.querySelector('#myradio-stations-template');
        this.shadow.appendChild(document.importNode(template.content, true));
        this.endpoint = 'stations/popular'; // der Endpunkt
        this.query = { // die parameter für den Endpunkt
            page: 0,
            offset: 0,
            per_page: 15
        };
        this.socket = new Socket();
    }

    connectedCallback() {
        this.fetch();
        this.shadow.querySelector('#next').addEventListener('click', () => this.next()); // next prev bindings
        this.shadow.querySelector('#prev').addEventListener('click', () => this.prev());
        //this.shadow.querySelector('#search').addEventListener('keydown', (e) => this.search(e));
        this.renderFilter();
    }

    renderFilter() { // die dropdown mit daten und listenern füllen
        const countryFilter = this.shadow.querySelector('#country-filter');
        const categoryFilter = this.shadow.querySelector('#category-filter');
        this.getCountries().then(countries => {
            countries = countries.sort((a, b) => a.name.localeCompare(b.name)); // aplhabetisch sortierne localeCompare ist ne neue es6 funktion dafür

            for(let i in countries) {
                let item = document.createElement('option');
                item.innerHTML = countries[i].name;
                item.dataset.code = countries[i].country_code;
                countryFilter.appendChild(item);
            }

            countryFilter.addEventListener('change', () => {
                categoryFilter.selectedIndex = 0;
                this.endpoint = `countries/${countryFilter.options[countryFilter.selectedIndex].dataset.code}/stations`; // bei auswahl den Endpunkt löschen
                this.fetch(); // daten neu holen
            })
        });

        this.getCategories().then(categories => {
            categories = categories.sort((a, b) => a.title.localeCompare(b.title));

            for(let i in categories) {
                let item = document.createElement('option');
                item.innerHTML = categories[i].title;
                item.dataset.id = categories[i].id;
                categoryFilter.appendChild(item);
            }

            categoryFilter.addEventListener('change', () => {
                countryFilter.selectedIndex = 0;
                this.endpoint = `category/${categoryFilter.options[categoryFilter.selectedIndex].dataset.id}/stations`;
                this.fetch();
            })
        });
    }

    search(e) {
        if(e.which!==13) return;
        this.endpoint = 'search';
        this.query.query = 'test'
        this.fetch();
    }

    fetch() { // stationen abrucfen und das rendern auslösen
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

    getCategories() {
        return fetch(`http://borsti.inf.fh-flensburg.de/dirble/getDirbleCORS.php?dirbleRequest=http://api.dirble.com/v2/categories/primary`, {
            method: 'get'
        })
        .then(res => res.json())
    }

    getCountries() {
        return fetch(`http://borsti.inf.fh-flensburg.de/dirble/getDirbleCORS.php?dirbleRequest=http://api.dirble.com/v2/countries`, {
            method: 'get'
        })
        .then(res => res.json())
    }

    getStations() {
        let params = Object.keys(this.query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(this.query[k])}`).join('&');
        // params wird aus dem params object gebaut object -> String #es6

        return fetch(`http://borsti.inf.fh-flensburg.de/dirble/getDirbleCORS.php?dirbleRequest=http://api.dirble.com/v2/${this.endpoint}&${params}`, {
            method: 'get'
        })
        .then(res => res.json())
    }

    renderStations() {
        let holder = this.shadow.querySelector('#stations-holder');
        let me = localStorage.getItem('me');
        let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');
        let playlists = userdata[me].playlists; //palylisten

        holder.innerHTML = '';
        this.shadow.querySelector('#curPage').innerText = this.query.page+1;
        const template = stationsnCtx.querySelector('#myradio-stations-item-template');
        for(let i in this.stations) {
            let station = this.stations[i];
            let element = document.importNode(template.content, true);
            element.querySelector('#station-name').innerText = station.name;
            element.querySelector('#station-img').setAttribute('src',station.image.url || 'assets/images/ionicons_2-0-1_radio-waves_256_0_8b8b8b_none.png')
            element.querySelector('#station-play').addEventListener('click', () => {
                if(!station.streams) return;
                station = { // nur das nötigste übergeben
                    id: station.id,
                    name: station.name,
                    stream: station.streams[0].stream,
                };
                this.socket.broadcast('play', { station }); // Abspiel Event triggern
            });
            let playlist = element.querySelector('#playlist');
            for(let id in playlists) { // playlist dropdown erstellen
                let item = document.createElement('option');
                item.innerHTML = playlists[id].name;
                item.dataset.id = id;
                playlist.appendChild(item);
            }
            playlist.addEventListener('change', (e) => {
                this.add(playlist.options[playlist.selectedIndex].dataset.id, station); // radio der Playlist hinzufügen
                playlist.selectedIndex=0;
            });
            holder.appendChild(element);
        }
    }

    add(playlistId, station) {
        let me = localStorage.getItem('me');
        let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');
        userdata[me].playlists[playlistId].items[+new Date+''+Math.round(Math.random()*1000)] = station;
        this.socket.meta.userdata = userdata;
        localStorage.setItem('userdata',JSON.stringify(userdata));
        this.socket.broadcast('info');
        alert('Hinzugefügt!');
    }

}

customElements.define('stations-login', Stations);