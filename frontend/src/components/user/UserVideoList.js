import React from 'react'
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import OfferStore from '../../store/OfferStore';
import VideoCard from '../main/VideoCard';
import VideoModal from '../main/VideoModal';
import OfferModal from '../offer/OfferModal';
import { getCookie } from '../../utils/cookie';

function UserVideoList({ videos }) {
	const videoList = videos;

	const handleOffer = (video) => {
		if (video.userId === getCookie('id')) {
			return alert('마이페이지');
		} else if(getCookie('id')===null) {
			return alert('로그인이 필요한 기능입니다.');
		} else {
			OfferStore.setVideo(video);
			OfferStore.setModal(true);
		}
	}
  return (
		<>
			<section id='actors'>
				<div className='search'>
				</div>
				{videoList && videoList.map((video, idx) => (
					<div className='vid' key={idx}>
						<VideoCard video={video} key={idx}/>
						{<Button onClick={() => handleOffer(video)} id='apply' size='small' color='black'>
							Offer
						</Button>}
						<div className='tag'>
							{video.tags.split(",").map((tag, i) => (
								<Button size='mini' >
									{tag}
								</Button>
							))
							}
						</div>
					</div>
				))}
			<VideoModal />
			</section>
			<OfferModal />
			
		</>
	);
}

export default observer(UserVideoList);