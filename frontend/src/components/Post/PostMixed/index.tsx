import PostFindItem from "../PostFind/PostItem";
import PostRentItem from "../PostRent/PostItem";

type PostsProps = {
    posts: any[],
}


const PostList: React.FC<PostsProps> = (props) => {
    const { posts } = props;

    return (
        <>
            {posts.map((post: any, index: number) => (
                <div key={index}>
                    {(post && post.postFindDetail != null) ? <PostFindItem post={post}></PostFindItem> : <PostRentItem  post={post}></PostRentItem>}
                </div>
            ))}
        </>

    );
}

export default PostList;
