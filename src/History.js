import createHashHistory from "history/createHashHistory";

export class History {
    constructor() {
        this.history         = null;
        this.pathname        = '';
        this.requestCallback = null;
        this.silent          = false;
    }

    initialHistory(history) {
        if (history) {
            this.history = history;
        } else {
            this.history = createHashHistory();
        }
    }

    setRequestCallback(requestCallback) {
        this.requestCallback = requestCallback;
    }

    listen() {
        this.history.listen((locaton) => {
            this.pathname = locaton.pathname;
            if (!(this.silent)) this.requestCallback(locaton.pathname);
        });
    }

    async push(pathname) {
        this.pathname = pathname;
        this.silent   = true;
        await this.requestCallback(pathname);
        this.history.push(pathname);
        this.silent = false;
    }

    getLocation() {
        return this.history.location;
    }

    getRequestLocation() {
        return {
            pathname: this.pathname
        };
    }
}

const history = new History();

export default history;
