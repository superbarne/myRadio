const playlistCtx = document.currentScript.ownerDocument;

class Playlist extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        const template = playlistCtx.querySelector('#myradio-playlist-template');
        this.shadow.appendChild( document.importNode(template.content, true) );
        this.shadow.querySelector('.fav').addEventListener('click', () => this.add())
        this.socket = new Socket();
        this.socket.on(['join','info'],(e) => this.render());
    }

    add() {
        let me = localStorage.getItem('me');
        if(!me) return alert('Du bist nicht angemeldet');
        let name = prompt('Playlist name:');
        let playlist = {
            id: +new Date+''+Math.round(Math.random()*1000),
            createdAt: new Date,
            name,
            items: {}
        };

        let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');

        userdata[me].playlists[playlist.id] = playlist;

        this.socket.meta.userdata = userdata;
        localStorage.setItem('userdata',JSON.stringify(userdata));
        this.socket.broadcast('info');
    }

    render() {
        let me = localStorage.getItem('me');
        let playlists = this.shadow.querySelector('.menu');
        playlists.innerHTML = '';
        if(!me) return;

        let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');
        for(let id in userdata[me].playlists) {
            if(userdata[me].playlists[id].deleted) continue;
            let item = document.createElement('li');
            let a = document.createElement('a');
            let remove = document.createElement('span');
            remove.classList.add('remove');
            remove.addEventListener('click',() => this.remove(id));
            a.href = '#/list/' + id;
            a.innerHTML = userdata[me].playlists[id].name;
            item.appendChild(remove);
            item.appendChild(a);
            playlists.appendChild(item);
        }
    }

    remove(id) {
        let me = localStorage.getItem('me');
        if(!me) return;
        let userdata = JSON.parse(localStorage.getItem('userdata') || '{}');
        userdata[me].playlists[id].deleted = true;
        this.socket.meta.userdata = userdata;
        localStorage.setItem('userdata',JSON.stringify(userdata));
        this.socket.broadcast('info');
    }

}

customElements.define('myradio-playlist', Playlist);