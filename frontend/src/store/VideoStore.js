import { makeAutoObservable, runInAction} from "mobx";
import VideoApi from "../api/VideoApi";
import {getCookie} from "../utils/cookie";

class VideoStore {
  videos = [];
  myVideos = [];
  likeVideos = [];
  followVideos = [];
  video = [];
  likeList = [];
  flag=false;
  myFlag=false;
  likeFlag=false;
  followFlag=false;
  open = false;
  page=0;
  myPage=0;
  followPage=0;
  likePage=0;
  category="all";
  type="";
  param="";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.video.tags = "";
    this.likeList = [0];
  }

  async uploadVideo(data) {
    try {
      const result = await VideoApi.uploadVideo(data);
      return result;
    }
    catch (err) {
      console.log(err);
    }
  }

  async updateVideo(data, bool) {
    try {
      const result = await VideoApi.updateVideo(data, bool);
      return result;
    }
    catch (err) {
      console.log(err);
    }
  }

  async updateIntroVideo(data) {
    try {
      const result = await VideoApi.updateIntroVideo(data);
      return result;
    }
    catch (err) {
      console.log(err);
    }
  }

  async retrieveMyVideos(category, type, param) {
    try {
      const results = await VideoApi.retrieveVideos(category, type, param, this.myPage);
      if(results==="empty"){
        return("end");
      }else{
        if(this.myFlag){
          runInAction(() => (this.myVideos.push(...results.data)));
        }else{
          runInAction(() => (this.myVideos = results.data));
          runInAction(() => (this.myFlag=true));
        }

      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async retrieveLikeVideos(category, type, param) {
    try {
      const results = await VideoApi.retrieveVideos(category, type, param, this.likePage);
      if(results==="empty"){
        return("end");
      }else{
      if(this.likeFlag){
        runInAction(() => (this.likeVideos.push(...results.data)));
      }else{
        runInAction(() => (this.likeVideos = results.data));
        runInAction(() => (this.likeFlag=true));
      }
    }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async retrieveFollowVideos(category, type, param) {
    try {
      const results = await VideoApi.retrieveVideos(category, type, param, this.followPage);
      if(results==="empty"){
        return("end");
      }else{
      if(this.followFlag){
        runInAction(() => (this.followVideos.push(...results.data)));
      }else{
        runInAction(() => (this.followVideos = results.data));
        runInAction(() => (this.followFlag=true));
      }
    }
    } catch (err) {
      console.log(err);
      return err;
    }
  }


  async retrieveVideos() {
    try {
      const results = await VideoApi.retrieveVideos(this.category, this.type, this.param, this.page);
      if(results==="empty"){
        return("end");
      }else{
        if (this.flag) {
          console.log(results);
        
          runInAction(() => (this.videos.push(...results.data)));
        } else {
          console.log(results);
          
          runInAction(() => (this.videos=results.data));
          runInAction(() => (this.flag=true));
      }
    }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  setModal(open) {
    this.open = open;
    return this.open;
  }

  async setVideo(video, category, type, param) {
    this.video = video;
    const data={
      id:video.id,
      userId:video.userId
    }
    if (category === "hit") {
      try{
        VideoApi.patchVideo(category,type,param,data);
      }catch(error){
        console.log(error);
      }
    } else if (category === "like") {
      await VideoApi.patchVideo(category,type,param,data);
      runInAction(() => (this.likeList = localStorage.getItem("likeList").split(",")));
      if (type === "remove") {
        runInAction(() => (this.likeList = this.likeList.filter((vid) => parseInt(vid) !== video.id)));
        runInAction(() => (video.likeCount = video.likeCount - 1));
        localStorage.setItem("likeList",this.likeList);
      } else if (type === "like") {
        runInAction(() => (this.likeList = [...this.likeList, video.id]));
        runInAction(() => (video.likeCount = video.likeCount + 1));
        localStorage.setItem("likeList",this.likeList);
      }
    }
  }

  async getVideoLikeList(){
    try{
      const result = await VideoApi.getVideoLikeList();
      console.log(result)
      runInAction(() => (localStorage.setItem("likeList", result.data)));
    }catch(err){
      console.log(err);
    }
  }

  async getVideoLike(videoId){
    try{
      const result = await VideoApi.getVideoLike(videoId, getCookie("id"));
      runInAction(() => (this.videos.likeList = result.data.data));

    }catch(err){
      console.log(err);
    }
  }

  async deleteVideoList(id) {
		try {
			await VideoApi.deleteVideo(id);
		} catch (err) {
			console.log(err);
		}
	}

  deleteVideo(id){
		this.myVideos = this.myVideos.filter((video) => video.id !== id);
		return this.myVideos
	}

  setPage(type){
    if(type===0){
      this.myPage=this.myPage+1;
    }else if(type===1){
      this.likePage=this.likePage+1;
    }else if(type===2){
      this.followPage=this.followPage+1;
    }else{
      this.page=this.page+1;
    }
  }

  
  setOptions(category, type, param){
    this.flag=false;
    this.page=0;
    this.category=category;
    this.type=type;
    this.param=param;
  }
}

export default new VideoStore();
