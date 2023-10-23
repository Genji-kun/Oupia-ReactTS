import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom/dist';
import { BiCaretDown } from 'react-icons/bi';
import MySpinner from '../../../components/MySpinner';
import API, { endpoints } from '../../../configs/API';
import PostList from '../../../components/Post/PostMixed';


const ProfilePosts: React.FC = () => {
    const { slugUser } = useParams();
    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const hasFetched = useRef(false);


    useEffect(() => {
        const getPosts = async () => {
            try {
                let res = await API.get(endpoints['posts'], {
                    params: {
                        username: slugUser,
                        page: page,
                    }
                });
                if (res.status === 200) {
                    setTotal(res.data.total);
                    setPosts((current: any[]) => {
                        return [...current, ...res.data.posts]
                    });
                    hasFetched.current = false;
                }

            } catch (err) {
                console.error(err);
            }
        }
        if (page && slugUser && !hasFetched.current) {
            getPosts();
            hasFetched.current = true;
        }
    }, [page, slugUser])

    if (posts === null) {
        return <>
            <div className="h-32 w-full items-center flex flex-col ">
                <MySpinner />
            </div>
        </>
    }

    return (
        <>
            <PostList posts={posts}></PostList>
            {
                posts.length < total && (<>
                    <div className="flex justify-center">
                        <button onClick={() => setPage(page + 1)} className="flex font-medium w-fit my-3 gap-1 text-primary hover:underline">Xem thêm <BiCaretDown size={20} /></button>
                    </div>
                </>)
            }

        </>

    );
};

export default ProfilePosts;