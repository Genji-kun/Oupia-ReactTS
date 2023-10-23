import React from 'react';
import "./style.scss";
import { IoHome } from "react-icons/io5";
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col h-screen items-center">
            <div className="relative">
                <img className="w-full" src="https://cdn.svgator.com/images/2022/01/funny-404-error-page-design.gif" alt='404 Not Found' />
                <h1 className="text-5xl text-primary font-bold left-50 absolute translate-y-1/2 translate-x-1/2 bottom-16 right-1/2">404 Not Found</h1>
            </div>
            <p className="text-lg italic">Đường dẫn bạn truy cập có thể bị sai, hoặc đã gỡ trên trang Oupia</p>
            <Link to="/" className="mt-5">
                <Button color="dark">
                    <IoHome className="mr-2 h-5 w-5" />
                    <p>
                        Về trang chủ
                    </p>
                </Button>
            </Link>
        </div >
    );
};

export default NotFound;