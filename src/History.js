import createHashHistory from "history/createHashHistory";

export class History {
    constructor() {
        this.requestCallback = null;
        this.history         = null;
        this.silent          = false;
    }

    setHistory(history) {
        this.history = history;
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
        this.silent = true;
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
history.setHistory(createHashHistory());

export default history;
