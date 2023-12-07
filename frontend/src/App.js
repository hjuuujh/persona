import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import Main from './components/main/Main';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import VideoUploadPage from './components/content/VideoUploadPage';
import MyPage from './components/user/MyPage';
import UserPage from './components/user/UserPage';
import VideoUpdatePage from './components/content/VideoUpdatePage';
import UserUpdatePage from './components/user/UserUpdatePage';
import NotFound from './components/common/NotFound';
import './scss/style.scss';
function App() {
  return (
    <>
			<Header />
			<Routes>
				<Route path='/' exact element={<Main />} />
				<Route path='/signup' exact element={<SignUpPage />} />
				<Route path='/login' exact element={<LoginPage />} />
				<Route path='/upload' exact element={<VideoUploadPage />} />
				<Route path='/mypage' exact element={<MyPage />} />
				<Route path='/userpage' exact element={<UserPage />} />
				<Route path='/video/update' exact element={<VideoUpdatePage />} />
				<Route path='/user/update' exact element={<UserUpdatePage />} />
				<Route path='/*' exact element={<NotFound />} />
			</Routes>
			<Footer />
		</>
  );
}

export default App;
