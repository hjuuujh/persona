import React, { useState, useEffect } from 'react';
import VideoStore from '../../store/VideoStore';
import UserStore from '../../store/UserStore';
import UserVideoList from './UserVideoList';
import Intro from './Intro';
import { useLocation } from 'react-router-dom';

function UserPage() {
	const [menu, setMenu] = useState(0);
	const [videoList, setVideoList] = useState();
	const [likeVideoList, setLikeVideoList] = useState();
	const [followList, setFollowList] = useState();
	const [isLoading, setLoading] = useState(true);
	const [user, setUser] = useState();
	const [video, setVideo] = useState();
	const userId = useLocation().search.split("=")[1];
	const [more0, setMore0] = useState("more");
	const [more1, setMore1] = useState("more");
	const [more2, setMore2] = useState("more");

	const active = { color: '#d5a869' };

	useEffect(() => {
		console.log(userId);
		VideoStore.retrieveMyVideos("user", 'user', userId).then((re) => {
			setVideoList(VideoStore.myVideos);
			setLoading(false);
		});
		VideoStore.retrieveLikeVideos("user", "like", userId).then((re) => {
			setLikeVideoList(VideoStore.likeVideos);
		});
		VideoStore.retrieveFollowVideos("user", "follow", userId).then((re) => {
			setFollowList(VideoStore.followVideos);
		});
		UserStore.getUser("user", userId).then(() => {
			setUser(UserStore.user);
		});
		UserStore.getUserIntro("user", userId).then(() => {
			setVideo(UserStore.intro);
		});
	}, [userId]);

	const handelOnCilckMore = () => {
		VideoStore.setPage(menu);
		if (menu === 0) {
			VideoStore.retrieveMyVideos("user", 'user', userId).then((re) => {
				setVideoList(VideoStore.myVideos);
				setMore0(re);
			});
		} else if (menu === 1) {
			VideoStore.retrieveLikeVideos("user", "like", userId).then((re) => {
				setLikeVideoList(VideoStore.likeVideos);
				setMore1(re);

			});
		} else if (menu === 2) {
			VideoStore.retrieveFollowVideos("user", "follow", userId).then((re) => {
				setFollowList(VideoStore.followVideos);
				setMore2(re);

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
							<li id='actor' onClick={() => { setMore0(); setMenu(0) }}>
								<h1 activestyle={active}>Video List</h1>
							</li>
							<li id='actor' onClick={() => { setMore1(); setMenu(1) }}>
								<h1 activestyle={active}>Like Video List</h1>
							</li>
							<li id='actor' onClick={() => { setMore2(); setMenu(2) }}>
								<h1 activestyle={active}>Follow List</h1>
							</li>
						</ul>
					</div>
				</div>
				<div className='category' >
					{menu === 0 && <><UserVideoList videos={videoList} />
						{more0 === "end" ?
							<footer>
								<h1>End</h1>
							</footer>
							:
							<footer onClick={handelOnCilckMore}>
								<h1>More</h1>
							</footer>
						}</>}
					{menu === 1 && <> <UserVideoList videos={likeVideoList} />
						{more1 === "end" ?
							<footer>
								<h1>End</h1>
							</footer>
							:
							<footer onClick={handelOnCilckMore}>
								<h1>More</h1>
							</footer>
						}</>}
					{menu === 2 && <><UserVideoList videos={followList} />
						{more2 === "end" ?
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

export default UserPage