import React from 'react';
import { IoImageOutline } from 'react-icons/io5';

const PostRentSkeleton: React.FC = () => {
    const sizes = [
        { w: 48, maxW: [480, 440, 460, 360] },
        { w: 56, maxW: [520, 480, 500, 400] },
        { w: 64, maxW: [560, 520, 540, 440] },
        { w: 72, maxW: [600, 560, 580, 480] },
        { w: 80, maxW: [640, 600, 620, 520] }
    ];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];


    return (<>
        <div role="status" className="w-full lg:h-96 h-auto bg-white rounded-xl shadow-lg overflow-hidden my-16 text-Dark animate-pulse">
            <div className="grid grid-cols-10 h-full ">
                <div className="col-span-10 h-full lg:col-span-4 flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                    <div className="text-gray-200 dark:text-gray-600">
                        <IoImageOutline size="60" />
                    </div>
                </div>

                <div className="col-span-10 lg:col-span-6 px-8 py-3 mt-4 lg:mt-0">
                    <div className="flex items-center mb-6 space-x-5">
                        <svg className="w-10 h-10 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                        <div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                            <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                    </div>
                    <div className="flex mt-3 flex-col">
                        <div className={`h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-7`}></div>
                        <div className={`h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[${randomSize.maxW[0]}px] mb-2.5`}></div>
                        <div className={`h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[${randomSize.maxW[1]}px] mb-2.5`}></div>
                        <div className={`h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[${randomSize.maxW[2]}px] mb-2.5`}></div>
                        <div className={`h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[${randomSize.maxW[3]}px] mb-2.5`}></div>
                        <div className={`h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[${randomSize.maxW[1]}px] mb-2.5`}></div>
                        <div className={`h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[${randomSize.maxW[0]}px] `}></div>

                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default PostRentSkeleton;
