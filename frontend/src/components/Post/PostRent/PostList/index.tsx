import { Post } from "../../../../interfaces/Post";
import PostRentSkeleton from "../../../MySkeleton/PostRentSkeleton";
import PostRentItem from "../PostItem";

type PostsProps = {
    posts: Post[] | null,
}


const PostRentList: React.FC<PostsProps> = (props) => {
    const { posts } = props;
    const numSkeletons = Math.floor(Math.random() * (2)) + 3;
    const skeletons = Array.from({ length: numSkeletons });


    if (!posts) return (
        <>
            {skeletons.map((_, index) => (
                <PostRentSkeleton key={index} />
            ))}
        </>
    )

    return (
        <>
            {posts.map((post, index: number) => (
                <div key={index}>
                    {post.postRentDetail != null && <PostRentItem  post={post}></PostRentItem>}
                </div>
            ))}
        </>

    );
}

export default PostRentList;
