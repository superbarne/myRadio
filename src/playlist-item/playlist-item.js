const playlistItemCtx = document.currentScript.ownerDocument;

class PlaylistItem extends HTMLElement {
    constructor(params) {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        const template = playlistItemCtx.querySelector('#myradio-playlist-item-template');
        this.shadow.appendChild( document.importNode(template.content, true) );

        let me = localStorage.getItem('me');
        let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');

        this.stations = userdata[me].playlists[params.id].stations;
        this.render();
    }

    render() {
        let holder = this.shadow.querySelector('#stations-holder');
        holder.innerHTML = '';

        const template = playlistItemCtx.querySelector('#myradio-playlist-loop-template');
        for(let i in this.stations) {
            let station = this.stations[i];
            let element = document.importNode(template.content, true);
            element.querySelector('#station-name').innerText = station.name;
            element.querySelector('#station-img').setAttribute('src',station.image.url || 'assets/images/ionicons_2-0-1_radio-waves_256_0_8b8b8b_none.png')
            element.querySelector('#station-play').addEventListener('click', () => {
                if(!station.streams) return;
                station = {
                    id: station.id,
                    name: station.name,
                    stream: station.streams[0].stream,
                };
                this.socket.broadcast('play', { station });
            });
            holder.appendChild(element);
        }
    }
}

customElements.define('myradio-playlist-item', PlaylistItem);