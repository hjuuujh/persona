import axios from "axios";
// import { Cookies, useCookies } from 'react-cookie';
import {  getCookie } from '../utils/cookie';

class VideoApi{
  URL = 'https://api.ratee.net/video';
  ACCESS_TOKEN = getCookie("ACCESS_TOKEN");

  uploadVideo(data){
    return axios.post(this.URL+`/create`,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
      .then((res) => res.data)
  }

  updateVideo(data, bool){
    return axios.post(this.URL+`/update?isTitleChange=`+bool,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
      .then((res) => res.data)
  }

  updateIntroVideo(data){
    return axios.post(this.URL+`/update/intro`,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
      .then((res) => res.data)
  }

  retrieveVideos(category, type, param, page){
    return axios.get(this.URL+`/list?category=`+category+`&type=`+type+`&param=`+param+`&page=`+page+'&sort=id,DESC',{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
      .then((res) => res.data)
  }

  patchVideo(category,type,param,data){
    return axios.patch(this.URL+`/patch?category=`+category+`&type=`+type+`&param=`+param,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
      .then((res) => res.data)
  }

  getVideoLikeList(){
    return axios.get(`/like`,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }

  getVideoLike(videoId, userId){
    return axios.get(`/like?videoId=`+videoId+`&userId=`+userId,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }

  deleteVideo(id){
    return axios.delete(this.URL+`/delete?id=`+id,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }
}
export default new VideoApi();
