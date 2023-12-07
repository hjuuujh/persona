import axios from 'axios';
import { getCookie } from '../utils/cookie';

class UserApi{
  URL = 'https://api.ratee.net/user';
  ACCESS_TOKEN = getCookie("ACCESS_TOKEN");
  
  getUser(category, id){
    return axios.get(this.URL+`/?category=`+category+`&userId=`+id,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }

  getUserIntro(category,id){
    return axios.get(this.URL+`/intro/?category=`+category+`&userId=`+id,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }
  
  isFollowed(followeeId){
    return axios.get(this.URL+`/isfollow/?followeeId=`+followeeId,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }

  setFollower(data){
    return axios.post(this.URL+`/follow`,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }

  setUnFollower(data){
    return axios.patch(this.URL+`/unfollow`,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }
  
}
export default new UserApi();