import { Label, TextInput } from 'flowbite-react';
import React from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { RegisterContext, RegisterContextType } from '../..';

const StepThreeRegister: React.FC = () => {

    const registerContext = React.useContext<RegisterContextType | undefined>(RegisterContext);
    if (!registerContext) {
        throw new Error("RegisterContext must be used within a RegisterContextProvider");
    }
    const { user, setUser, avatar, setAvatar, setAvatarFile, errors } = registerContext;

    const changeUser = (value: any, field: string) => {
        setUser((current: any) => {
            return { ...current, [field]: value }
        })
    }

    const handleFileChange = (evt: any) => {
        if (evt.target.files && evt.target.files[0]) {
            const file = evt.target.files[0];
            const fileURL = URL.createObjectURL(file);
            setAvatar(fileURL);
            setAvatarFile(evt.target.files);
        }
    };

    return (
        <>
            <div className="w-40 h-40 ring-[4px] border-[4px] border-white ring-gray-200 rounded-full mx-auto relative">
                <img
                    src={avatar ? avatar : 'https://pixlok.com/wp-content/uploads/2021/03/default-user-profile-picture.jpg'}
                    alt="Avatar"
                    className="w-full h-full rounded-full"
                />
                <div className="absolute right-0 bottom-0">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="avatar" className="flex items-center justify-center w-10 h-10 bg-dark rounded-full cursor-pointer dark:hover:bg-darker dark:bg-white hover:bg-primary dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <BiImageAdd className="text-white" size="25"></BiImageAdd>
                            <input id="avatar" type="file" className="hidden" accept='image/*' onChange={(evt) =>handleFileChange(evt)} />
                        </label>
                    </div>

                </div>

            </div>
            <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-center">{!avatar && 'Phải có ảnh đại diện'}</p>

            <div className="mt-5">
                <div className="mb-2 block flex gap-0.5">
                    <Label className="text-lg" htmlFor="username" value="Tên người dùng" />
                    <h1 className="text-lg text-red-600">*</h1>
                </div>
                <TextInput id="username" name="username" value={user?.username} required shadow type="text" onChange={(e: any) => changeUser(e.target.value, e.target.name)} />
                <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.user && errors.user.username}</p>

            </div>
            <div className="grid grid-cols-2 gap-5 mt-3">
                <div>
                    <div className="mb-2 block flex gap-0.5">
                        <Label className="text-lg" htmlFor="password" value="Mật khẩu" />
                        <h1 className="text-lg text-red-600">*</h1>
                    </div>
                    <TextInput id="password" name="password" value={user?.password} required shadow type="password" onChange={(e: any) => changeUser(e.target.value, e.target.name)} />
                    <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.user && errors.user.password}</p>
                </div>
                <div>
                    <div className="mb-2 block flex gap-0.5">
                        <Label className="text-lg" htmlFor="confirmPass" value="Xác nhận mật khẩu" />
                        <h1 className="text-lg text-red-600">*</h1>
                    </div>
                    <TextInput id="confirmPass" name="confirmPassword" value={user?.confirmPassword} required shadow type="password" onChange={(e: any) => changeUser(e.target.value, e.target.name)} />
                    <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.user && errors.user.confirmPassword}</p>

                </div>
            </div>

        </>
    );
};

export default StepThreeRegister;
