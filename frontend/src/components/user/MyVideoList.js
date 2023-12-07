import React, { useEffect, useState } from 'react'
import VideoStore from '../../store/VideoStore';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import MyVideoCard from './MyVideoCard';
import VideoModal from '../main/VideoModal';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';

function MyVideoList({ videos, my }) {
	const [videoList, setVideoList] = useState(videos);
	const navigate = useNavigate();

	useEffect(() => {
	}, []);

	const handleDelete = (id, name, title) => {
		if (window.confirm('삭제하시겠습니까?') === true) {
			// https://velog.io/@devjade/2%EC%A3%BC-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%8B%A4%EC%9D%B4%EC%96%B4%EB%A6%AC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%ED%8C%8C%EC%9D%BC-%EC%97%85%EB%A1%9C%EB%93%9C%ED%95%98%EA%B3%A0-preview-%EB%9D%84%EC%9A%B0%EA%B8%B0-feat.-AWS-S3


			VideoStore.deleteVideoList(id).then(() => {
				setVideoList(VideoStore.deleteVideo(id));
				AWS.config.update({
					region: 'ap-northeast-2',
					accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
				});

				let s3 = new AWS.S3();

				const deleteImage = {
					Bucket: 'bucket-for-persona',
					Key: name + '/images/' + title + '.jpeg'
				}

				const deleteVideo = {
					Bucket: 'bucket-for-persona',
					Key: name + '/videos/' + title + '.mp4'
				}

				s3.deleteObject(deleteImage, function (err, data) {
					if (err) console.log(err, err.stack);
					else console.log(data);
				});

				s3.deleteObject(deleteVideo, function (err, data) {
					if (err) console.log(err, err.stack);
					else console.log(data);
				});
			});
		} else {
			console.log('취소');
		}
	};


	return (
		<>
			<section id='actors'>
				<div className='search'>
				</div>
				{videoList && videoList.map((video, idx) => (
					<div className='vid' key={idx}>
						<MyVideoCard video={video} key={idx} />
						<div className='box'>

							<div className='tag'>
								{video.tags.split(",").map((tag, i) => (
									<Button key={i} size='mini' >
										{tag}
									</Button>
								))
								}
							</div>
							<div className='btn'>
								{my && <Button
									color='black'
									size='mini'
									content='Delete'
									onClick={(e) => {
										handleDelete(video.id, video.userName, video.title);
									}}
								/>}
								{my && <Button
									color='vk'
									size='mini'
									content='Update'
									onClick={(e) => {
										VideoStore.setVideo(video)
										navigate('/video/update/?vid=' + video.id);
									}}
								/>}
							</div>
						</div>

					</div>
				))}
				<VideoModal />
			</section>
			
		</>
	);
}

export default observer(MyVideoList);