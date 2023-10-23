import React from 'react';
import { Link, useParams } from 'react-router-dom';
import API, { endpoints } from '../../configs/API';
import { Post } from '../../interfaces/Post';
import MySpinner from '../../components/MySpinner';
import MyBreadCrumb from '../../components/MyBreadCumb';
import PostContent from './components/PostContent';
import ProfileCard from './components/ProfileCard';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';
import { Card } from 'flowbite-react';
import RecommendList from '../../components/RecommendList';

export type PostRentContextType = {
    post: Post,
    images: any[],
    comments: Comment[],
    setComments: any,
    total: number,
    setPage: any,
    page: number,
    motelImage: any[] | undefined
}

export const PostRentContext = React.createContext<PostRentContextType | undefined>(undefined);

const PostRentDetail: React.FC = () => {
    const { slugPost } = useParams();
    const [post, setPost] = React.useState<Post | undefined>(undefined);
    const [images, setImages] = React.useState();
    const [motelImage, setMotelImage] = React.useState();
    const [comments, setComments] = React.useState<Comment[]>([]);
    const [recommendList, setRecommendList] = React.useState();
    const hasFetched = React.useRef(false);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);

    const getComments = React.useCallback(async () => {
        if (!page || !slugPost) return;
        try {
            const url = endpoints.postComments(slugPost);

            let res = await API.get(url, {
                params: {
                    page: page
                }
            });
            if (res.status === 200) {
                setComments((current: any[]) => {
                    return [...current, ...res.data.comments]
                });
                setTotal(res.data.total);
                hasFetched.current = false;
            }

        } catch (err) {
            console.error(err);
        }
    }, [slugPost, page]);

    React.useEffect(() => {

        const getPostDetail = async () => {
            setPost(undefined);
            try {
                const url = endpoints.postInfo(slugPost);

                let res = await API.get(url);
                if (res.status === 200) {
                    setPost(res.data);
                }

            } catch (err) {
                console.error(err);
            }
        }

        const getImages = async () => {
            try {
                const url = endpoints.postImages(slugPost);

                let res = await API.get(url);
                if (res.status === 200) {
                    setImages(res.data);
                    const url = endpoints.motelImages(post?.postRentDetail.motelId.slug);

                    let rs = await API.get(url);
                    if (rs.status === 200) {
                        setMotelImage(rs.data);
                    }
                }

            } catch (err) {
                console.error(err);
            }
        }

        getPostDetail();
        getImages();
    }, [slugPost])

    React.useEffect(() => {
        if (!hasFetched.current) {
            getComments();
            hasFetched.current = true;
        }
    }, [page, getComments])

    React.useEffect(() => {
        setPage(1);
    }, [slugPost])


    React.useEffect(() => {
        const getRecomments = async () => {
            try {
                let res = await API.get(endpoints['posts'], {
                    params: {
                        page: 1,
                        longitude: post?.postRentDetail.motelId.locationLongitude,
                        latitude: post?.postRentDetail.motelId.locationLatitude,
                    }
                });
                if (res.status === 200) {
                    setRecommendList(res.data.posts);
                }
            } catch (err) {
                console.error(err);
            }
        }

        const getMotelImage = async () => {
            try {
                const url = endpoints.motelImages(post?.postRentDetail.motelId.slug);

                let res = await API.get(url);
                if (res.status === 200) {
                    setMotelImage(res.data);
                }

            } catch (err) {
                console.error(err);
            }
        }

        if (post) {
            getRecomments();
            getMotelImage();
        }
    }, [post])

    if (!post || !images) {
        return (<>
            <div className="w-full h-full flex flex-col items-center justify-center col-span-7">
                <MySpinner />
            </div>
        </>)
    }
    return (
        <PostRentContext.Provider value={{ post, images, comments, setComments, total, setPage, page, motelImage }}>
            <div className="px-5 lg:px-32">
                <MyBreadCrumb BreadCrumbName={post.title} />
                <div className="grid grid-cols-2 lg:grid-cols-7 gap-5">
                    <div className="col-span-full lg:col-span-5">
                        <PostContent />
                    </div>
                    <div className="col-span-full lg:col-span-2 flex flex-col gap-5">
                        <ProfileCard />
                        <div className='h-fit block p-3 bg-white border border-gray-200 rounded-lg shadow-md'>
                            <CommentInput />
                            {comments && (<>
                                <CommentList comments={comments} />
                                {total > comments.length &&
                                    <p onClick={() => setPage(page + 1)} className="flex font-medium w-fit my-3 gap-1 text-primary hover:underline">Xem thêm</p>
                                }
                            </>)}
                        </div >
                    </div>
                </div>
                <Card className="my-10">
                    <div className="text-xl font-bold flex">
                        <div className="text-left mr-auto">Phòng trọ gần đó</div>
                        <Link to={`/posts?location=${post.postRentDetail.motelId.fullLocation}&page=1&latitude=${post.postRentDetail.motelId.locationLatitude}&longitude=${post.postRentDetail.motelId.locationLongitude}`} className="text-right text-primary">Xem tất cả</Link>

                    </div>
                    <RecommendList recommendList={recommendList} />
                </Card>
            </div>
        </PostRentContext.Provider>
    );
};

export default PostRentDetail;
