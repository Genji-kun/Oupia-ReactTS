import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import { Button, Dropdown } from 'flowbite-react'
import { PiHeart, PiHeartFill } from 'react-icons/pi'
import { BiComment } from 'react-icons/bi'
import { FiMoreHorizontal } from 'react-icons/fi'
import { Post } from '../../../../interfaces/Post'
import formatCurrency from '../../../../utils/priceUtils'
import API, { authApi, endpoints } from '../../../../configs/API'
import { UserContext, UserContextType } from '../../../../App'
import moment from 'moment'
import { useDebounce } from 'use-debounce'
import { Favourite } from '../../../../interfaces/Favourite'
import CommentInput from '../../../../pages/Forum/components/CommentInput'
import CommentList from '../../../../pages/Forum/components/CommentList'
import { Comment } from '../../../../interfaces/Comment'
import { LuEraser } from 'react-icons/lu'

type PostFindProps = {
    post: Post,
}

export interface PostFindContextType {
    comments: Comment[],
    setComments: any,
    inputRef: any,
    page: number,
    setPage: any,
    totalComment: number,
    setTotalComment: any
}

export const PostFindContext = React.createContext<PostFindContextType | undefined>(undefined);

const PostFindItem: React.FC<PostFindProps> = (props) => {
    const { post } = props;

    const userContext = React.useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }

    const { currentUser } = userContext;

    const [comments, setComments] = React.useState<Comment[]>([]);
    const [totalComment, setTotalComment] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const hasFetched = React.useRef(false);

    const [favour, setFavour] = React.useState<Favourite | null>(null);
    const [favourTemp, setFavourTemp] = React.useState(false);
    const [debouncedFavourTemp] = useDebounce(favourTemp, 1000);

    const [totalFavour, setTotalFavour] = React.useState<number>(0);
    const [totalFavourTemp, setTotalFavourTemp] = React.useState<number>(0);


    const minPrice = formatCurrency(post.postFindDetail.minPrice);
    const maxPrice = formatCurrency(post.postFindDetail.maxPrice);
    const area = post.postFindDetail.location;


    const [isFirstRender, setIsFirstRender] = React.useState(true);

    React.useEffect(() => {
        const getComments = async () => {
            try {
                const url = endpoints.postComments(post.slug);
                let res = await API.get(url, {
                    params: {
                        page: page,
                    }
                });
                if (res.status === 200) {
                    setComments((c: any[]) => [...c, ...res.data.comments]);
                    setTotalComment(res.data.total);
                    hasFetched.current = false;
                }

            } catch (err) {
                console.error(err);
            }
        }
        if (post && !hasFetched.current) {
            getComments();
            hasFetched.current = true;
        }
    }, [post, page])

    React.useEffect(() => {
        const getFavourCountAndStatus = async () => {
            const res = await API.get(endpoints["favourCount"], {
                params: {
                    postId: post.id,
                    userId: currentUser ? currentUser.id : null,
                }
            })

            if (res.status === 200) {
                setTotalFavour(res.data.total);
                setFavour(res.data.favour);
                setFavourTemp(res.data.favour ? true : false);
            }
        }
        getFavourCountAndStatus();
        if (!currentUser) {
            setFavourTemp(false);
        }
    }, [currentUser])

    const hasFetchedFavour = React.useRef(false);

    React.useEffect(() => {
        setTotalFavourTemp(totalFavour);
    }, [totalFavour]);

    React.useEffect(() => {
        const addFavour = async () => {
            try {
                const favourite = {
                    postId: post,
                }
                const res = await authApi().post(endpoints["favour"], favourite);

                if (res.status === 201 || res.status === 302) {
                    setFavour(res.data);
                    hasFetchedFavour.current = false;
                }

            } catch (err) {
                console.error(err);
            }
        }

        const removeFavour = async () => {
            try {
                const res = await authApi().delete(endpoints["favour"], {
                    params: {
                        favId: favour?.id
                    }
                });

                if (res.status === 204) {
                    setFavour(null);
                    hasFetchedFavour.current = false;
                }

            } catch (err) {
                console.error(err);
            }
        }
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        if (!hasFetchedFavour.current) {
            if (debouncedFavourTemp && !favour) {
                addFavour();
                hasFetchedFavour.current = true;
            }
            else if (!debouncedFavourTemp && favour) {
                removeFavour();
                hasFetchedFavour.current = true;
            }
        }

    }, [debouncedFavourTemp])

    const [isDeleted, setIsDeleted] = React.useState(false);
    const removePost = async () => {
        if (post)
            try {
                const url = endpoints.postInfo(post.slug);
                const res = await authApi().delete(url);

                if (res.status === 204) {
                    setIsDeleted(true);
                }


            } catch (err) {
                console.error(err);
            }
    }

    if (isDeleted || !comments) {
        return <></>
    }

    return (<>
        <PostFindContext.Provider value={{ comments, setComments, inputRef, page, setPage, totalComment, setTotalComment }}>
            <div className=" border border-gray-200 rounded-xl shadow p-5 flex gap-5 flex flex-col my-5">
                <div className="flex gap-5 items-center">
                    <Link to={`/${post.userId.username}`}>
                        <div className=" z-999 w-16 h-16 ring-2 mx-auto ring-gray-200 border-2 border-transparent rounded-full">
                            <img
                                src={post.userId.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full"
                            />
                        </div>
                    </Link>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold text-lg"><Link to={`/${post.userId.username}`}>{post.userId.fullName}</Link></h1>
                        <h3 className="text-gray-500 text-sm"> {moment(post.createdAt?.toString()).fromNow()}</h3>
                    </div>
                    <div className="flex gap-2 ml-auto pb-3 pr-3 text-Dark hover:cursor-pointer">
                        {currentUser?.id === post.userId.id && <Dropdown inline arrowIcon={false} label={<FiMoreHorizontal size="35" />} placement="left-start">
                            <Dropdown.Item className="px-5 enabled:hover:text-red-600">
                                <div className="flex gap-3 items-center" onClick={() => { removePost() }}>
                                    <LuEraser size="24" />
                                    <h3 className="font-semibold">Xóa bài viết</h3>
                                </div>
                            </Dropdown.Item>
                        </Dropdown>}


                    </div>
                </div>

                <div >
                    <h2 className="text-2xl font-bold">
                        {post.title}
                    </h2>
                    <h3 className="mt-5">Giá đề xuất: <span className="text-primary font-bold">{minPrice} - {maxPrice}đ/tháng</span></h3>
                    <h3 className="mb-5">Khu vực: {area}</h3>
                    <p>
                        {post.description}
                    </p>
                </div>

                {post.image && <div className="post-image -ml-5">
                    <img src={post.image}
                        alt="postImage" className="w-full h-[600px] object-cover" />
                </div>}

                <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                        <div className="flex gap-1 items-center">
                            <PiHeartFill size="25" className="text-like" />
                            <h2>{totalFavourTemp}</h2>
                        </div>
                        <h2 className="ml-auto">{totalComment > 0 ? totalComment + " bình luận" : ""}</h2>
                    </div>
                    {currentUser ? <>
                        <hr />
                        <div className="w-full grid grid-cols-2">
                            <Button onClick={() => { favourTemp ? setTotalFavourTemp(totalFavourTemp - 1) : setTotalFavourTemp(totalFavourTemp + 1); setFavourTemp(!favourTemp); }} size="sm" className="bg-transparent text-dark enabled:hover:bg-gray-200 enabled:hover:text-like focus:ring-transparent">
                                {favourTemp ? <div className="flex gap-3 items-center rounded py-2 px-4 text-like">
                                    <PiHeartFill size="25" />
                                    <h3 className="text-lg">Yêu thích</h3>
                                </div> : <div className="flex gap-3 items-center rounded py-2 px-4 text-Dark">
                                    <PiHeart size="25" />
                                    <h3 className="text-lg">Yêu thích</h3>
                                </div>}
                            </Button>
                            <Button size="sm" onClick={() => { inputRef.current?.focus() }} className="bg-transparent text-dark enabled:hover:bg-gray-200 enabled:hover:text-primary focus:ring-transparent">
                                <div className="flex gap-3 items-center rounded py-2 px-4 text-Dark">
                                    <BiComment size="25" />
                                    <h3 className="text-lg">Bình luận</h3>
                                </div>
                            </Button>
                        </div>
                        <hr />
                    </> : <>  <hr className="my-5" /></>}
                    <div>
                        <div className='h-fit block bg-white relative'>
                            <CommentInput post={post} />
                            {comments && <CommentList />}
                        </div >
                    </div>
                </div>
            </div>
        </PostFindContext.Provider>
    </>);
};

export default PostFindItem;