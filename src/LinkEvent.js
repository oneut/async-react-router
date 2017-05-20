import { EventEmitter } from "events";

class LinkEvent {
    constructor() {
        this.events = [];
    }

    emit(to) {
        for (let i = 0; this.events.length > i; i++) {
            this.events[i](to);
        }
    }

    on(callback) {
        this.events.push(callback);
    }
}

const linkEvent = new LinkEvent();

export default linkEvent;