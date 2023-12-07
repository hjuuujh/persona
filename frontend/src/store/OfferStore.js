import { makeAutoObservable, runInAction } from "mobx";
import OfferApi from "../api/OfferApi";

class OfferStore {
  open = false;
  replyOpen = false;
  video = [];
  offer = [];
  offerList = [];
  offeredList = [];
  offerFlag = false;
  offeredFlag = false;
  offerPage = 0;
  offeredPage = 0;
  menu = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

  }

  async createOffer(data) {
    try {
      const result = await OfferApi.createOffer(data);
      console.log(result);
      return result.data;
    }
    catch (err) {
      console.log(err);
    }
  }

  async getOffer() {
    try {
      const results = await OfferApi.getOffer(this.offerPage);
      if (results === "empty") {
        return ("end");
      } else {
        if (this.offerFlag) {
          runInAction(() => (this.offerList.push(...results.data)));
        } else {
          runInAction(() => (this.offerList = results.data));
          runInAction(() => (this.offerFlag = true));
        }
      }
      console.log("offer", this.offerList);
      // return result;
    }
    catch (err) {
      console.log(err);
    }
  }

  async getOffered() {
    try {
      const results = await OfferApi.getOffered(this.offeredPage);
      if (results === "empty") {
        return ("end");
      } else {
        if (this.offeredFlag) {
          runInAction(() => (this.offeredList.push(...results.data)));
        } else {
          runInAction(() => (this.offeredList = results.data));
          runInAction(() => (this.offeredFlag = true));
        }
      }
      console.log("offered", this.offeredList);
      // return result;
    }
    catch (err) {
      console.log(err);
    }
  }

  async replyOffer(data) {
    try {
      const result = await OfferApi.replyOffer(data);
      return result;
    }
    catch (err) {
      console.log(err);
    }
  }

  async updateOffer(data) {
    try {
      const result = await OfferApi.updateOffer(data);
      return result;
    }
    catch (err) {
      console.log(err);
    }
  }

  async deleteOffer(id, type) {
    try {
      await OfferApi.deleteOffer(id);
      if (type === "offer") {
        this.offerList = this.offerList.filter((offer) => offer.id !== id);
      } else {
        this.offeredList = this.offeredList.filter((offer) => offer.id !== id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  setVideo(video) {
    this.video = video;
  }

  setOffer(offer) {
    this.offer = offer;
    console.log(this.offer);
  }

  setModal(open) {
    this.open = open;
    return this.open;
  }

  setReplyModal(replyOpen) {
    this.replyOpen = replyOpen;
    return this.replyOpen;
  }

  setMenu(menu) {
    this.menu = menu;
  }

  setPage(type) {
    if (type === 3) {
      this.offerPage = this.offerPage + 1;
    } else {
      this.offeredPage = this.offeredPage + 1;
    }
  }
}
export default new OfferStore();