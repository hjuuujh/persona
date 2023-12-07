import React, { useEffect, useState } from 'react'
import VideoStore from '../../store/VideoStore';
import Form from 'react-bootstrap/Form';
import VideoCard from './VideoCard';
import { observer } from 'mobx-react';
import dbTags from '../../utils/videoRecommendedTags';
import categorys from '../../utils/videoCategory';
import { Button } from 'semantic-ui-react';
import OfferStore from '../../store/OfferStore';
import VideoModal from './VideoModal';
import OfferModal from '../offer/OfferModal';
import { getCookie } from '../../utils/cookie';

function VideoList() {
	const [isLoading, setLoading] = useState(true);
	const [menu, setMenu] = useState('2');
	const [videoList, setVideoList] = useState();
	const [inputText, setinputText] = useState();
	const [selectedTags, setTags] = useState([]);
	const token = getCookie('ACCESS_TOKEN')
	const [more, setMore] = useState("more");


	useEffect(() => {
		VideoStore.retrieveVideos().then((re) => {
			console.log("FFDWS")

			setVideoList(VideoStore.videos);
			setLoading(false);
			console.log(videoList)
		});
		if (token) {
			console.log("sSVEVES")
			VideoStore.getVideoLikeList()
		}
	}, [token]);

	const handelOnCilckMore = () => {
		VideoStore.setPage();
		VideoStore.retrieveVideos().then((re) => {
			setVideoList(VideoStore.videos);
			setMore(re);

		});
	};

	const handleOnClickOneTag = (tag) => {
		setMore();
		VideoStore.setOptions("tag", "one", tag);
		VideoStore.retrieveVideos().then((re) => {
			setVideoList(VideoStore.videos);
			setMore(re);

		});
	};

	const handleOnClickTag = (tag) => {
		setMore();

		if (tag === 'all') {
			VideoStore.retrieveVideos("all").then((re) => {
				setVideoList(VideoStore.videos);
				setMore(re);

			});
		} else {
			const tags = selectedTags.join(",");
			VideoStore.setOptions("tag", "multi", tags);

			VideoStore.retrieveVideos().then((re) => {
				setVideoList(VideoStore.videos);
				setMore(re);

			});
		}
	};

	const handleOnClickCategory = (category) => {
		setMore();

		if (category === "전체보기") {
			VideoStore.setOptions("all");
		} 
		VideoStore.retrieveVideos().then((re) => {
			setVideoList(VideoStore.videos);
			setMore(re);

		});
	};

	const handleOnClickSort = () => {
		setMore();

		VideoStore.retrieveVideos().then((re) => {
			setVideoList(VideoStore.videos);
			setMore(re);

		});
	};

	const handleEnter = (e) => {

		setMore();
		if (menu === '2') {
			VideoStore.setOptions("search", "title", inputText);
		} else if (menu === '3') {
			VideoStore.setOptions("search", "user", inputText);
		}
		VideoStore.retrieveVideos().then((re) => {
			setVideoList(VideoStore.videos);
			setMore(re);

		});
	};

	const handleOffer = (video) => {
		if (video.userId === getCookie('id')) {
			return alert('마이페이지');
		} else if (getCookie('id') === null) {
			return alert('로그인이 필요한 기능입니다.');
		} else {
			OfferStore.setVideo(video);
			OfferStore.setModal(true);
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const handleDeleteTag = (tag) => {
		setTags(selectedTags.filter((item) => item !== tag));
		console.log(selectedTags);
	};

	return isLoading ? (
		<p>Loading</p>
	) : (
		<>
			<section id='actors'>
				<div className='search'>
					<ul>
						<li>
							<Form.Select
								className='category'
								aria-label='Default select example'
								onChange={(e) => {
									setMenu(e.target.value);
								}}>
								<option value='2'>제목</option>
								<option value='3'>계정</option>
							</Form.Select>
							<Form
								className='d-flex'
								onSubmit={(e) => handleSubmit(e)}>
								<Form.Control
									type='search'
									placeholder='&nbsp;검색어를 입력하세요'
									className='me-2'
									aria-label='Search'
									onChange={(e) => setinputText(e.target.value)}
								/>
							</Form>
							<Button
								size='large'
								color='red'
								onClick={(e) => {handleEnter(e)}}>
								검색
							</Button>
						</li>
						<li>
							<Button inverted onClick={() => {VideoStore.setOptions("sort", "new"); handleOnClickSort()}}>
								최신순
							</Button>
						</li>
						<li>
							<Button inverted onClick={() => {VideoStore.setOptions("sort", "hit");handleOnClickSort()}}>
								조회순
							</Button>
						</li>
						<li>
							<Button inverted onClick={() => {VideoStore.setOptions("sort", "like");handleOnClickSort()}}>
								인기순
							</Button>
						</li>
					</ul>
				</div>
				<div className='category'>
					<ul>
						{categorys.map((category, i) => (
							<li key={i}>
								<Button
									size='huge'
									key={i}
									color={category.color}
									inverted
									onClick={() => {VideoStore.setOptions("category", category.category);handleOnClickCategory(category.category)}}>
									{category.category}
								</Button>
							</li>
						))}
					</ul>
				</div>
				<div className='tags'>
					<ul>
						<Button
							size='large'
							inverted
							color='grey'
							onClick={() => {
								handleOnClickTag('all');
								setTags([]);
							}}>
							태그전체
						</Button>

						{dbTags.map((tags, idx) => (
							<li key={idx}>
								{tags.map((tag, i) => (
									<Button.Group key={i} size='large'>
										{selectedTags.includes(tag) ? (
											<Button
												inverted
												color='red'
												onClick={() => handleDeleteTag(tag)}>
												{tag}
											</Button>
										) : (
											<Button
												inverted
												color='grey'
												onClick={() => setTags([...selectedTags, tag])}>
												{tag}
											</Button>
										)}
									</Button.Group>
								))}
							</li>
						))}
						<Button
							size='large'
							color='red'
							onClick={() => handleOnClickTag(selectedTags)}>
							검색
						</Button>
					</ul>
				</div>
				{videoList && videoList.map((video, idx) => (
					<div className='vid' key={idx}>
						<VideoCard video={video} />
						{<Button onClick={() => {
							if(!token) return alert("login required"); 
							else handleOffer(video)}} id='apply' size='small' color='black'>
							Offer
						</Button>}
						<div className='tag'>
							{video.tags.split(",").map((tag, i) => (
								<Button size='mini' key={i} onClick={() => handleOnClickOneTag(tag)}>
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
			{more==="end"?
				<footer>
				<h1>End</h1>
			</footer>
				:
				<footer onClick={handelOnCilckMore}>
					<h1>More</h1>
				</footer>
				}
		</>
	);
}

export default observer(VideoList);