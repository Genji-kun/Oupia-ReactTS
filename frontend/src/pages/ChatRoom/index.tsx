import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, UserContextType } from '../../App'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DocumentData, addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../../configs/Firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import API, { endpoints } from '../../configs/API'
import { Modal, Spinner } from 'flowbite-react'
import { IoClose, IoInformationCircleOutline, IoSendSharp } from 'react-icons/io5'
import { PiClipboardLight, PiStar, PiUser } from 'react-icons/pi'
import LeftMesssage from './components/LeftMessage'
import RightMessage from './components/RightMessage'
import PostMessage from './components/PostMessage'
import { Post } from '../../interfaces/Post'
import './style.scss'
import { LuImage } from 'react-icons/lu'
import { RiAttachment2 } from 'react-icons/ri'
import formatCurrency from '../../utils/priceUtils'
import { HiOutlineHomeModern } from 'react-icons/hi2'
import { Motel } from '../../interfaces/Motel'
import MotelMessage from './components/MotelMessage'

const ChatRoom: React.FC = () => {

  const context = useContext<UserContextType | undefined>(UserContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { currentUser } = context;

  const { slugUser } = useParams();
  const [receiverUser, setReceiverUser] = useState<any>(null);
  const [msg, setMsg] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const imageRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [active, setActive] = useState<string>("posts");
  const [posts, setPosts] = useState<Post[] | undefined>();
  const [selectedPost, setSelectedPost] = useState<Post | undefined>();
  const [motels, setMotels] = useState<Motel[] | undefined>();
  const [selectedMotel, setSelectedMotel] = useState<Motel | undefined>();
  const [openModal, setOpenModal] = useState<string | undefined>();
  const props = { openModal, setOpenModal };
  const hasFetched = React.useRef(false);


  const uploadImage = async (imgFile: File) => {
    const imagePath = `images/${Date.now()}-${currentUser?.username}-${imgFile.name}`;
    const storageRef = ref(storage, imagePath);
    await uploadBytes(storageRef, imgFile);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  const sendMessage = async (evt: any) => {
    evt.preventDefault();
    if (msg.trim().length > 0 || imageRef.current?.files?.length) {
      let imageUrl: String | null = null;
      if (imageRef.current?.files?.length) {
        imageUrl = await uploadImage(imageRef.current.files[0]);
      }

      const chatroomsRef = collection(db, 'chatrooms');
      const combinedUsername = [currentUser?.username, receiverUser.username].sort().join(':');

      const q = query(chatroomsRef, where('roomId', '==', combinedUsername));
      getDocs(q).then((snapshot: any) => {
        const chatroom = snapshot.docs[0];
        const newMessage: any = {
          sender: currentUser?.username,
          content: msg,
          createdAt: serverTimestamp(),
        }

        if (msg.trim().length > 0) {
          newMessage.type = "text";
          newMessage.content = msg.trim();
        } else {
          newMessage.type = "image";
        }
        if (imageUrl) {
          newMessage.image = imageUrl;
        }

        if (chatroom) {
          addDoc(collection(chatroom.ref, 'messages'), {
            ...newMessage
          }).then(() => {
            updateDoc(chatroom.ref, {
              lastMessage: newMessage,
              updatedAt: serverTimestamp(),
            });
          });
        } else {
          addDoc(chatroomsRef, {
            roomId: combinedUsername,
            members: [currentUser?.username, receiverUser.username],
            user1: currentUser,
            user2: receiverUser
          }).then((chatroomsRef) => {
            updateMessage();
            addDoc(collection(chatroomsRef, 'messages'), {
              ...newMessage
            }).then(() => {
              updateDoc(chatroomsRef, {
                lastMessage: newMessage,
                updatedAt: serverTimestamp(),
              });
            });
          });
        }
      });
      if (imageRef.current != null) {
        imageRef.current.value = '';
        setImageSrc(null);
      }
      setMsg('');
    }
  }

  const updateMessage = () => {
    if (currentUser) {
      const chatroomsRef = collection(db, 'chatrooms');
      const combinedUsername = [currentUser.username, receiverUser.username].sort().join(':');
      const q = query(chatroomsRef, where('roomId', '==', combinedUsername));
      getDocs(q).then((snapshot) => {
        const chatroom = snapshot.docs[0];
        if (chatroom) {
          const messageRef = collection(chatroom.ref, "messages");
          const q2 = query(messageRef, orderBy("createdAt"));
          onSnapshot(q2, (snapshot: any) => {
            setMessages(snapshot.docs.map((doc: DocumentData) => doc.data()));
          })
        }
      });
    }
  }

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFileUpload = () => {
    const file = imageRef.current?.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
    else {
      setImageSrc(null);
    }
  };

  const sendPostMessage = (post: Post | null) => {
    if (post) {
      const chatroomsRef = collection(db, 'chatrooms');
      const combinedUsername = [currentUser?.username, receiverUser.username].sort().join(':');

      const q = query(chatroomsRef, where('roomId', '==', combinedUsername));
      getDocs(q).then((snapshot) => {
        const chatroom = snapshot.docs[0];
        const newMessage = {
          sender: currentUser?.username,
          content: post,
          type: 'post',
          createdAt: serverTimestamp(),
        }
        if (chatroom) {
          addDoc(collection(chatroom.ref, 'messages'), {
            ...newMessage
          }).then(() => {
            updateDoc(chatroom.ref, {
              lastMessage: newMessage,
              updatedAt: serverTimestamp(),
            });
          });
        } else {
          addDoc(chatroomsRef, {
            roomId: combinedUsername,
            members: [currentUser?.username, receiverUser.username],
            user1: currentUser,
            user2: receiverUser
          }).then((chatroomsRef) => {
            updateMessage();
            addDoc(collection(chatroomsRef, 'messages'), {
              ...newMessage
            }).then(() => {
              updateDoc(chatroomsRef, {
                lastMessage: newMessage,
                updatedAt: serverTimestamp(),
              });
            });
          });
        }
      });
      setMsg('');
    }
  }

  const sendMotelMessage = (motel: Motel | null) => {
    if (motel) {
      const chatroomsRef = collection(db, 'chatrooms');
      const combinedUsername = [currentUser?.username, receiverUser.username].sort().join(':');

      const q = query(chatroomsRef, where('roomId', '==', combinedUsername));
      getDocs(q).then((snapshot) => {
        const chatroom = snapshot.docs[0];
        const newMessage = {
          sender: currentUser?.username,
          content: motel,
          type: 'motel',
          createdAt: serverTimestamp(),
        }
        if (chatroom) {
          addDoc(collection(chatroom.ref, 'messages'), {
            ...newMessage
          }).then(() => {
            updateDoc(chatroom.ref, {
              lastMessage: newMessage,
              updatedAt: serverTimestamp(),
            });
          });
        } else {
          addDoc(chatroomsRef, {
            roomId: combinedUsername,
            members: [currentUser?.username, receiverUser.username],
            user1: currentUser,
            user2: receiverUser
          }).then((chatroomsRef) => {
            updateMessage();
            addDoc(collection(chatroomsRef, 'messages'), {
              ...newMessage
            }).then(() => {
              updateDoc(chatroomsRef, {
                lastMessage: newMessage,
                updatedAt: serverTimestamp(),
              });
            });
          });
        }
      });
      setMsg('');
    }
  }

  useEffect(() => {
    const getReceiverUser = async () => {
      try {
        const url = endpoints.userInfo(slugUser);

        let res = await API.get(url);
        if (res.status === 200) {
          setLoading(false);
          setReceiverUser(res.data);
        }

      } catch (err) {
        console.error(err);
      }
    }
    getReceiverUser();
  }, [slugUser])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([]);

    const updateMessage = () => {
      const chatroomsRef = collection(db, 'chatrooms');
      const combinedUsername = [currentUser?.username, receiverUser.username].sort().join(':');
      const q = query(chatroomsRef, where('roomId', '==', combinedUsername));
      getDocs(q).then((snapshot) => {
        const chatroom = snapshot.docs[0];
        if (chatroom) {
          const messageRef = collection(chatroom.ref, "messages");
          const q2 = query(messageRef, orderBy("createdAt"));
          onSnapshot(q2, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));

          })
        }
      });

    }
    if (currentUser && receiverUser) {
      updateMessage();
      if (sessionStorage.getItem('postChat') !== null) {
        let postChatString = sessionStorage.getItem('postChat');
        let postChat: Post | null = postChatString ? JSON.parse(postChatString) : null;
        if (postChat && postChat.userId.id === receiverUser.id)
          sendPostMessage(postChat);
        sessionStorage.removeItem('postChat');
      }
    }
  }, [currentUser, receiverUser])

  useEffect(() => {
    if (selectedPost) {
      let newPostSend: Post = selectedPost;
      newPostSend.userId.landlordInfo = null;
      sendPostMessage(newPostSend);
    }
  }, [selectedPost]);

  useEffect(() => {
    if (selectedMotel) {
      sendMotelMessage(selectedMotel);
    }
  }, [selectedMotel]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!receiverUser) {
        setLoading(false);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [receiverUser]);

  useEffect(() => {
    if (openModal === "open" || !hasFetched.current) {
      const getPost = async () => {
        try {
          let res = await API.get(endpoints['posts'], {
            params: {
              type: "landlordPost",
              userId: currentUser?.id
            }
          });
          if (res.status === 200) {
            setPosts(res.data.posts);
            hasFetched.current = true;
          }
        } catch (err) {
          console.error(err);
        }
      }
      const getMotels = async () => {
        try {
          let res = await API.get(endpoints['motels'], {
            params: {
              userId: currentUser?.id
            }
          });
          if (res.status === 200) {
            setMotels(res.data);
            hasFetched.current = true;
          }
        } catch (err) {
          console.error(err);
        }
      }
      getMotels();
      getPost();
    }

  }, [props.openModal])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center col-span-7">
        <Spinner size="xl" className=" fill-primary" />
      </div>
    );
  }

  if (!receiverUser) {
    return <div className="w-full h-full flex items-center justify-center col-span-7">Không có người dùng</div>;
  }

  if (receiverUser && !currentUser) {
    return <Navigate to="/login" />
  }

  return (<>
    <div className="col-span-5 flex flex-col h-[91vh]">
      <div className="shrink-1 py-3 px-5 shadow-lg row-span-1 border-b-2 border-gray-200">
        <div className="flex gap-5 w-full items-center">
          <div className='col-span-1'>
            <div className="w-12 h-12 ">
              <img
                src={receiverUser.avatar}
                alt="Avatar"
                className="rounded-full"
              />
            </div>
          </div>
          <h2 className="text-dark font-bold w-full">{receiverUser.fullName}</h2>
          <IoInformationCircleOutline size="30" className="pl-auto" />
        </div>
      </div>
      <div className="flex-grow flex shrink-1 pl-5 overflow-y-auto">
        <div className="h-full w-full" >
          <div className="pt-5 pr-5 flex flex-col gap-2">
            {messages && messages.map((message) =>
              <>
                {(message.type === "text" || message.type === "image") && (<>
                  {message.sender === currentUser?.username ? <RightMessage content={message.content ? message.content : null} image={message.image ? message.image : null} /> : ""}
                  {message.sender === receiverUser.username ? <LeftMesssage content={message.content ? message.content : null} image={message.image ? message.image : null} avatar={receiverUser.avatar} /> : ""}
                </>)}
                {message.type === "post" && (<>
                  {message.sender === receiverUser.username ?
                    <div className="w-full">
                      <div className="w-fit flex gap-3 items-start">
                        <div className="z-999 w-10 h-10 rounded-full">
                          <img
                            src={receiverUser.avatar}
                            alt="Avatar"
                            className="w-full h-full rounded-full"
                          />
                        </div>
                        <div>
                          <PostMessage post={message.content} />
                        </div>
                      </div>
                    </div>
                    : <>
                      <PostMessage post={message.content} />
                    </>}
                </>)}
                {message.type === "motel" && (<>
                  {message.sender === receiverUser.username ?
                    <div className="w-full">
                      <div className="w-fit flex gap-3 items-start">
                        <div className="z-999 w-10 h-10 rounded-full">
                          <img
                            src={receiverUser.avatar}
                            alt="Avatar"
                            className="w-full h-full rounded-full"
                          />
                        </div>
                        <div>
                          <MotelMessage motel={message.content} />
                        </div>
                      </div>
                    </div>
                    : <>
                      <MotelMessage motel={message.content} />
                    </>}
                </>)}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

        </div>
      </div>
      <div className="p-4 shrink-1">
        <div className="flex gap-2 items-center w-full">
          <div className="w-fit flex items-center">
            <div className="w-fit h-full">
              <label htmlFor="postInput" className="w-fit flex justify-center items-center cursor-pointer">
                <RiAttachment2 size={25} className="text-primary hover:text-secondary" onClick={() => props.setOpenModal('open')}></RiAttachment2>
              </label>
              <Modal id="postInput" dismissible size="4xl" show={props.openModal === 'open'} onClose={() => props.setOpenModal(undefined)}>
                <Modal.Header>Đính kèm</Modal.Header>
                <Modal.Body className="p-0">
                  <div>
                    <div className="flex text-center flex-wrap border-b border-gray-200 dark:border-gray-700">
                      <div onClick={() => { setActive("posts") }} className={`${active === "posts" ? "border-dark text-dark" : "border-transparent text-gray-400"} flex cursor-pointer font-bold items-center justify-center p-4 text-sm first:ml-0 focus:outline-none rounded-t-lg border-b-2`}>
                        <PiClipboardLight size="20" className="mr-2" />
                        <p className="mt-1">Bài viết</p>
                      </div>
                      <div onClick={() => { setActive("motels") }} className={`${active === "motels" ? "border-dark text-dark" : "border-transparent text-gray-400"} flex cursor-pointer font-bold items-center justify-center p-4 text-sm first:ml-0 focus:outline-none rounded-t-lg border-b-2`}>
                        <HiOutlineHomeModern size="20" className="mr-2" />
                        <p className="mt-1">Nhà trọ</p>
                      </div>
                    </div>
                    <div className="flex flex-col p-5 gap-3 max-h-[50vh] overflow-y-auto">
                      {
                        active === "posts" ?
                          <>
                            {posts && posts.map((post, index: number) => (
                              <>
                                <div onClick={() => {
                                  setSelectedPost(post);
                                  props.setOpenModal(undefined);
                                }} key={index} className="w-full h-fit bg-white rounded-xl shadow-lg text-dark relative border border-gray-200 cursor-pointer hover:bg-primary/10">
                                  <div className="grid grid-cols-6 h-full">
                                    <div className="col-span-6 lg:col-span-1">
                                      <img className="h-32 w-32 object-cover rounded-l-xl" src={post.image} alt="postimage" />
                                    </div>
                                    <div className="col-span-6 lg:col-span-5 px-8 py-3 mt-4 lg:mt-0">
                                      <div className="text-lg uppercase font-bold mt-5 tracking-wide font-semibold mb-2 text-dark line-clamp-1">{post.title}</div>
                                      <h1 className="text-primary text-lg">Giá: {formatCurrency(post.postRentDetail.price)}đ/tháng</h1>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ))}
                          </> : <>
                            {motels && motels.map((motel, index: number) => (
                              <>
                                <div onClick={() => {
                                  setSelectedMotel(motel);
                                  props.setOpenModal(undefined);
                                }} key={index} className="w-full h-fit bg-white rounded-xl shadow-lg text-dark relative border border-gray-200 cursor-pointer hover:bg-primary/10">
                                  <div className="grid grid-cols-6 h-full">
                                    <div className="col-span-6 lg:col-span-1">
                                      <img className="h-32 w-32 object-cover rounded-l-xl" src={motel.image} alt="postimage" />
                                    </div>
                                    <div className="col-span-6 lg:col-span-5 px-8 py-3 mt-4 lg:mt-0">
                                      <div className="text-lg uppercase font-bold mt-5 tracking-wide font-semibold mb-2 text-dark line-clamp-1">{motel.name}</div>
                                      <div className="flex gap-2 items-center text-primary">
                                        <h1 className="text-gray-500">Đánh giá: </h1>
                                        <PiStar></PiStar>
                                        <h1>4.2</h1>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ))}
                          </>
                      }
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </div>
          <div className="w-fit flex items-center">
            <div className="w-fit h-full">
              <label htmlFor="imgInput" className="w-fit flex justify-center items-center cursor-pointer">
                <LuImage size={25} className="text-primary hover:text-secondary"></LuImage>
              </label>
              <input ref={imageRef} onChange={handleFileUpload} type="file" id="imgInput" className="hidden" />
            </div>
          </div>
          <div className="flex-grow">
            <form onSubmit={(evt) => sendMessage(evt)} className="relative">
              <div className="border border-gray-300 rounded-lg bg-gray-50">
                {imageSrc && (
                  <div className="p-3 relative w-fit">
                    <IoClose size="25" className="text-red-600 bg-white rounded-lg absolute right-2 top-2 cursor-pointer" onClick={() => setImageSrc(null)} />
                    <img className="rounded-lg w-32 h-32 md:w-16 md:h-16 object-cover" src={imageSrc} />
                  </div>
                )}

                <div className="relative">
                  <input value={msg} onChange={(evt) => setMsg(evt.target.value)} type="text" className="block bg-transparent border-0 w-full px-4 py-3 text-sm text-gray-900 rounded-lg focus:ring-0 focus:outline-none focus:border-0" placeholder="Aa" />
                  <button type="submit" className=" absolute right-2.5 bottom-1/2 translate-y-1/2 focus:ring-0 focus:outline-none font-medium rounded-lg text-sm px-2 py-2"><IoSendSharp className="text-primary" size={25} /></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className="col-span-2 h-full">
      <div className="h-full col-span-2 border-l border-gray-300 p-5">
        <div className="flex flex-col gap-5 items-center">
          <div className="z-999 w-24 h-24 ring-2 mx-auto ring-gray-200 border-4 border-white rounded-full">
            <img
              src={receiverUser.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full"
            />
          </div>
          <div id="title" className="font-bold text-primary mt-4 mx-auto text-center text-lg">{receiverUser.fullName}</div>

          <div id="actions" className="items-center flex flex-col gap-1">
            <Link to={`/${receiverUser.username}`}><button className="bg-gray-200 p-3 rounded-full"><PiUser size="25" /></button></Link>
            <h3 className="text-sm">Trang cá nhân</h3>
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default ChatRoom;
