import React from 'react';
import { HiHomeModern } from 'react-icons/hi2';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { PiClipboardFill } from 'react-icons/pi';
import { LuLogOut } from 'react-icons/lu';
import { UserContext, UserContextType } from '../../App';
import logo from "../../assets/logo.svg";

const ManagerLayout: React.FC = () => {

    const userContext = React.useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = userContext;


    return (
        <>
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>


            <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full md:translate-x-0" aria-label="Sidebar">
                <div className="h-full flex flex-col py-4 bg-dark ">
                    <Link to="/" className="mr-5 flex items-center justify-center mx-3">
                        <img
                            alt="logo"
                            className="mr-3 h-6 sm:h-9"
                            src={logo}
                        />
                        <p className="self-center whitespace-nowrap text-2xl text-primary font-bold dark:text-white">
                            Oupia
                        </p>
                    </Link>
                    <div className="px-3 my-5">
                        <div className="p-2 text-white mt-auto">
                            <div className="flex flex-col gap-4 mb-3 items-center">
                                <div className="w-28 h-28 border-[4px] border-dark ring-4 ring-primary/25 rounded-full">
                                    <img
                                        src={currentUser?.avatar}
                                        alt="Avatar"
                                        className="w-full h-full rounded-full"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg text-white truncate">{currentUser?.fullName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to="/manager/motels" className="menu-item group">
                                <div className="menu-item-child px-5 hover:bg-primary/20 ">
                                    <HiHomeModern className="flex-shrink-0 w-5 h-5 text-primary transition duration-75 group-hover:text-secondary"></HiHomeModern>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Nhà trọ</span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/manager/posts" className="menu-item group">
                                <div className="menu-item-child px-5 hover:bg-primary/20 ">
                                    <PiClipboardFill className="flex-shrink-0 w-5 h-5 text-primary transition duration-75 group-hover:text-secondary"></PiClipboardFill>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Bài đăng</span>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                    <div className="h-fit mt-auto">
                        <div className=" hover:bg-primary/20 py-2">
                            <NavLink to="/" className="group flex mx-3">
                                <LuLogOut className="flex-shrink-0 w-5 h-5 text-primary transition duration-75 group-hover:text-secondary"></LuLogOut>
                                <span className="text-white ml-3 whitespace-nowrap">Thoát trang quản lý</span>
                            </NavLink>
                        </div>
                    </div>

                </div>
            </aside>

            <div className="p-4 md:ml-64 bg-gray-100 h-screen overflow-y-auto">
                <Outlet></Outlet>
            </div>
        </>
    );
};

export default ManagerLayout;
