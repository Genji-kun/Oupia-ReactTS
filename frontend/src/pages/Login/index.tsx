import React, { useContext, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import API, { authApi, endpoints } from '../../configs/API'
import cookies from 'react-cookies'
import { Button, Card, Navbar, Spinner } from 'flowbite-react'
import logo from '../../assets/logo.svg'
import { UserContext, UserContextType } from '../../App'
import './style.scss'
import { FcGoogle } from "react-icons/fc"


const Login: React.FC = () => {
    const context = useContext<UserContextType | undefined>(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser, dispatch } = context;
    const [Msg, setMsg] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [q] = useSearchParams();
    const login = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setMsg(false);
        setLoading(true);
        const process = async () => {
            try {
                let res = await API.post(endpoints['login'], {
                    "username": username,
                    "password": password
                });
                if (res.status === 404) {
                    alert("User không tồn tại");
                    return;
                }
                if (res.status === 403) {
                    alert("User chưa được duyệt");
                    return;
                }
                cookies.save("token", res.data, {});
                let { data } = await authApi().get(endpoints['current-user']);
                cookies.save("user", data, {});

                dispatch({
                    "type": "login",
                    "payload": data
                });
            } catch (err) {
                setLoading(false);
                setMsg(true);
            }
        }
        process();
    }

    if (currentUser !== null) {
        let next = q.get("next") || "/";
        return <Navigate to={next} />
    }

    return (<>
        <div className="bg-login bg-cover items-center">
            <Card className="w-full sm:w-1/2  lg:w-1/4 border-transparent pb-10 pt-7 shadow-lg">
                <Navbar.Brand className="mx-auto">
                    <img
                        alt="Oupia Logo"
                        className="mr-3 h-7 sm:h-10"
                        src={logo}
                    />
                    <p className="self-center whitespace-nowrap text-3xl text-primary font-bold dark:text-white">
                        Oupia
                    </p>
                </Navbar.Brand>
                <form onSubmit={(evt: React.FormEvent<HTMLFormElement>) => login(evt)} className="flex flex-col gap-4 mt-8">
                    <div>
                        <div className="relative">
                            <input onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value)} type="text" id="username" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary " placeholder=" " />
                            <label htmlFor="default_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-primary -focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Tên người dùng</label>
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <input onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value)} type="password" id="password" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary " placeholder=" " />
                            <label htmlFor="default_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Mật khẩu</label>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        {loading !== false ?
                            <Spinner
                                size="lg" className="my-2 fill-primary" />
                            :
                            <Button type="submit" className="bg-primary w-full text-primary enabled:hover:bg-secondary focus:ring-2 focus:ring-secondary">
                                <p className="font-bold text-white text-base">Đăng nhập</p>
                            </Button>
                        }
                    </div>
                    {Msg === true ? <h3 className="text-red-600 w-full text-center text-sm">Tài khoản hoặc mật khẩu không đúng</h3> : <></>}
                </form>
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">hoặc đăng nhập với</span>
                </div>
                <div className="w-full">
                    <Button color="dark" outline className="items-center rounded-lg fill-primary mx-auto">
                        <FcGoogle className="mr-2 h-5 w-5" />
                        <p className="text-Dark">
                            Đăng nhập bằng Google
                        </p>
                    </Button>
                </div>
                <p className="font-thin text-sm mx-auto text-gray-900">Chưa có tài khoản? <Link to="/register" className="font-bold">Đăng ký ngay</Link></p>
            </Card>
        </div>
    </>);
}

export default Login;