import React, { useEffect, useRef, useState } from 'react';
import API, { endpoints } from '../../configs/API';
import MyBreadCrumb from '../../components/MyBreadCumb';
import UserStatus from './components/UserStatus';
import PostFindList from '../../components/Post/PostFind/PostList';
import { Link } from 'react-router-dom';
import { BiCaretDown } from 'react-icons/bi';
import { Post } from '../../interfaces/Post';

const Forum: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const hasFetched = useRef(false);


    useEffect(() => {
        if (page) {
            const getPosts = async () => {
                try {
                    let res = await API.get(endpoints['posts'], {
                        params: {
                            type: "tenantPost",
                            isDeleted: "0",
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
            if (!hasFetched.current) {
                getPosts();
                hasFetched.current = true;
            }
        }
    }, [page]);

    if (!posts) {
        return <></>
    }

    return (<>
        <div className="mx-20">
            <MyBreadCrumb BreadCrumbName="Diễn đàn" />
            <div className=" my-5 ">
                <div className="col-span-5 flex flex-col gap-5">
                    <UserStatus />
                    <PostFindList posts={posts} />
                    {posts.length < total && (<>
                        <div className="flex justify-center">
                            <Link to="" onClick={() => setPage(page + 1)} className="flex font-medium w-fit my-3 gap-1 text-primary hover:underline">Xem thêm <BiCaretDown size={20} /></Link>
                        </div>
                    </>)}
                </div>
            </div>
        </div>
    </>);
};

export default Forum;
