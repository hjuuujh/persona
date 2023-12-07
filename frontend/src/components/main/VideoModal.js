import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import HoverVideoPlayer from 'react-hover-video-player';
import VideoStore from '../../store/VideoStore';
import { observer } from 'mobx-react';

function VideoModal() {

	const handleLike = (type) => {
		console.log(type);

		VideoStore.setVideo(VideoStore.video,"like", type, 0).then(()=>{
			
		});
	}

	return (
		<Modal
			onClose={() => VideoStore.setModal(false)}
			onOpen={() => VideoStore.setModal(true)}
			open={VideoStore.open}>
			<Modal.Header>{VideoStore.video.title}</Modal.Header>
			<div className='content'>
				<div className='vid'>
					<HoverVideoPlayer
						id='vidframe'
						videoSrc={VideoStore.video.videoUrl}
						controls
						restartOnPaused // The video should restart when it is paused
						muted={false}
						style={{ objectFit: 'contain' }}></HoverVideoPlayer>
				</div>
				<div className='description'>
					<Modal.Description>
						{VideoStore.video.tags?.split(",").map((tag, i) => (
							<Button key={i} size='mini' >
							{tag}
						</Button>
						))}
					</Modal.Description>
				</div>
				{localStorage.getItem("likeList")?.includes(VideoStore.video.id) ? (
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
						content: VideoStore.video.likeCount
					}}
					onClick={(e) => handleLike("remove")}
				/> 
				):(
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
						content: VideoStore.video.likeCount
					}}
					onClick={(e) => handleLike("like")}
				/> 
				)}
			</div>

			<Modal.Actions>
				<Button onClick={() => VideoStore.setModal(false)}>Cancel</Button>
				<Button onClick={() => VideoStore.setModal(false)} positive>
					Ok
				</Button>
			</Modal.Actions>
		</Modal>
	);
}

export default observer(VideoModal);
