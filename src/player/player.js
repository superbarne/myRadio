const playerCtx = document.currentScript.ownerDocument;

class Player extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        const template = playerCtx.querySelector('#myradio-player-template');
        this.shadow.appendChild( document.importNode(template.content, true) );

        this.socket = new Socket();
        this.nativPlayer = document.createElement('audio');
        this.socket.on('play', (e) => this.play(e.station));
        this.socket.on('pause', () => this.pause());
        this.socket.on('volume', (e) => this.volume(e.volume));
        this.shadow.querySelector('.controls .control').addEventListener('click', () => this.playPause());
        this.shadow.querySelector('#volume').addEventListener('change', (e) => {
            let volume =  e.target.value;
            this.socket.broadcast('volume', { volume })
        });
        this.renderButton();
    }

    play(station) {
        if(station) {
            this.curStation = station;
            this.nativPlayer.src = station.stream;
            this.shadow.querySelector('.current').innerHTML = station.name;
        }
        this.nativPlayer.play();
        this.renderButton();
    }

    pause() {
        this.nativPlayer.pause();
        this.renderButton();
    }

    volume(val) {
        this.shadow.querySelector('#volume').value = val;
        this.nativPlayer.volume = val;

    }

    renderButton() {
        let controls = this.shadow.querySelector('.controls .control');
        if(this.nativPlayer.paused) {
            controls.classList.add('play');
            controls.classList.remove('pause');
        } else {
            controls.classList.remove('play');
            controls.classList.add('pause');
        }
    }

    playPause() {
        if(this.nativPlayer.paused) {
            if(this.curStation) {
                let station = this.curStation;
                this.socket.broadcast('play', { station })
            }
        } else {
            this.socket.broadcast('pause', {  })
        }

    }
}

customElements.define('myradio-player', Player);