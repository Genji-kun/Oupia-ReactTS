import React, { useEffect, useState } from 'react';
import { Badge, Button } from 'flowbite-react';

import moment from 'moment';
import 'moment/locale/vi';
import { PiDotBold, PiStarBold } from 'react-icons/pi';
import { LiaHomeSolid } from 'react-icons/lia';
import { GrLocation } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { Post } from '../../../../interfaces/Post';
import formatCurrency from '../../../../utils/priceUtils';
import API, { endpoints } from '../../../../configs/API';

moment.locale('vi');

type PostRentProps = {
    post: Post,
}

const getColor = (distance: number) => {
    if (distance < 5) {
        return "success";
    } else if (distance < 8) {
        return "warning";
    } else {
        return "failure";
    }
}


const PostRentItem: React.FC<PostRentProps> = (props) => {
    const { post } = props;
    const price = formatCurrency(post.postRentDetail.price);

    const [rateStats, setRateStats] = useState<any>();
    const [rateTotal, setRateTotal] = useState<number>(0);

    useEffect(() => {
        const getRates = async () => {
            try {
                let res = await API.get(endpoints["rates-motels-stats"], {
                    params: {
                        'motelId': post.postRentDetail.motelId.id,
                    }
                });
                if (res.status === 200) {
                    setRateStats(res.data);
                    const detail = res.data.details;
                    let sum = Object.values(detail).reduce((a: any, b: any) => Number(a) + Number(b), 0);
                    setRateTotal(Number(sum));
                }

            } catch (err) {
                console.error(err);
            }
        }

        
        if (post.postRentDetail.motelId) {
            getRates();
        }
    }, [])

    return (<>
        <div className="w-full lg:h-96 h-auto bg-white rounded-xl shadow-lg overflow-hidden my-10 text-Dark relative border border-gray-200">
            <div className="grid grid-cols-10 h-full">
                <div className="col-span-10 lg:col-span-4">
                    <img className="h-80 w-full object-cover lg:h-full" src={post.image} alt="postimage" />
                </div>
                <div className="col-span-10 lg:col-span-6 px-8 py-3 mt-4 lg:mt-0">
                    <div className="flex gap-4 mb-3 items-center">
                        <div className="w-14 h-14 border-2 border-white ring-2 ring-gray-200 rounded-full">
                            <img
                                src={post.userId.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full"
                            />
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="w-fit">
                                <p className="font-semibold text-sm">{post.userId.fullName}</p>
                                <p className="text-sm text-gray-500">{moment(post.createdAt?.toString()).fromNow()}</p>
                            </div>
                            <div>
                                {post.postRentDetail.motelId.distance != null && (<p>
                                    <Badge color={getColor(parseFloat(post.postRentDetail.motelId.distance))}>
                                        {parseFloat(post.postRentDetail.motelId.distance).toFixed(2)} km
                                    </Badge>
                                </p>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className="text-lg uppercase font-bold mt-5 tracking-wide font-semibold mb-2 text-Dark line-clamp-1">{post.title}</div>
                    <h1 className="text-primary text-lg">Giá: {price}đ/tháng</h1>
                    <div className="flex mt-1 items-center">
                        <div className="flex text-primary gap-2">
                            <PiStarBold />
                            <p className="text-sm">{rateStats?.avg ? rateStats?.avg : 0} <span>({rateTotal})</span></p>
                        </div>
                        <PiDotBold size="24" className="mx-3 text-Dark" />
                        <Link to={`/motels/${post.postRentDetail.motelId.slug}/posts`} className="block mt-1 text-lg leading-tight font-medium hover:underline text-Dark flex gap-3 mt-2">
                            <div className="flex gap-2">
                                <LiaHomeSolid size="17" />
                                <p className="text-sm">{post.postRentDetail.motelId.name}</p>
                            </div>
                        </Link>
                    </div>
                    <div className="block mt-1 text-lg leading-tight font-medium text-dark flex gap-3 mt-2">
                        <GrLocation />
                        <p className="text-sm">{post.postRentDetail.motelId.fullLocation}</p>
                    </div>
                    <p className="mt-3 text-gray-500 line-clamp-3 text-justify text-sm">{post.description}</p>
                    <Link to={`/posts/${post.slug}`} className="absolute right-6 bottom-6">
                        <Button className="bg-primary enabled:hover:bg-secondary">
                            <div className="flex items-center">
                                <p>
                                    Xem chi tiết
                                </p>
                                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                            </div>
                        </Button>
                    </Link>

                </div>
            </div>
        </div>
    </>)
};

export default PostRentItem;