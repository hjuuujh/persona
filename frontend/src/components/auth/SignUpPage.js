import React, { useState } from 'react';
import AuthStore from '../../store/AuthStore';
import VideoStore from '../../store/VideoStore';
import { observer } from 'mobx-react';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router';
import AWS from "aws-sdk";
import dbTags from "../../utils/videoRecommendedTags";
import { Button } from 'semantic-ui-react';
import Form from 'react-bootstrap/Form';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [profilePic, setProfilePic] = useState('');
  const [profilePicName, setProfilePicName] = useState('');
  const [profilePicSize, setProfilePicSize] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [introVideo, setIntroVideo] = useState('');
  const [introVideoName, setIntroVideoName] = useState('');
  const [introVideoPreview, setIntroVideoPreview] = useState('');
  const [introImage, setIntroImage] = useState('');
  const [introImageName, setIntroImageName] = useState('');
  const [introImagePreview, setIntroImagePreview] = useState('');
  const navigate = useNavigate();
  const [introVideoSize, setIntroVideoSize] = useState();
  const [introImageSize, setIntroImageSize] = useState();
  const [introVideoDuration, setIntroVideoDuration] = useState();
  const [selectedTags, setTags] = useState([]);
  const [company, setCompany] = useState();
  const [location, setLocation] = useState();
  const [open, setOpen] = useState('비공개');


  const handleDeleteTag = (tag) => {
    setTags(selectedTags.filter((item) => item !== tag));
    console.log(selectedTags);
  };

  const onProfilePicDrop = (file) => {
    setProfilePic(file[0]);
    setProfilePicPreview(URL.createObjectURL(file[0]));
    setProfilePicName(file[0].name);
    setProfilePicSize(file[0].size);
  }

  const onIntroVideoDrop = (file) => {
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
    setIntroImage(file[0]);
    setIntroImagePreview(URL.createObjectURL(file[0]));
    setIntroImageName(file[0].name);
    setIntroImageSize(file[0].size);
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
    if (selectedTags.length > 3) {
      return alert("tags must be less than 4");
    }
    else {
      setTags([...selectedTags, tag]);
    }
    console.log(JSON.stringify(selectedTags));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name);
    if (!name || !profilePic) {
      return alert('fill all the fields(Name, profilePic, Tags) first!')
    }

    if (profilePicName.split(".")[1] === "jpg" || profilePicName.split(".")[1] === "jpeg") {

    } else {
      return alert('jpg or jpeg 파일만 가능합니다.')
    }

    AWS.config.update({
      region: "ap-northeast-2",
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    if (nameTest()) {
      if (password !== confirmPassword)
        return alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
      else {
        const userData = {
          email: email,
          name: name,
          password: password,
          company: company,
          location: location,
          info: info,
          tags: selectedTags.join(","),
          open: open
        }

        AuthStore.signUpUser(userData).then((result) => {
          if (result.error === "Email already exists")
            return alert(result.error);
          else if (result.error === "Name already exists")
            return alert(result.error);
          else {
            const data = {
              tags: selectedTags.join(","),
              userId: result.id,
              userName: name,
              title: "intro",
              category: "자기소개",
              share: "public",
              videoSize: introVideoSize,
              duration: introVideoDuration,
              imageSize: introImageSize
            };
            console.log(data);

            VideoStore.uploadVideo(data).then((re) => {
              console.log('*', re);
              if (re) {
                const videoUpload = new AWS.S3.ManagedUpload({
                  params: {
                    Bucket: 'bucket-for-persona',
                    Key: result.id + '/videos/' + re.id + '.mp4',
                    Body: introVideo,
                    ACL: 'public-read',
                    ContentType: 'video/mp4',
                  },
                });

                const imageUpload = new AWS.S3.ManagedUpload({
                  params: {
                    Bucket: 'bucket-for-persona',
                    Key: result.id + '/images/' + re.id + '.jpeg',
                    Body: introImage,
                    ACL: 'public-read',
                    ContentType: 'image/jpeg',
                  },
                });
                const profilePicUpload = new AWS.S3.ManagedUpload({
                  params: {
                    Bucket: 'raw-profile-image',
                    Key: result.id + ".jpeg",
                    Body: profilePic,
                    ACL: "public-read",
                    ContentType: 'image/jpeg'
                  }
                });
                videoUpload.promise();
                imageUpload.promise();
                profilePicUpload.promise().then((re) => {
                  console.log(re);
                });
                navigate('/login');
              }
            });



          }
        })
      }
    }
  }

  return (
    <section id='upload'>
      <Box paddingY={2} style={{ backgroundColor: "white", marginLeft: 2 + "%", marginRight: 2 + "%" }}>
        <Box paddingY={4} >
          <Typography align="center" variant="h4" gutterBottom fontWeight={700}>
            Insert your information
          </Typography>
        </Box>
        <Box paddingY={2}>
          <Divider />
        </Box>
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={1}>
          <Grid item xs={12} >
              <Typography
                variant={'subtitle2'}
                sx={{ marginBottom: 2 }}
                fontWeight={700}
                align="center"
              >
                Profile Image
              </Typography>
              </Grid>
            <Grid item xs={12} sm={6} >
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>
                <Dropzone
                  onDrop={onProfilePicDrop}
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
              <Box align="center">
                {profilePic && <img style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={profilePicPreview} alt={profilePicName} />}
              </Box>
            </Grid>
            <br />
            <Grid item xs={12} >
              <Typography
                variant={'subtitle2'}
                sx={{ marginBottom: 2 }}
                fontWeight={700}
                align="center"
              >
                Intro Video
              </Typography>
              </Grid>
            <Grid item xs={12} sm={6}>
              
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

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

              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>
                {introVideo && <video style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={introVideoPreview} controls width="350px" />}
              </Box>
            </Grid>
            <Grid item xs={12} >
              <Typography
                variant={'subtitle2'}
                sx={{ marginBottom: 2 }}
                fontWeight={700}
                align="center"
              >
                Intro Thumbnail
              </Typography>
              </Grid>
            <Grid item xs={12} sm={6}>
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

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
              <Box align="center" style={{ marginLeft: 2 + "%", marginRight: 2 + "%" }}>

                {introImage && <img style={{
                  width: '450px', height: '600px', border: '1px solid lightgray',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} src={introImagePreview} alt={introImageName} />}
              </Box>
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
              <Box style={{ marginRight: 2 + "%" }}>
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

            <Grid item xs={12} sm={6}>
              <Box style={{ marginLeft: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter your Password
                </Typography>
                <TextField
                  label="Password *"
                  variant="outlined"
                  type={'password'}
                  name={'password'}
                  fullWidth
                  value={password}
                  onChange={(e) => { setPassword(e.target.value) }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box style={{ marginRight: 2 + "%" }}>

                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Confirm your Password
                </Typography>
                <TextField
                  label="Password *"
                  variant="outlined"
                  type={'password'}

                  name={'confirmPassword'}
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value) }}
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
              <Box style={{ marginLeft: 2 + "%" }}>

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
              <Box style={{ marginRight: 2 + "%" }}>

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

// export default observer(SignUpPage);