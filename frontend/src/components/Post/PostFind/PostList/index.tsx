import PostFindItem from "../PostItem";

type PostsProps = {
    posts: any[],
}


const PostFindList: React.FC<PostsProps> = (props) => {
    const { posts } = props;

    if (!posts) {
        return (<></>);
    }

    return (
        <>
            {posts.map((post: any, index: number) => (
                <div key={index}>
                    {post && <PostFindItem post={post}></PostFindItem>}
                </div>
            ))}
        </>

    );
}

export default PostFindList;
