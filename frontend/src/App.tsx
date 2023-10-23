import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './layouts/Header';
import Home from './pages/Home';
import Footer from './layouts/Footer';
import NotFound from './pages/NotFound';
import React, { createContext, useReducer } from 'react';
import UserReducer, { Action } from './reducers/UserReducer';
import cookies from 'react-cookies'
import { User } from './interfaces/User';
import Login from './pages/Login';
import ProfileLayout from './layouts/ProfileLayout';
import ProfilePosts from './pages/Profile/Post';
import Forum from './pages/Forum';
import MessageLayout from './layouts/MessageLayout';
import ChatRoom from './pages/ChatRoom';
import PostRents from './pages/PostRents';
import PostRentDetail from './pages/PostRentDetail';
import Register from './pages/Register';
import Upload from './pages/Upload';
import ManagerLayout from './layouts/ManagerLayout';
import PostManager from './pages/Manager/PostManager';
import MotelManager from './pages/Manager/MotelManager';
import AddMotel from './pages/Manager/MotelManager/AddMotel';
import 'flowbite';
import AddPost from './pages/Manager/PostManager/AddPost';
import { v4 as uuid } from 'uuid';
import MotelLayout from './layouts/MotelLayout';
import MotelMap from './pages/Motel/Map';
import MotelRating from './pages/Motel/Rating';
import MotelPost from './pages/Motel/Post';
import ProfileFavorites from './pages/Profile/Favourites';

export interface UserContextType {
  currentUser: User | null;
  dispatch: React.Dispatch<Action>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const App: React.FC = () => {
  const [currentUser, dispatch] = useReducer(UserReducer, cookies.load("user") || null);
  React.useEffect(() => {
    const newSessionToken = uuid();
    localStorage.setItem("sessionToken", newSessionToken)
  }, []);
  return (
    <>
      <UserContext.Provider value={{ currentUser, dispatch }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/:slugUser" element={<ProfileLayout />}>
              <Route index path="" element={<></>} />
              <Route path="posts" element={<ProfilePosts />} />
              <Route path="favourites" element={<ProfileFavorites />} />
            </Route>
            <Route path="/forum" element={<Forum />}></Route>
            <Route path="/messages" element={<MessageLayout />}>
              <Route index path="" element={<></>} />
              <Route path=":slugUser" element={<ChatRoom />} />
            </Route>
            <Route path="/motels/:slugMotel" element={<MotelLayout />}>
              <Route index path="" element={<MotelPost></MotelPost>} />
              <Route path="posts" element={<MotelPost/>} />
              <Route path="map" element={<MotelMap />} />
              <Route path="rating" element={<MotelRating />} />
            </Route>
            <Route path="/posts" element={<PostRents />}></Route>
            <Route path="/posts/:slugPost" element={<PostRentDetail />}></Route>
            <Route path="/upload" element={<Upload />} />
            <Route path="/manager" element={<ManagerLayout />}>
              <Route index path="" element={<></>} />
              <Route path="/manager/motels" element={<MotelManager />}></Route>
              <Route path="/manager/motels/add" element={<AddMotel />}></Route>
              <Route path="/manager/posts" element={<PostManager />}></Route>
              <Route path="/manager/posts/add" element={<AddPost />}></Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
