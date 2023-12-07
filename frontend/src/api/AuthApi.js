import axios from 'axios';

class AuthApi {
  URL = 'https://api.ratee.net/auth';
  
  signUp(data){
    return axios.post(this.URL+`/signup`,data)
      .then((res) => res.data)
  }

  logIn(data){
    return axios.put(this.URL+`/login`,data)
    .then((res) => res.data)
  }

  update(data, bool){
    return axios.post(this.URL+`/update?isNameChange=`+bool,data)
    .then((res) => res.data)
  }
  
  
}
export default new AuthApi();