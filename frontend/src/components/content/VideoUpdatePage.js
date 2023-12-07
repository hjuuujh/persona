import React, { useState, useEffect } from 'react';
import dbTags from '../../utils/videoRecommendedTags';
import Typography from '@mui/material/Typography';
import { Button } from 'semantic-ui-react';
import AWS from 'aws-sdk';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import Form from 'react-bootstrap/Form';
import VideoStore from '../../store/VideoStore';
import { getCookie } from '../../utils/cookie';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

function VideoUpdatePage() {
  const currentVideo = VideoStore.video;
  const name = getCookie('name');
  const id = getCookie('id');
  const title = currentVideo.title;
  const [newTitle, setNewTitle] = useState(currentVideo.title);
  const videoUrl = currentVideo.videoUrl;
  const imageUrl = currentVideo.imageUrl;
  const [Video, setVideo] = useState();
  const [VideoPreview, setVideoPreview] = useState();
  const [VideoChange, setVideoChange] = useState(false);
  const [Image, setImage] = useState();
  const [ImagePreview, setImagePreview] = useState();
  const [ImageChange, setImageChange] = useState(false);
  const [VideoName, setVideoName] = useState('current video');
  const [ImageName, setImageName] = useState('current tumbnail');
  const [VideoSize, setVideoSize] = useState(currentVideo.videoSize);
  const [ImageSize, setImageSize] = useState(currentVideo.imageSize);
  const [VideoDuration, setVideoDuration] = useState(currentVideo.duration);
  const [category, setCategory] = useState(currentVideo.category);
  const [share, setShare] = useState(currentVideo.share);
  const [selectedTags, setTags] = useState(currentVideo.tags.split(","));


  useEffect(() => {
    console.log(VideoStore.video);
  }, []);

  const titleTest = () => {
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;

    var blank_pattern = /[\s]/g;
    if (special_pattern.test(newTitle) === true) {
      return alert('특수문자가 입력되었습니다.');
    } else if (blank_pattern.test(newTitle) === true) {
      return alert('공백이 입력되었습니다.');
    } else {
      return true;
    }
  };

  const handleDeleteTag = (tag) => {
    setTags(selectedTags.filter((item) => item !== tag));
  }

  const onSubmit = async (e) => {

    const region = 'ap-northeast-2';

    AWS.config.update({
      region: region,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    if (VideoName.split('.')[1] !== 'mp4' && VideoChange === true) {
      return alert('mp4 파일만 가능합니다.');
    }

    if (
      ImageName.split('.')[1] !== 'jpg' &&
      ImageName.split('.')[1] !== 'jpeg' && ImageChange === true
    ) {
      return alert('jpg or jpeg 파일만 가능합니다.');
    }

    if (!newTitle) {
      return alert('fill all the fields first!');
    }

    if (!titleTest()) {

    } else if (VideoSize > 10000000) {
      // 얼마나 남았는지 보여주고 넘기면 업로드안되게
      return alert('동영상 사이즈가 10MB이상입니다');
    } else if (VideoDuration > 60) {
      return alert('동영상 길이가 1분 이상입니다');
    } else if (ImageSize > 1000000) {
      // 얼마나 남았는지 보여주고 넘기면 업로드안되게
      return alert('이미지 사이즈가 1MB이상입니다');
    } else {
      // tommorow : can have same title, change title to video id
      const data = {
        id: currentVideo.id,
        userId: id,
        userName: name,
        tags: selectedTags.join(","),
        title: newTitle,
        category: category,
        share: share,
        videoSize: VideoSize,
        duration: VideoDuration,
        imageSize: ImageSize
      };

      if (title === newTitle) {
        VideoStore.updateVideo(data, false).then((result) => {
          console.log('*', result);
        });
      } else {
        VideoStore.updateVideo(data, true).then((result) => {
          console.log('*', result);
          if (result.error === 'Title already exist') {
            return alert('동일한 Title이 존재합니다.');
          } else if (result.error === 'No more videos') {
            return alert('Video는 5개까지 업로드가능합니다');
          }
        });
      }

      if (VideoChange) {
        const videoUpload = new AWS.S3.ManagedUpload({
          params: {
            Bucket: 'bucket-for-persona',
            Key: id + '/videos/' + currentVideo.id + '.mp4',
            Body: Video,
            ACL: 'public-read',
            ContentType: 'video/mp4',
          },
        });
        videoUpload.promise().then((re) => {
          console.log(re);
        });
      }

      if (ImageChange) {
        const imageUpload = new AWS.S3.ManagedUpload({
          params: {
            Bucket: 'bucket-for-persona',
            Key: id + '/images/' + currentVideo.id + '.jpeg',
            Body: Image,
            ACL: 'public-read',
            ContentType: 'image/jpeg',
          },
        });
        imageUpload.promise().then((re) => {
          console.log(re);

        });
      }


    }
  };

  const handleButton = (tag) => {
    if (selectedTags.length > 4) {
      return alert("tags must be less than 5");
    }
    else {
      setTags([...selectedTags, tag]);
    }
  };

  const onVideoDrop = (file) => {
    setVideoChange(true);
    setVideo(file[0]);
    setVideoName(file[0].name);
    setVideoSize(file[0].size);

    Object.assign(file[0], {
      preview: URL.createObjectURL(file[0]),
    });

    const video = document.createElement('video');
    video.src = file[0].preview;
    setVideoPreview(video.src);
    video.addEventListener('loadedmetadata', () => {
      setVideoDuration(video.duration);
    });
    //  1903312 == 1.9mb
  };

  const onImageDrop = (file) => {
    setImageChange(true);
    setImage(file[0]);
    setImagePreview(URL.createObjectURL(file[0]));
    setImageName(file[0].name);
    setImageSize(file[0].size);
  };


  return (
    <section id='upload'>
      <Box paddingY={2} style={{ backgroundColor: "white", marginLeft: 2 + "%", marginRight: 2 + "%" }}>
        <Box paddingY={4} >

          <Typography align="center" variant="h4" gutterBottom fontWeight={700}>
            Update Video
          </Typography>
        </Box>

        <Box paddingY={2}>
          <Divider />
        </Box>
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography
                variant={'subtitle2'}
                sx={{ marginBottom: 2 }}
                fontWeight={700}
                align="center"
              >
                Update Video
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>

              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                <Dropzone onDrop={onVideoDrop} multiple={false} maxSize={55000000}>
                  {({
                    getRootProps,
                    getInputProps
                  }) => (
                    <div
                      style={{
                        width: '459px',
                        height: '600px',
                        border: '1px solid lightgray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      {...getRootProps()}>
                      <input {...getInputProps()} />

                      <PlusOutlined tyle={{ fontSize: '3rem' }} />
                    </div>
                  )}
                </Dropzone>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                {VideoChange ? <video style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={VideoPreview} controls width="350px" />
                  : <video style={{
                    width: '450px', height: '600px', border: '1px solid lightgray',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }} src={videoUrl} controls width="350px" />}
              </Box>
            </Grid>
            <br />
            <Grid item xs={4} >
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>
                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >VideoName <br />
                  {VideoName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} >
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >VideoSize <br />
                  {VideoSize}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} >
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >VideoDuration <br />
                  {VideoDuration}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                  align='right'

                >
                  Upload ThumbNail
                </Typography>
                <Dropzone
                  onDrop={onImageDrop}
                  multiple={false}
                  maxSize={800000000}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div style={{
                      width: '450px', height: '600px', border: '1px solid lightgray',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <PlusOutlined tyle={{ fontSize: '3rem' }} />
                    </div>
                  )}
                </Dropzone>
              </Box>

            </Grid>
            <Grid item xs={12} sm={6}>
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                {ImageChange ? <img style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={ImagePreview} alt={ImageName} />
                  : <img style={{
                    width: '450px', height: '600px', border: '1px solid lightgray',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }} src={imageUrl} alt={ImageName} />}
              </Box>
            </Grid>

            <Grid item xs={6} sm={6}>
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >ImageName <br />
                  {ImageName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >ImageSize <br />
                  {ImageSize}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box style={{ marginLeft: 1 + "%", marginRight: 1 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter video title
                </Typography>
                <TextField
                  label="title *"
                  variant="outlined"
                  name={'newTitle'}
                  fullWidth
                  value={newTitle}
                  onChange={(e) => { setNewTitle(e.target.value) }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter video category
                </Typography>
                <Form.Select
                  className='category'
                  aria-label='Default select example'
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}>
                  <option value='자유연기'>자유연기</option>
                  <option value='감정연기'>감정연기</option>
                  <option value='독백'>독백</option>
                  <option value='모사'>모사</option>
                  <option value='특기'>특기</option>
                  <option value='기타'>기타</option>
                </Form.Select>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter video Open
                </Typography>
                <Form.Select
                  className='category'
                  aria-label='Default select example'
                  onChange={(e) => {
                    setShare(e.target.value);
                  }}>
                  <option value='public'>public</option>
                  <option value='follower'>follower</option>
                  <option value='private'>private</option>
                </Form.Select>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box style={{ marginLeft: 1 + "%", marginRight: 1 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Tags
                </Typography>
                <div className='tags'>
                  <ul>
                    {dbTags.map((tags, idx) => (
                      <li key={idx}>
                        {tags.map((tag, i) => (
                          <Button.Group key={i} size='large'>
                            {selectedTags.includes(tag) ? (
                              <Button
                                inverted
                                color='red'
                                type="button"
                                onClick={() => { handleDeleteTag(tag); }}>
                                {tag}
                              </Button>
                            ) : (
                              <Button
                                color='black'
                                type="button"
                                onClick={() => { handleButton(tag) }}>
                                {tag}
                              </Button>
                            )}
                          </Button.Group>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </Box>
            </Grid>

          </Grid>

        </form>
        <Box style={{ marginLeft: 1 + "%", marginRight: 1 + "%" }}>
          <Button size={'large'} variant={'contained'} color={'blue'} type={'submit'} onClick={() => onSubmit()}> Submit </Button>
        </Box>
      </Box >
    </section>
  )
}

export default VideoUpdatePage