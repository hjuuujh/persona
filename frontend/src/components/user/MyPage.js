import React, { useState, useEffect } from 'react';
import VideoStore from '../../store/VideoStore';
import UserStore from '../../store/UserStore';
import OfferStore from '../../store/OfferStore';
import MyVideoList from './MyVideoList';
import MyOfferList from '../offer/MyOfferList';
import { getCookie } from '../../utils/cookie';
import Intro from './Intro';
import { observer } from 'mobx-react';

function MyPage() {
	const [menu, setMenu] = useState(0);
	const [videoList, setVideoList] = useState();
	const [likeVideoList, setLikeVideoList] = useState();
	const [followList, setFollowList] = useState();
	const [offerList, setOfferList] = useState();
	const [offeredList, setOfferedList] = useState();
	const [isLoading, setLoading] = useState(true);
	const userId = getCookie("id");
	const [user, setUser] = useState();
	const [video, setVideo] = useState();
	const [more0, setMore0] = useState("more");
	const [more1, setMore1] = useState("more");
	const [more2, setMore2] = useState("more");
	const [more3, setMore3] = useState("more");
	const [more4, setMore4] = useState("more");
	const active = { color: '#d5a869' };

	useEffect(() => {
		VideoStore.retrieveMyVideos("user", "my").then(() => {
			setVideoList(VideoStore.myVideos);
		});
		VideoStore.retrieveLikeVideos("user", "like", userId).then(() => {
			setLikeVideoList(VideoStore.likeVideos);
		});
		VideoStore.retrieveFollowVideos("user", "follow", userId).then(() => {
			setFollowList(VideoStore.followVideos);
		});
		UserStore.getUser("my").then(() => {
			setUser(UserStore.user);
		});
		UserStore.getUserIntro("my").then(() => {
			setVideo(UserStore.intro);
			setLoading(false);
		});
		OfferStore.getOffer().then(() => {
			setOfferList(OfferStore.offerList);
		});
		OfferStore.getOffered().then(() => {
			setOfferedList(OfferStore.offeredList);
		});
	}, [userId]);

	const handelOnCilckMore = () => {
		if (menu === 0) {
			VideoStore.setPage(menu);
			VideoStore.retrieveMyVideos("user", "my").then((re) => {
				setVideoList(VideoStore.myVideos);
				setMore0(re);
			});
		} else if (menu === 1) {
			VideoStore.setPage(menu);
			VideoStore.retrieveLikeVideos("user", "like", userId).then((re) => {
				setLikeVideoList(VideoStore.likeVideos);
				setMore1(re);

			});
		} else if (menu === 2) {
			VideoStore.setPage(menu);
			VideoStore.retrieveFollowVideos("user", "follow", userId).then((re) => {
				setFollowList(VideoStore.followVideos);
				setMore2(re);

			});
		} else if (menu === 3) {
			OfferStore.setPage(menu);
			OfferStore.getOffer().then((re) => {
				setOfferList(OfferStore.offerList);
				setMore3(re);
			});
		}
		else if (menu === 4) {
			OfferStore.setPage(menu);
			OfferStore.getOffered().then((re) => {
				console.log(re);
				setOfferedList(OfferStore.offeredList);
				setMore4(re);
			});

		}

	};

	return (
		isLoading ? <p>Loading</p> :
			<section id='mypage'>
				<table />
				<Intro user={user} video={video} />
				<table />
				<div className='menu'>
					<div className='inner'>
						<ul id='gnb'>
							<li id='actor' onClick={() => { setMenu(0) }}>
								<h1 activestyle={active}>Video List</h1>
							</li>
							<li id='actor' onClick={() => { setMenu(1) }}>
								<h1 activestyle={active}>Like Video List</h1>
							</li>
							<li id='actor' onClick={() => { setMenu(2) }}>
								<h1 activestyle={active}>Follow List</h1>
							</li>
							<li id='actor' onClick={() => { setMenu(3) }}>
								<h1 activestyle={active}>Offer List</h1>
							</li>
							<li id='actor' onClick={() => { setMenu(4) }}>
								<h1 activestyle={active}>Offered List</h1>
							</li>
						</ul>
					</div>
				</div>
				<div className='category' >
					{menu === 0 && <><MyVideoList videos={videoList} my={true} />
						{more0 === "end" ?
							<footer>
								<h1>End</h1>
							</footer>
							:
							<footer onClick={handelOnCilckMore}>
								<h1>More</h1>
							</footer>
						}</>}
					{menu === 1 && <><MyVideoList videos={likeVideoList} my={false} />
						{more1 === "end" ?
							<footer>
								<h1>End</h1>
							</footer>
							:
							<footer onClick={handelOnCilckMore}>
								<h1>More</h1>
							</footer>
						}</>}
					{menu === 2 && <><MyVideoList videos={followList} my={false} />
						{more2 === "end" ?
							<footer>
								<h1>End</h1>
							</footer>
							:
							<footer onClick={handelOnCilckMore}>
								<h1>More</h1>
							</footer>
						}</>}
					{menu === 3 && <><MyOfferList offers={offerList} flag={true} />
						{more3 === "end" ?
							<footer>
								<h1>End</h1>
							</footer>
							:
							<footer onClick={handelOnCilckMore}>
								<h1>More</h1>
							</footer>
						}</>}
					{menu === 4 && <><MyOfferList offers={offeredList} flag={false} />
						{more4 === "end" ?
							<footer>
								<h1>End</h1>
							</footer>
							:
							<footer onClick={handelOnCilckMore}>
								<h1>More</h1>
							</footer>
						}</>}

				</div>
				<table />
			</section>

	);
}

export default observer(MyPage)