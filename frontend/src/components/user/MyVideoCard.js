import React from 'react';
import HoverVideoPlayer from 'react-hover-video-player';
import { getCookie } from '../../utils/cookie';
import VideoStore from '../../store/VideoStore';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

function MyVideoCard({ video }) {
	const name = getCookie('name');

	const handleLike = (type) => {
		if (video.userName === name) {
			return alert('마이페이지');
		} else if (name === null) {
			return alert('로그인이 필요한 기능입니다.');
		} else {
			VideoStore.setVideo(video, "like", type, 0);
		}
	};


	return (
		<div>
			<div
				className='id'
			>
				<Chip
					avatar={
						<Avatar
							alt={video.name}
							src={`https://bucket-for-persona.s3.ap-northeast-2.amazonaws.com/profileImage/${video.userId}.jpeg`}
						/>
					}
					label={video.userName}
					variant='outlined'
				/>
				

			</div>

			{localStorage.getItem("likeList")?.split(",").includes(String(video.id)) ? (
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
						content: video.likeCount,
					}}
					onClick={(e) => handleLike('remove')}
				/>
			) : (
				<Button
					id='btn'
					size='mini'
					color='red'
					content='Like'
					icon='heart outline'
					margin-left='10px'
					label={{
						basic: true,
						color: 'red',
						pointing: 'left',
						content: video.likeCount,
					}}
					onClick={(e) => handleLike('like')}
				/>
			)}

			<HoverVideoPlayer
				onClick={(e) => {
					VideoStore.setVideo(video);
					VideoStore.setModal(true);
					console.log(VideoStore.open)
				}}
				style={{
					// Make the image expand to cover the video's dimensions
					width: '250px',
					height: '300px',
					objectFit: 'cover',
				}}
				videoSrc={video.videoUrl}
				restartOnPaused // The video should restart when it is paused
				muted={false}
				pausedOverlay={
					<div id='image'>
						<img
							src={video.imageUrl}
							alt={video.title}
							style={{
								// Make the image expand to cover the video's dimensions
								width: '250px',
								height: '300px',
								objectFit: 'cover',
							}}
						/>
					</div>
				}></HoverVideoPlayer>
			<div className='title'>

			</div>
			<div className='title'>
				{video.category === '자기소개' && (
					<Button size='tiny' color='yellow'>
						{video.category}
					</Button>
				)}
				{video.category === '자유연기' && (
					<Button size='tiny' color='orange'>
						{video.category}
					</Button>
				)}
				{video.category === '감정연기' && (
					<Button size='tiny' color='teal'>
						{video.category}
					</Button>
				)}
				{video.category === '독백' && (
					<Button size='tiny' color='blue'>
						{video.category}
					</Button>
				)}
				{video.category === '모사' && (
					<Button size='tiny' color='brown'>
						{video.category}
					</Button>
				)}
				{video.category === '특기' && (
					<Button size='tiny' color='pink'>
						{video.category}
					</Button>
				)}
				{video.category === '기타' && (
					<Button size='tiny' color='grey'>
						{video.category}
					</Button>
				)}
				<Button size='tiny' color='olive'>
					{video.share}
				</Button>
			</div>
			<div className='name'>
				<p>{video.title}</p>
			</div>
		</div>
	);
}

export default observer(MyVideoCard);
