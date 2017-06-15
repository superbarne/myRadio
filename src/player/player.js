const playerCtx = document.currentScript.ownerDocument;

class Player extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        const template = playerCtx.querySelector('#myradio-player-template');
        this.shadow.appendChild( document.importNode(template.content, true) );

        this.socket = new Socket();
        this.nativPlayer = document.createElement('audio');
        this.socket.on('play', (e) => this.play(e.station)); // binden der ganzen events auf die Funktionen
        this.socket.on('pause', () => this.pause());
        this.socket.on('volume', (e) => this.volume(e.volume));
        this.shadow.querySelector('.controls .control').addEventListener('click', () => this.playPause()); //binden der ui elemente auf funktionen
        this.shadow.querySelector('#volume').addEventListener('change', (e) => {
            let volume =  e.target.value;
            this.socket.broadcast('volume', { volume })
        });
        this.renderButton(); // Button richtig einstellen
    }

    play(station) {
        if(station) { //wenn eine neue station übergeben wurde diese setzen
            this.curStation = station;
            this.nativPlayer.src = station.stream;
            this.shadow.querySelector('.current').innerHTML = station.name;
        }
        this.nativPlayer.play(); // dann abspielen
        this.renderButton(); // und den button neu setzen
    }

    pause() {
        this.nativPlayer.pause(); // den player pausieren
        this.renderButton();
    }

    volume(val) {
        this.shadow.querySelector('#volume').value = val; // die eigenen Trackbar anpassen
        this.nativPlayer.volume = val; // vol setzen

    }

    renderButton() {
        let controls = this.shadow.querySelector('.controls .control'); // enteder das zeicehn für play oder pauese anzeigen
        if(this.nativPlayer.paused) {
            controls.classList.add('play');
            controls.classList.remove('pause');
        } else {
            controls.classList.remove('play');
            controls.classList.add('pause');
        }
    }

    playPause() { // abspielen oder pause
        if(this.nativPlayer.paused) {
            if(this.curStation) {
                let station = this.curStation; // wird nicht direkt abgespielt, ert über das event
                this.socket.broadcast('play', { station })
            }
        } else {
            this.socket.broadcast('pause', {  })
        }

    }
}

customElements.define('myradio-player', Player);