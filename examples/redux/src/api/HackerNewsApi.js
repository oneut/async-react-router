import Firebase from "firebase";

class HackerNewsApi {
    constructor() {
        this.displayNumber = 20;

        Firebase.initializeApp({
            databaseURL: 'https://hacker-news.firebaseio.com'
        });
        this.api = Firebase.database().ref('/v0');
    }

    async getTopStoryItems(page = 1) {
        const ids    = await this.getTopStoryItemIds();
        const offset = this.displayNumber * (page - 1);
        const limit  = offset + this.displayNumber;
        return await Promise.all(ids.slice(offset, limit).map(async (id) => await this.findItem(id)));
    }

    async getTopStoryItemIds() {
        const snapshot = await this.api.child('/topstories').once('value');
        return snapshot.val();
    }

    async findItem(id) {
        const snapshot = await this.api.child(`/item/${id}`).once('value');
        return snapshot.val();
    }

    async getComments(ids) {
        if (!ids) {
            return [];
        }

        const comments = await Promise.all(ids.map(async (id) => await this.findItem(id)));
        return await Promise.all(comments.map(async (comment) => {
            comment.comments = await this.getComments(comment.kids);
            return comment;
        }));
    }

    async findUser(id) {
        const snapshot = await this.api.child(`/user/${id}`).once('value');
        return snapshot.val();
    }
}

const hackerNewsApi = new HackerNewsApi();

export default hackerNewsApi;
