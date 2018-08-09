import Firebase from "firebase";
import LRU from "lru-cache";

class HackerNewsApi {
  constructor() {
    this.displayNumber = 20;

    Firebase.initializeApp({
      databaseURL: "https://hacker-news.firebaseio.com"
    });
    this.api = Firebase.database().ref("/v0");
    this.cache = LRU({
      max: 500,
      maxAge: 1000 * 60 * 60
    });
  }

  async getTopStoryItems(page = 1) {
    const ids = await this.getTopStoryItemIds();
    const offset = this.displayNumber * (page - 1);
    const limit = offset + this.displayNumber;
    return await Promise.all(
      ids.slice(offset, limit).map(async id => await this.findItem(id))
    );
  }

  async getTopStoryItemIds() {
    if (this.cache.has("topstories")) return this.cache.get("topstories");
    const snapshot = await this.api.child("/topstories").once("value");
    const value = snapshot.val();
    this.cache.set("topstories", value);
    return value;
  }

  async findItem(id) {
    if (this.cache.has(`item/${id}`)) return this.cache.get(`item/${id}`);
    const snapshot = await this.api.child(`/item/${id}`).once("value");
    const value = snapshot.val();
    this.cache.set(`item/${id}`, value);
    return value;
  }

  async getComments(ids) {
    if (!ids) {
      return [];
    }

    const comments = await Promise.all(
      ids.map(async id => await this.findItem(id))
    );
    return await Promise.all(
      comments.map(async comment => {
        comment.comments = await this.getComments(comment.kids);
        return comment;
      })
    );
  }

  async findUser(id) {
    if (this.cache.has(`/user/${id}`)) return this.cache.get(`/user/${id}`);
    const snapshot = await this.api.child(`/user/${id}`).once("value");
    const value = snapshot.val();
    this.cache.set(`/user/${id}`, value);
    return value;
  }
}

const hackerNewsApi = new HackerNewsApi();

export default hackerNewsApi;
