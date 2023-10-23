import React from 'react';
import formatCurrency from '../../../../utils/priceUtils';
import { Link } from 'react-router-dom';
import { LiaHomeSolid } from 'react-icons/lia';
import { GrLocation } from 'react-icons/gr';

interface PostMessageProps { 
    post : any,
}

const PostMessage: React.FC<PostMessageProps> = (props) => {
    const { post } = props;
    const price = formatCurrency(post.postRentDetail.price);

    return (
        <Link to={`/posts/${post.slug}`}>
            <div className="w-[48rem] ml-auto">
                <div className="grid grid-cols-10 gap-2 bg-white shadow-sm h-fit border rounded-lg">
                    <div className="col-span-4 lg:col-span-3 h-40 md:h-52 lg:h-60">
                        <img src={post.image} className="object-cover h-full w-full rounded-l" />
                    </div>
                    <div className="h-fit col-span-6 lg:col-span-7 p-3">
                        <h1 className="font-bold text-lg">{post.title}</h1>
                        <h1 className="text-primary text-lg">Giá: {price}đ/tháng</h1>
                        <Link to="" className="block mt-1 text-lg leading-tight font-medium hover:underline text-Dark flex gap-3 mt-2">
                            <LiaHomeSolid size="17" />
                            <p className="text-sm">{post.postRentDetail.motelId.name}</p>
                        </Link>
                        <Link to="" className="block mt-1 text-lg leading-tight font-medium hover:underline text-Dark flex gap-3 mt-2">
                            <GrLocation />
                            <p className="text-sm">{post.postRentDetail.motelId.fullLocation}</p>
                        </Link>

                    </div>
                </div>
            </div>
        </Link>

    );
};

export default PostMessage;
