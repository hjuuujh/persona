import {makeAutoObservable, runInAction} from "mobx";
import UserApi from "../api/UserApi";

class UserStore{
  user = [];
  intro = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }    

  async getUser(category, id) {
    try {
      const results = await UserApi.getUser(category, id);
      console.log("user", results);
      // console.log(JSON.parse(results.data));
      runInAction(() => (this.user = results.data));
      // this.videos = results.data;
      // return results.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getUserIntro(category, id) {
    try {
      const results = await UserApi.getUserIntro(category, id);
      console.log("intro", results);
      // console.log(JSON.parse(results.data));
      runInAction(() => (this.intro = results.data));
      // this.videos = results.data;
      // return results.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async isFollowed(followeeId) {
    try {
      const results = await UserApi.isFollowed(followeeId);
      return results.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async setFollower(data) {
    try {
      const result = await UserApi.setFollower(data);
      console.log(result);
      // return results.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async setUnFollower(data) {
    try {
      const result = await UserApi.setUnFollower(data);
      console.log(result);
      // return results.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }


}
export default new UserStore();
