import React, { useContext } from 'react'
import { Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { FaRegHandPointRight } from 'react-icons/fa6'
import { FiEdit } from 'react-icons/fi'
import { UserContext, UserContextType } from '../../../../App'

const UserStatus:React.FC = () => {
    const context = useContext<UserContextType | undefined>(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = context;


    if (!currentUser) {
        return <>
            <div className=" border border-gray-200 rounded-xl shadow p-5 flex gap-5 items-center">

                <h2 className="mx-auto text-lg">
                    Vui lòng đăng nhập để đăng bài viết.<span className="text-primary font-bold ml-2 hover:text-secondary"><Link to="/login?next=/forum">Đăng nhập</Link></span>
                </h2>
            </div>
        </>
    }

    if (currentUser.userRole !== "TENANT") {
        return <>
            
        </>
    }
    return (<>
        <div className=" border border-gray-200 rounded-xl shadow p-5 flex gap-5 items-center">

            <div className="w-16 h-16">
                <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="w-full h-full rounded-full ring-4 ring-gray-200 border-4 border-transparent rounded-full"
                />
            </div>
            <h2 className="text-Dark font-bold text-lg flex gap-3 items-center">Đăng các bài tìm trọ để chủ trọ tìm thấy bạn! <FaRegHandPointRight className="me-0 ms-auto"/> </h2>

            <Link to="/upload" className="ml-auto">
                <Button color="dark" className="ring-2 ring-dark ">
                    <div className="flex gap-3 items-center">
                        <FiEdit size="20" className="text-white" />
                        <p className="font-bold mt-1">Đăng bài mới</p>
                    </div>
                </Button>
            </Link>

        </div>
    </>);
};

export default UserStatus;