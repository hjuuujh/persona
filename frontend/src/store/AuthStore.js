import {makeAutoObservable} from "mobx";
import AuthApi from "../api/AuthApi";

class AuthStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }       

  async signUpUser(data){
    try{
      const result = await AuthApi.signUp(data);
      return result;
    }
    catch (err){
      console.log(err);
    }
  }

  async logInUser(data){
    try{
      const result = await AuthApi.logIn(data);
      return result;
    }
    catch (err){
      return err;
    }
  }

  async update(data, bool){
    try{
      const result = await AuthApi.update(data, bool);
      return result;
    }
    catch (err){
      return err;
    }
  }
}
export default new AuthStore();