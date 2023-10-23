import React from 'react';
import { Post } from '../../../../interfaces/Post';
import { UserContext, UserContextType } from '../../../../App';
import { PostFindContext, PostFindContextType } from '../../../../components/Post/PostFind/PostItem';
import { authApi, endpoints } from '../../../../configs/API';
import { IoSendSharp } from 'react-icons/io5';

interface CommentInputProps {
    post: Post
}

const CommentInput: React.FC<CommentInputProps> = (props) => {
    
    // User Context
    const userContext = React.useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = userContext;

    //Post Find Context
    const postFindContext = React.useContext<PostFindContextType | undefined>(PostFindContext);
    if (!postFindContext) {
        throw new Error("PostFindContext must be used within a PostContextProvider");
    }
    const { inputRef, setComments, totalComment, setTotalComment } = postFindContext;
    
    const { post } = props;
    const [content, setContent] = React.useState<string>("");

    const sendComment = (evt: any) => {
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
                    setContent("");
                    setComments((current: any) => {
                        return [res.data, ...current];
                    })
                    setTotalComment(totalComment + 1);
                }

            } catch (err) {
                console.error(err);
            }
        }
        addComment();
    }
    return (<>
        {
            currentUser ? <div className="flex gap-5 items-center my-5">
                <div className="w-14 h-14 border-2 border-white ring-2 ring-gray-200 rounded-full" >
                    <img
                        src={currentUser.avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-full"
                    />
                </div >
                <form onSubmit={(evt) => sendComment(evt)} className="relative w-full">
                    <input ref={inputRef} value={content} onChange={(evt) => setContent(evt.target.value)} type="text" className="block w-full px-4 py-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-blue-500" placeholder="Viết bình luận..." />
                    <button type="submit" className=" absolute right-2.5 bottom-1/2 translate-y-1/2 focus:ring-0 focus:outline-none font-medium rounded-lg text-sm px-2 py-2"><IoSendSharp className="text-primary" size={25} /></button>
                </form>
            </div > : <></>
        }

    </>);
};

export default CommentInput;
