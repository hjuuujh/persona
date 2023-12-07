import React, { useState, useEffect } from 'react'
import HoverVideoPlayer from 'react-hover-video-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { Button } from 'semantic-ui-react';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as bookmark } from '@fortawesome/free-regular-svg-icons';
import { getCookie } from '../../utils/cookie';
import UserStore from '../../store/UserStore';
import VideoStore from '../../store/VideoStore';
import { useNavigate } from 'react-router';

function Intro({ user, video }) {
	// let userId = '';
	const [follow, setFollow] = useState(false);
	const [like, setLike] = useState(false);
	const navigate = useNavigate();
	
	useEffect(() => {
		const userId = user.id;
		const videoId = video.id;

		UserStore.isFollowed(userId).then((re) => {
			setFollow(re);
			if (localStorage.getItem("likeList")?.split(",").includes(String(videoId))) {
				setLike(true);
			}
		});
	}, [user.id, video.id]);

	const handleLike = (type) => {
		console.log(type);

		VideoStore.setVideo(video, "like", type, 0).then(() => {
			if (type === 'like') {
				setLike(true);
			} else {
				setLike(false);
			}
		})

	}

	const handleFollow = () => {
		if (user.id === getCookie("id")) {
			return alert("impossible");
		}
		const data = {
			followerId: getCookie("id"),
			followeeId: user.id,
		}

		UserStore.setFollower(data).then(() => {
			setFollow(true);
		});
	}

	const handleUnFollow = () => {
		const data = {
			followerId: getCookie("id"),
			followeeId: user.id,
		}

		UserStore.setUnFollower(data).then(() => {
			setFollow(false);
		});
	}

	return (
		<section id='intro'>
			<div className='vid'>
				<HoverVideoPlayer
					videoSrc={video.videoUrl}
					restartOnPaused // The video should restart when it is paused
					muted={false}
					pausedOverlay={
						<img
							src={video.imageUrl}
							alt=''
							style={{
								// Make the image expand to cover the video's dimensions
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>
					}
				></HoverVideoPlayer>
				{like ? (
					<Button
						id='btn'
						size='mini'
						color='red'
						content='Like'
						icon='heart'
						label={{
							basic: true,
							color: 'red',
							pointing: 'left',
							content: video.likeCount
						}}
						onClick={(e) => handleLike("remove")}
					/>
				) : (
					<Button
						id='btn'
						size='mini'
						color='red'
						content='Like'
						icon='heart outline'
						label={{
							basic: true,
							color: 'red',
							pointing: 'left',
							content: video.likeCount
						}}
						onClick={(e) => handleLike("like")}
					/>
				)}
			</div>
			<div className='info'>
				<h1>이름</h1> <p>{user.name}</p>
				<h1>키워드</h1>
				{user.tags.split(",").map((tag, i) => (
					<p key={i} >#{tag}</p>
				))}
				<h1>자기소개</h1>
				<p>
					{user.info}
				</p>
		 {user.id === getCookie('id') ?
				<Button className='userUpdate'
					onClick={() => { navigate('/upload') }}>
					Upload
				</Button> :<p></p>}

			</div>
			{user.id === getCookie('id') ?
				<div className='stat'>
					<div className='profile_follow'>
						<div className='profile'>
							<Chip
								avatar={<Avatar alt='Natacha' src={`https://bucket-for-persona.s3.ap-northeast-2.amazonaws.com/profileImage/${user.id}.jpeg`} />}
								label={user.name}
							/>
						</div>
						{follow ?
							(<div className='follow'>
								<h1>
									<FontAwesomeIcon icon={faBookmark} onClick={() => handleUnFollow()} />
								</h1>
							</div>) :
							(<div className='follow'>
								<h1>
									<FontAwesomeIcon icon={bookmark} onClick={() => handleFollow()} />
								</h1>
							</div>)
						}
						<h1>
							Email: <p>{user.email}</p>
						</h1>
						<br />
						<h1>
							Company: <p>{user.company}</p>
						</h1>
						<br />
						<h1>
							Location: <p>{user.location}</p>
						</h1>

						<Button className='userUpdate'
							onClick={() => { UserStore.setUser(user); navigate('/user/update/?uid=' + user.id) }}>
							정보 수정
						</Button>
					</div>
				</div> :
				<div className='stat'>
					<div className='profile_follow'>
						<div className='profile'>
							<Chip
								avatar={<Avatar alt='Natacha' src={`https://bucket-for-persona.s3.ap-northeast-2.amazonaws.com/profileImage/${user.id}.jpeg`} />}
								label={user.name}
							/>
						</div>
						{follow ?
							(<div className='follow'>
								<h1>
									<FontAwesomeIcon icon={faBookmark} onClick={() => handleUnFollow()} />
								</h1>
							</div>) :
							(<div className='follow'>
								<h1>
									<FontAwesomeIcon icon={bookmark} onClick={() => handleFollow()} />
								</h1>
							</div>)
						}
						{user.open === '공개' ?
							<>
								<h1>
									Email: <p>{user.email}</p>
								</h1>
								<br />
								<h1>
									Company: <p>{user.company}</p>
								</h1>
								<br />

								<h1>
									Location: <p>{user.location}</p>
								</h1>
							</> :
							<>
								<h1>
									비공개
								</h1><br /></>}
					</div>
				</div>
			}
		</section>
	)
}

export default Intro
