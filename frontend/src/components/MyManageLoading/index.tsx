import { Navbar } from 'flowbite-react';
import React from 'react';
import logo from '../../assets/logo.svg';

const MyManageLoading: React.FC = () => {
    return (
        <>
            <div className="fixed z-100 h-screen w-screen flex items-center justify-center">
                <div className='flex flex-col w-1/2 items-center gap-10'>
                    <div className="flex gap-5 items-center">
                        <div>
                            <Navbar.Brand className="mx-auto">
                                <img
                                    alt="Oupia Logo"
                                    className="mr-3 h-10 sm:h-12"
                                    src={logo}
                                />
                                <p className="self-center whitespace-nowrap text-4xl text-primary font-bold dark:text-white">
                                    Oupia
                                </p>
                            </Navbar.Brand>
                        </div>
                        <div>
                            <h1 className="text-white font-semibold px-5 py-2 text-2xl bg-dark rounded-xl">Quản lý</h1>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full w-[45%]"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyManageLoading;
