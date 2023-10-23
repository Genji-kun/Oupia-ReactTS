import React, { useContext } from 'react';
import API, { endpoints } from '../../../../configs/API';
import { Button, Card } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { UserContext, UserContextType } from '../../../../App';
import { PostRentContext, PostRentContextType } from '../..';

const ProfileCard: React.FC = () => {

  const postRentContext = React.useContext<PostRentContextType | undefined>(PostRentContext);
  if (!postRentContext) {
    throw new Error("PostRentContext must be used within a PostRentContextProvider");
  }
  const { post, images } = postRentContext;

  const userContext = useContext<UserContextType | undefined>(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { currentUser } = userContext;


  const [countPosts, setCountPosts] = React.useState(null);
  const [countFollowers, setCountFollowers] = React.useState(null);



  React.useEffect(() => {
    const getCountPost = async () => {
      const res = await API.get(endpoints["countPosts"], {
        params: {
          userId: post.userId.id,
          isAccepted: "accepted",
          type: "landlordPost",
        }
      })
      if (res.status === 200)
        setCountPosts(res.data);
    }

    const getCountFollowers = async () => {
      const res = await API.get(endpoints.countFollowers(post.userId.username))
      if (res.status === 200)
        setCountFollowers(res.data);
    }
    if (post) {
      getCountPost();
      getCountFollowers();
    }
  }, [post])

  const handleChat = () => {
    post.image = images[0];
    sessionStorage.setItem('postChat', JSON.stringify(post));
  };

  return (
    <Card className='items-center'>
      <Link to={`/${post.userId.username}`}>
        <div className=" z-999 w-56 h-56 ring-[5px] mx-auto ring-white rounded-full shadow-xl">
          <img
            src={post.userId.avatar}
            alt="Avatar"
            className="w-full h-full rounded-full"
          />
        </div>
        <div id="title" className="font-bold mt-4 mx-auto text-center text-lg">{post.userId.fullName}</div>
      </Link>

      <div id="stats" className="flex justify-between items-center my-2 mx-auto">
        <div className="flex flex-col items-center mr-10">
          <div className="font-bold text-lg">{countPosts ? countPosts : '...'}</div>
          <div className="">Bài viết</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg">{countFollowers ? countFollowers : '...'}</div>
          <div className="">Theo dõi</div>
        </div>
      </div>
      <div id="actions" className="mx-auto flex gap-5">
        <Link to={`/${post.userId.username}`}>
          <Button color="dark" className="w-full">Trang cá nhân</Button>
        </Link>

        {currentUser ? <> <Link to={`/messages/${post.userId.username}`}>
          <Button onClick={() => handleChat()} className=" bg-primary enabled:hover:bg-primary hover:text-white" outline>Nhắn tin</Button>
        </Link></> : <> <Link to="/login">
          <Button className=" bg-primary enabled:hover:bg-primary hover:text-white" outline>Nhắn tin</Button>
        </Link></>}

      </div>
    </Card >
  );
};

export default ProfileCard;
