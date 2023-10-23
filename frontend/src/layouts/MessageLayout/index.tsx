import React from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import './style.scss'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { UserContext, UserContextType } from '../../App'
import { signInWithCustomToken } from 'firebase/auth'
import { auth, db } from '../../configs/Firebase'
import { authApi, endpoints } from '../../configs/API'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { Follow } from '../../interfaces/Folllow'
import { Room } from '../../interfaces/Room'
import ChatItem from './components/ChatItem'


const MessageLayout: React.FC = () => {

    const context = React.useContext<UserContextType | undefined>(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = context;

    const [authToken, setAuthToken] = React.useState<any>();
    const [followingUsers, setFollowingUsers] = React.useState<Follow[]>([]);
    const location = (useLocation().pathname === "/messages");
    const [chatRooms, setChatRooms] = React.useState<Room[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const getFbToken = async () => {
            const res = await authApi().get(endpoints["getAuthToken"]);
            setAuthToken(res.data);
        }
        const getRecommendUser = async () => {
            const res = await authApi().get(endpoints.followings(currentUser?.username));
            if (res.status === 200) {
                setFollowingUsers(res.data);
            }
        }
        if (currentUser) {
            getRecommendUser();
            getFbToken();
        }
    }, [currentUser])

    React.useEffect(() => {
        if (authToken && currentUser) {
            signInWithCustomToken(auth, authToken);
            const chatroomsRef = collection(db, 'chatrooms');
            const q = query(chatroomsRef, where('members', 'array-contains', currentUser.username), orderBy("updatedAt", "desc"));
            onSnapshot(q, (snapshot: any) => {
                setChatRooms(snapshot.docs.map((doc: any) => doc.data()));
            });
        }
    }, [authToken, currentUser]);

    const findResults = !searchTerm ? chatRooms : chatRooms.filter(room =>
        room.user2.fullName?.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );

    const followResults = !searchTerm ? followingUsers : followingUsers.filter(following =>
        following.beFollowedUserId?.fullName?.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );


    if (!currentUser) {
        return (<Navigate to="/login?next=/messages" />);
    }




    return (<>
        <div className="h-[91vh] grid grid-cols-9">
            <div className="col-span-2 h-[91vh] overflow-y-auto border-r border-gray-300 p-5">
                <div className="w-full flex flex-col gap-2">
                    <h1 className="text-xl font-bold">Tin nhắn</h1>
                    <div className="relative">
                        <div className="relative h-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <RiSearch2Line className="text-gray-700" size={20} />
                            </div>
                            <input type="search"
                                value={searchTerm}
                                onChange={(evt) => setSearchTerm(evt.target.value)}
                                className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Tìm người dùng..." />
                        </div>
                    </div>
                    <div className="mt-5 flex flex-col">
                        {findResults.map((item: any, index: number) => {
                            return <ChatItem key={index} user={item.user1.username === currentUser.username ? item.user2 : item.user1} message={item.lastMessage} />
                        })}
                        <h2 className="mt-5 font-bold border-t-2 border-gray-300 py-5">Người bạn theo dõi</h2>
                        {followResults.map((followingUser: Follow, index) => {
                            return  <ChatItem key={index} user={followingUser.beFollowedUserId} message={undefined} /> 
                        })}
                    </div>
                </div>
            </div>
            <div className="col-span-7 h-[91vh]">
                {location ? (<div className="flex h-full justify-center items-center">
                    <h1 className="text-xl font-bold pb-20">Hãy chọn một đoạn chat để bắt đầu trò chuyện</h1>
                </div>)
                    : (<>
                        <div className="flex flex-col grid grid-cols-7 h-full">
                            <Outlet />
                        </div>
                    </>)
                }
            </div>
        </div >

    </>);
};

export default MessageLayout;
