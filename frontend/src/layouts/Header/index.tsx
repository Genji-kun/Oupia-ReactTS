import { Avatar, Button, Dropdown, Modal, Navbar } from 'flowbite-react'
import logo from '../../assets/logo.svg'
import { Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import './style.scss'
import { FiLogOut } from 'react-icons/fi'
import { AiOutlineUser } from 'react-icons/ai'
import { LuSettings } from "react-icons/lu"
import { useContext, useEffect, useState } from 'react'
import { UserContext, UserContextType } from '../../App'
import { RiChat1Line } from 'react-icons/ri'
import { BiBell } from 'react-icons/bi'
import { HiOutlineExclamationCircle } from 'react-icons/hi2'
import { authApi, endpoints } from '../../configs/API'
import { signInWithCustomToken } from 'firebase/auth'
import { auth, db } from '../../configs/Firebase'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'


const Header: React.FC = () => {
    const userContext = useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser, dispatch } = userContext;
    const [bgColor, setBgColor] = useState(false);
    const location = useLocation();
    const bgTrans = (location.pathname === '/' || location.pathname === '/login');
    const [authToken, setAuthToken] = useState<any>();
    const [isNotice, setIsNotice] = useState(false);

    const [openModal, setOpenModal] = useState<string | undefined>();
    const props = { openModal, setOpenModal };

    const [isProcess, setIsProcess] = useState(false);

    useEffect(() => {
        if (location.pathname.startsWith('/messages')) {
            setIsNotice(false);
        }
    }, [location, isNotice]);


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setBgColor(true);
            } else {
                setBgColor(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (currentUser) {
            const getFbToken = async () => {
                const res = await authApi().get(endpoints["getAuthToken"]);
                setAuthToken(res.data);
            }

            getFbToken();
        }
    }, [currentUser])

    useEffect(() => {
        if (authToken && currentUser) {
            signInWithCustomToken(auth, authToken);
            const chatroomsRef = collection(db, 'chatrooms');
            const q = query(chatroomsRef, where('members', 'array-contains', currentUser.username), orderBy("updatedAt", "desc"));
            onSnapshot(q, (snapshot) => {
                snapshot
                setIsNotice(true);
            })

        }
    }, [authToken, currentUser]);

    if (location.pathname.includes('/manager')) {
        return (<></>);
    }

    const logOut = () => {
        dispatch({
            "type": "logout"
        })
        return (<Navigate to="/login" />)
    }

    const receiveEmail = async () => {
        setIsProcess(true);
        try {
            const res = await authApi().get(endpoints["resend-confirm"]);
            if (res.status === 200) {
                const nav = useNavigate();
                nav("/");
            }
        } catch (ex) {
            console.error(ex)
        }
    }


    return (<>
        <div className={`${bgTrans ? (bgColor ? "bg-header shadow-sm border-b border-gray-200" : "header") : "bg-header shadow-sm border-b border-gray-200"}`} >
            <Navbar
                fluid
                rounded className="py-5 bg-transparent">
                <Link to="/" className="mr-5 flex items-center">
                    <img
                        alt="logo"
                        className="mr-3 h-6 sm:h-9"
                        src={logo}
                    />
                    <p className="self-center whitespace-nowrap text-2xl text-primary font-bold dark:text-white">
                        Oupia
                    </p>
                </Link>
                {!currentUser ? (<div className="flex md:order-2 items-center">
                    <Link to="/register" className="mr-5 font-semibold hover:text-primary">
                        Đăng ký
                    </Link>
                    <Link to="/login">
                        <Button color="dark">Đăng nhập</Button>
                    </Link>
                </div>) : (<div className="flex md:order-2 items-center">
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={<BiBell size="24" className={`mr-3 text-dark mt-0.5 hover:text-primary hover:cursor-pointer`} />
                        }
                        placement='left-start'>
                        {isProcess === true ? <>
                            <div className="p-4 w-64 font-thin">
                                Đã gửi Email. <span onClick={receiveEmail} className="font-bold underline hover:text-primary hover:cursor-pointer">Gửi lại</span>
                            </div>
                        </> : <>
                            {(currentUser.isConfirm !== true) ?
                                <>
                                    {console.log(currentUser)}
                                    <div className="p-4 w-64 font-thin">
                                        Hãy xác nhận Email để nhận được thông báo từ Oupia. <span onClick={receiveEmail} className="font-bold underline hover:text-primary hover:cursor-pointer">Xác nhận</span>
                                    </div>
                                </> : <>
                                    {console.log(currentUser)}
                                    <div className="p-4 w-64 font-thin text-center">Đã xác thực Email</div>
                                </>}
                        </>}

                    </Dropdown>
                    <Link to="/messages">
                        <div className="relative mr-3">
                            <RiChat1Line size="24" className={` text-dark  hover:text-primary hover:cursor-pointer`}>
                            </RiChat1Line>
                            {isNotice && <span className="top-0 left-3 absolute  w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
                        </div>
                    </Link>

                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={<div className="z-999 w-12 h-12 ring-2 mx-auto ring-gray-200 border-2 border-transparent rounded-full">
                            <img
                                src={currentUser.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full"
                            />
                        </div>}
                        className="no-padding rounded-md border-0 shadow-2xl w-80"
                    >
                        <Dropdown.Header >
                            <div className="flex gap-5 items-center">
                                <Avatar size="lg" className="my-3 h-20" alt="Avatar" img={currentUser.avatar} rounded />
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg text-dark font-bold truncate">
                                        {currentUser.fullName}
                                    </span>
                                    <span className="text-sm text-gray-500 text-gray">
                                        @{currentUser.username}
                                    </span>
                                </div>
                            </div>
                        </Dropdown.Header>

                        <Link to={`/${currentUser.username}`} className="hover:text-white">
                            <div className="items-center px-8 py-3 flex p-2 hover:bg-primary ">
                                <AiOutlineUser size="20" className="mr-2" />
                                <p className="text-sm">Trang cá nhân</p>
                            </div>
                        </Link>
                        <Link to="/settings" className="hover:text-white">
                            <div className="items-center px-8 py-3 flex p-2 hover:bg-primary ">
                                <LuSettings size="20" className="mr-2" />
                                <p className="text-sm">Cài đặt</p>
                            </div>
                        </Link>
                        <Dropdown.Divider className="bg-gray-100" />
                        <div onClick={logOut} className="hover:text-white hover:cursor-pointer">
                            <div className="items-center px-8 py-3 flex p-2 hover:bg-primary hover:rounded-b-md">
                                <FiLogOut size="20" className="mr-2" />
                                <p className="text-sm">Đăng xuất</p>
                            </div>
                        </div>
                    </Dropdown>
                </div>)}

                <Navbar.Collapse >
                    <NavLink to="/" className="nav-item">
                        Trang chủ
                    </NavLink>

                    <NavLink to="/posts" className="nav-item">
                        Tìm trọ
                    </NavLink>

                    <NavLink to="/forum" className="nav-item">
                        Diễn đàn
                    </NavLink>
                    {currentUser && (<>
                        {currentUser.userRole === "LANDLORD" ? <>
                            <p className="nav-item cursor-pointer" onClick={() => props.setOpenModal('pop-up')}>
                                Quản lý
                            </p>

                            <Modal show={props.openModal === 'pop-up'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
                                <Modal.Header />
                                <Modal.Body>
                                    <div className="text-center">
                                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                            Bạn muốn chuyển qua trang quản lý của chủ trọ không?
                                        </h3>
                                        <div className="flex justify-center gap-4">
                                            <Link to="/manager">
                                                <Button className="bg-primary enabled:hover:bg-secondary" onClick={() => props.setOpenModal(undefined)}>
                                                    Chuyển trang
                                                </Button>
                                            </Link>
                                            <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
                                                Hủy
                                            </Button>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </> : <>
                            <NavLink to="/upload" className="nav-item">
                                Đăng bài
                            </NavLink></>}

                    </>)}

                </Navbar.Collapse>
            </Navbar>
        </div>
        {<div className="py-9 mt-3"></div>}
    </>);
};

export default Header;