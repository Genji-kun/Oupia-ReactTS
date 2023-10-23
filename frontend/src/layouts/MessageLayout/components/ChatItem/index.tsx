import React from 'react';
import { Link } from 'react-router-dom';
import { Message } from '../../../../interfaces/Message';
import { User } from '../../../../interfaces/User';
import moment from 'moment';


interface ChatItemProps {
    message?: Message,
    user: User
}

const ChatItem: React.FC<ChatItemProps> = (props) => {

    const { message, user } = props;

    if (user) {
        return (
            <>
                <Link to={`/messages/${user.username}`} className="py-3 px-2 rounded-lg hover:bg-gray-200">
                    <div className="grid grid-cols-5 gap-7 w-full items-center">
                        <div className='col-span-1'>
                            <div className="w-16 h-16 border-4 border-white ring-2 ring-gray-200 rounded-full">
                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div className="col-span-4 flex flex-col items-center gap-1">
                            <h2 className="text-Dark font-bold truncate col-span-4 w-full">{user.fullName}</h2>
                            <div className="flex gap-1 text-gray-500 text-sm w-full">
                                {message && (
                                    <>
                                        {message.type === "text" ? <h3 className="truncate">{message.content}</h3> : <>{
                                           message.type === "image" ? <h3 className="truncate">Đã gửi 1 ảnh</h3> : <h3 className="truncate">Đã gửi 1 bài viết</h3>
                                        }</>}
                                        <h3 className="whitespace-nowrap">· {message.createdAt && <span>{moment(message.createdAt.toDate()).fromNow()}</span>}</h3>
                                    </>)
                                }

                            </div>
                        </div>
                    </div>
                </Link>

            </>
        );
    }
};

export default ChatItem;
