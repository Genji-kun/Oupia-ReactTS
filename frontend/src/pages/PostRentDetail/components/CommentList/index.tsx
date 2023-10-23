import React from 'react';
import { Comment } from '../../../../interfaces/Comment';
import CommentItem from '../CommentItem';

interface CommentListProps {
  comments: any[],
}

const CommentList: React.FC<CommentListProps> = (props) => {
  const { comments } = props;
  return (
    <>
      <div className="w-fit commentList overflow-y-auto w-full mt-5">
        {comments.map((comment: Comment, index: number) => (
          <CommentItem key={index} comment={comment}></CommentItem>
        ))}
      </div>
    </>
  )
};

export default CommentList;
