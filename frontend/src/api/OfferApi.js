import axios from 'axios';
import { getCookie } from '../utils/cookie';

class OfferApi{
  URL = 'https://api.ratee.net/offer';
  ACCESS_TOKEN = getCookie("ACCESS_TOKEN");
  
  createOffer(data){
    return axios.post(this.URL+`/create`,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }

  getOffer(page){
    return axios.get(this.URL+`/offer?page=`+page+'&sort=id,DESC',{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
      .then((res) => res.data)
  }

  getOffered(page){
    return axios.get(this.URL+`/offered?page=`+page+'&sort=id,DESC',{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
      .then((res) => res.data)
  }

  replyOffer(data){
    return axios.patch(this.URL+`/patch`,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
    .then((res) => res.data)
  }

  updateOffer(data){
    return axios.post(this.URL+`/update`,data,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
    .then((res) => res.data)
  }

  deleteOffer(id){
    return axios.delete(this.URL+`/delete?id=`+id,{headers:{Authorization:`Bearer ${this.ACCESS_TOKEN}`}})
  }
}
export default new OfferApi();