import React from 'react';
import { PostFindContext, PostFindContextType } from '../../../../components/Post/PostFind/PostItem';
import CommentItem from '../CommentItem';

const CommentList: React.FC = () => {
    const postFindContext = React.useContext<PostFindContextType | undefined>(PostFindContext);
    if (!postFindContext) {
        throw new Error("UserContext must be used within a PostFindContextProvider");
    }

    const { setPage, totalComment, comments } = postFindContext;

    const handleNextPage = () => {
        setPage((prev: number) => prev + 1);
    }

    return (
        <>
            <div className="w-fit commentList overflow-y-auto w-full max-h-96">
                {comments && comments.map((comment, index) => (
                    <CommentItem key={index} comment={comment}></CommentItem>
                ))}

            </div>

            {totalComment > comments.length ? <>
                <div className="z-100 w-full bg-white pt-4 absoblute left-0 bottom-0">
                    <h1 className="font-bold text-sm cursor-pointer hover:text-primary" onClick={handleNextPage}>Xem thêm bình luận</h1>
                </div>
            </> : <></>}
        </>
    );
};

export default CommentList;
