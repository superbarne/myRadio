

class Router extends HTMLElement {
    constructor() {
        super();
        this.routes = {
            '/login': Login,
            '/register': Register,
            '/stations': Stations,
            '/list/:id': Stations
        };
        this.params = {};
    }

    connectedCallback() {
        this.checkRoute();
        window.addEventListener('hashchange', (e) => this.checkRoute(e));
    }

    getRoute(hash) {
        hash = hash.split('/');
        for(let route in this.routes) {
            let routeSegments = route.split('/');
            let routeSegmentsParams = routeSegments.map(cur => cur[0]===':' ? cur : false);
            if(hash.length !== routeSegments.length) continue;
            let match = true;
            for(let i in hash) {
                if(!(hash[i] === routeSegments[i] || routeSegmentsParams[i])){
                    match = false;
                }
            }
            if (match) {
                this.params = {};
                for(let i in routeSegmentsParams) {
                    if(routeSegmentsParams[i]) {
                        this.params[routeSegmentsParams[i].replace(':', '')] = hash[i];
                    }
                }
                return this.routes[route];
            }
        }
        return false;
    }

    checkRoute() {
        if(window.location.hash != '#/login' && !localStorage.getItem('me')) window.location.hash = '#/login';
        const hash = window.location.hash.replace('#','');
        const Element = this.routes[hash] || this.getRoute(hash);
        if(Element) {
            this.innerHTML = '';
            this.appendChild(new Element(this.params));
            this.setActive(hash);
        } else {
            window.location.hash = '#/login';
        }
    }

    setActive(hash) {
        const links = document.querySelectorAll('.link-active');
        links.forEach((item) => {
            if(item.getAttribute('href').replace('#','') === hash)
                item.classList.add('active');
            else
                item.classList.remove('active');
        });
    }
}

customElements.define('myradio-router', Router);