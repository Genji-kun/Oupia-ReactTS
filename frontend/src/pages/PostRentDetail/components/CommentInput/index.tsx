import { Avatar, Label } from 'flowbite-react';
import React from 'react';
import { authApi, endpoints } from '../../../../configs/API';
import { PostRentContext, PostRentContextType } from '../..';
import { UserContext, UserContextType } from '../../../../App';
import { IoSendSharp } from 'react-icons/io5';


const CommentInput: React.FC = () => {

    const postRentContext = React.useContext<PostRentContextType | undefined>(PostRentContext);
    if (!postRentContext) {
        throw new Error("PostRentContext must be used within a PostRentContextProvider");
    }
    const { post, setComments } = postRentContext;

    const userContext = React.useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = userContext;


    const [content, setContent] = React.useState<string>("");

    const sendComment = (evt : any) => {
        evt.preventDefault();
        if (!content)
            return;
        const comment = {
            content: content,
            postId: post,
        }

        const addComment = async () => {
            try {
                let res = await authApi().post(endpoints["addComment"], comment);
                if (res.status === 201) {
                    setComments((current: any) => {
                        return [res.data, ...current]
                    })
                }

            } catch (err) {
                console.error(err);
            }
        }
        addComment();
    }
    return (
        <>
            {currentUser ?
                <div className="flex gap-2 items-start w-full">
                    <Avatar className="w-fit my-1" alt="User Avatar" img={currentUser.avatar} size="md" rounded />
                    <div className="flex-grow mr-2">
                        <div className=" block">
                            <Label
                                htmlFor="comment"
                                value=""
                            />
                        </div>
                        <form onSubmit={(evt) => sendComment(evt)} className="relative">
                            <input value={content} id="comment" onChange={(e : any) => setContent(e.target.value)} className="block w-full px-4 pr-16 py-3 text-sm text-gray-900 border-2 rounded-lg bg-gray-50 border-primary focus:border-secondary" placeholder="Nhập bình luận" />
                            <button type="submit" className="text-white absolute right-2.5 bottom-1/2 translate-y-1/2 focus:ring-0 focus:outline-none font-medium rounded-lg text-sm px-2 py-2"><IoSendSharp className="text-primary" size={25} /></button>
                        </form>
                    </div>
                </div>
                :
                <div className="flex w-full">
                    Đăng nhập để bình luận
                </div>
            }
        </>
    )
};

export default CommentInput;
