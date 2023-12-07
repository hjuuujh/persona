import React, { useState } from 'react';
import AuthStore from '../../store/AuthStore';
import VideoStore from '../../store/VideoStore';
import { observer } from 'mobx-react';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import AWS from "aws-sdk";
import dbTags from "../../utils/videoRecommendedTags";
import { Button } from 'semantic-ui-react';
import UserStore from '../../store/UserStore';
import Form from 'react-bootstrap/Form';
import { setCookie } from '../../utils/cookie';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function UserUpdatePage() {
  const id = UserStore.user.id;
  const [email, setEmail] = useState(UserStore.user.email);
  // const [password, setPassword] = useState(UserStore.user.password);
  const [name, setName] = useState(UserStore.user.name);
  const [newName, setNewName] = useState(UserStore.user.name);
  const [info, setInfo] = useState(UserStore.user.info);
  const [profilePic, setProfilePic] = useState(UserStore.user.profileImgUrl);
  const [profilePicName, setProfilePicName] = useState('profile picture');
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [introVideo, setIntroVideo] = useState(UserStore.intro.videoUrl);
  const [introVideoSize, setIntroVideoSize] = useState(UserStore.intro.videoSize);
  const [introVideoDuration, setIntroVideoDuration] = useState(UserStore.intro.duration);
  const [introVideoName, setIntroVideoName] = useState('intro video');
  const [introVideoPreview, setIntroVideoPreview] = useState('');
  const [introImage, setIntroImage] = useState(UserStore.intro.imageUrl);
  const [introImageSize, setIntroImageSize] = useState(UserStore.intro.imageSize);
  const [introImageName, setIntroImageName] = useState('');
  const [introImagePreview, setIntroImagePreview] = useState('');

  const [selectedTags, setTags] = useState(UserStore.user.tags.split(","));
  const [VideoChange, setVideoChange] = useState(false);
  const [ImageChange, setImageChange] = useState(false);
  const [ProfileChange, setProfileChange] = useState(false);
  const [open, setOpen] = useState(UserStore.user.open);
  const [company, setCompany] = useState(UserStore.user.company);
  const [location, setLocation] = useState(UserStore.user.location);


  const handleDeleteTag = (tag) => {
    setTags(selectedTags.filter((item) => item !== tag));
  };

  const onProfilePicDrop = (file) => {
    setProfileChange(true);
    setProfilePic(file[0]);
    setProfilePicPreview(URL.createObjectURL(file[0]));

    setProfilePicName(file[0].name);

  }

  const onIntroVideoDrop = (file) => {
    setVideoChange(true);
    setIntroVideo(file[0]);
    setIntroVideoName(file[0].name);
    setIntroVideoSize(file[0].size);
    Object.assign(file[0], {
      preview: URL.createObjectURL(file[0]),
    });

    const video = document.createElement('video');
    video.src = file[0].preview;
    setIntroVideoPreview(video.src);

    video.addEventListener('loadedmetadata', () => {
      setIntroVideoDuration(video.duration)
    });
  }

  const onIntroImageDrop = (file) => {
    setImageChange(true);
    setIntroImage(file[0]);
    setIntroImagePreview(URL.createObjectURL(file[0]));

    setIntroImageName(file[0].name);
    setIntroImageSize(file[0].size)
  }

  const nameTest = () => {
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    var blank_pattern = /[\s]/g;
    if (special_pattern.test(name) === true) {
      return alert('특수문자가 입력되었습니다.');
    } else if (blank_pattern.test(name) === true) {
      return alert('공백이 입력되었습니다.');
    } else {
      return true;
    }
  }

  const handleButton = (tag) => {
    if (selectedTags.length > 4) {
      return alert("tags must be less than 5");
    }
    else {
      setTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    if (introVideoName.split('.')[1] !== 'mp4' && VideoChange === true) {
      return alert('mp4 파일만 가능합니다.');
    }

    if (
      introImageName.split('.')[1] !== 'jpg' &&
      introImageName.split('.')[1] !== 'jpeg' && ImageChange === true
    ) {
      return alert('jpg or jpeg 파일만 가능합니다.');
    }

    AWS.config.update({
      region: "ap-northeast-2",
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    if (nameTest()) {

      const userData = {
        id: id,
        name: newName,
        info: info,
        tags: selectedTags.join(","),
        open: open
      }

      if (name === newName) {
        AuthStore.update(userData, false).then((result) => {
          setCookie("name", newName);
        });
      } else {
        AuthStore.update(userData, true).then((result) => {
          if (result.error === "Name already exists")
            return alert("Name already exists");
          setCookie("name", newName);
        });
      }
      if (ProfileChange) {
        const profilePicUpload = new AWS.S3.ManagedUpload({
          params: {
            Bucket: 'raw-profile-image',
            Key: id + ".jpeg",
            Body: profilePic,
            ACL: "public-read",
            ContentType: 'image/jpeg'
          }
        });

        profilePicUpload.promise();
      }

      const videoData = {
        id: UserStore.intro.id,
        userId: id,
        userName: name,
        videoSize: introVideoSize,
        imageSize: introImageSize,
        duration: introVideoDuration,
        tags: selectedTags.join(","),
        imageUrl: "https://bucket-for-persona.s3.ap-northeast-2.amazonaws.com/" + id + "/images/" + UserStore.intro.id + ".jpeg",
        videoUrl: "https://bucket-for-persona.s3.ap-northeast-2.amazonaws.com/" + id + "/videos/" + UserStore.intro.id + ".mp4"
      }
      console.log(videoData);
      VideoStore.updateIntroVideo(videoData).then(() => {
        if (VideoChange) {
          const introVideoUpload = new AWS.S3.ManagedUpload({
            params: {
              Bucket: 'bucket-for-persona',
              Key: id + "/videos/" + UserStore.intro.id + ".mp4",
              Body: introVideo,
              ACL: "public-read",
              ContentType: 'video/mp4'
            }
          });
          introVideoUpload.promise();

        }
        if (ImageChange) {
          const introImageUpload = new AWS.S3.ManagedUpload({
            params: {
              Bucket: 'bucket-for-persona',
              Key: id + "/images/" + UserStore.intro.id + ".jpeg",
              Body: introImage,
              ACL: "public-read",
              ContentType: 'image/jpeg'
            }
          });
          introImageUpload.promise();

        }


      })

    }
  }

  return (
    <section id='upload'>
      <Box paddingY={2} style={{ backgroundColor: "white", marginLeft: 2 + "%", marginRight: 2 + "%" }}>
        <Box paddingY={4} >
          <Typography align="center" variant="h4" gutterBottom fontWeight={700}>
            Update your information
          </Typography>
        </Box>
        <Box paddingY={2}>
          <Divider />
        </Box>
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Box style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

              <Dropzone
                onDrop={onProfilePicDrop}
                multiple={false}
                maxSize={800000000}
              >
                {({ getRootProps, getInputProps }) => (
                  <div style={{
                    width: '400px', height: '400px', border: '1px solid lightgray',
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

              {ProfileChange ? <img style={{
                  width: '400px', height: '400px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={profilePicPreview} alt={profilePicName} /> : <img style={{
                  width: '400px', height: '400px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={profilePic} alt={profilePicName} />}
            </Grid>
            <br />
            <Grid item xs={12} sm={6}>
              <Box style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

              <Dropzone
                onDrop={onIntroVideoDrop}
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

              {VideoChange ? <video style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={introVideoPreview} controls width="450px" /> : <video style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}  src={introVideo} controls width="450px" />}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

              <Dropzone
                onDrop={onIntroImageDrop}
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

              {ImageChange ? <img style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={introImagePreview} alt={introImageName} /> : <img style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={introImage} alt={introImageName} />}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

              <Typography
                variant={'subtitle2'}
                sx={{ marginBottom: 2 }}
                fontWeight={700}
              >
                Enter your email
              </Typography>
              <TextField
                label="Email *"
                variant="outlined"
                name={'email'}
                fullWidth
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
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
                Enter your name
              </Typography>
              <TextField
                label=" name *"
                variant="outlined"
                name={'name'}
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box style={{ marginLeft: 1 + "%", marginRight: 1 + "%" }}>

              <Typography
                variant={'subtitle2'}
                sx={{ marginBottom: 2 }}
                fontWeight={700}
              >
                Info
              </Typography>
              <TextField
                label="Info"
                variant="outlined"
                name={'info'}
                multiline
                rows={5}
                fullWidth
                value={info}
                onChange={(e) => { setInfo(e.target.value) }}
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
                Location
              </Typography>
              <TextField
                label="Location *"
                variant="outlined"
                name={'location'}
                fullWidth
                value={location}
                onChange={(e) => { setLocation(e.target.value) }}
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
                Company
              </Typography>
              <TextField
                label="Company *"
                variant="outlined"
                name={'company'}
                fullWidth
                value={company}
                onChange={(e) => { setCompany(e.target.value) }}
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
                Open
              </Typography>
              <Form.Select
                className='category'
                aria-label='Default select example'
                onChange={(e) => {
                  setOpen(e.target.value);
                }}>
                <option value={'비공개'}>비공개</option>
                <option value={'공개'}>공개</option>
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
          <Button size={'large'} variant={'contained'} color={'blue'} type={'submit'} onClick={handleSubmit}> Submit </Button>
        </Box>
      </Box >
      <br />
    </section>
  )
}

export default observer(UserUpdatePage);