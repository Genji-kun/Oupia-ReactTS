import { Label, Select, TextInput } from 'flowbite-react';
import React from 'react';
import { RegisterContext, RegisterContextType } from '../..';

const StepTwoRegister: React.FC = () => {

    const registerContext = React.useContext<RegisterContextType | undefined>(RegisterContext);
    if (!registerContext) {
        throw new Error("RegisterContext must be used within a RegisterContextProvider");
    }
    const { user, setUser, errors } = registerContext;


    const changeUser = (value: any, field: string) => {
        setUser((current: any) => {
            return { ...current, [field]: value }
        })
    }


    return (
        <div className="w-full">
            <div>
                <div className="mb-2 block flex gap-0.5">
                    <Label className="text-lg" htmlFor="fullName" value="Họ tên người dùng" />
                    <h1 className="text-lg text-red-600">*</h1>
                </div>
                <TextInput id="fullName" name="fullName" value={user?.fullName} required shadow type="text" onChange={e => changeUser(e.target.value, e.target.name)} />
                <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.user && errors.user.fullName}</p>
            </div>
            <div className="grid grid-cols-2 gap-5 mt-3">
                <div>
                    <div className="mb-2 block flex gap-0.5 ">
                        <Label className="text-lg" htmlFor="dob" value="Ngày sinh" />
                        <h1 className="text-lg text-red-600">*</h1>
                    </div>
                    <TextInput id="dob" name="dob" required value={user?.dob?.toString()} shadow type="date" onChange={e => changeUser(e.target.value, e.target.name)} />
                    <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.user && errors.user.dob}</p>
                </div>
                <div className="max-w-md" id="select">
                    <div className="mb-2 block flex gap-0.5">
                        <Label
                            className="text-lg"
                            htmlFor="gender"
                            value="Giới tính"
                        />
                        <h1 className="text-lg text-red-600">*</h1>

                    </div>
                    <Select id="gender" name="gender" required value={user?.gender} onChange={e => changeUser(e.target.value, e.target.name)}>
                        <option defaultChecked>--Giới tính--</option>
                        <option value="MALE" >Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                    </Select>
                    <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.user && errors.user.gender}</p>

                </div>
            </div>
            <div className="mt-3">
                <div className="mb-2 block flex gap-0.5">
                    <Label className="text-lg" htmlFor="phoneNumber" value="Số điện thoại" />
                    <h1 className="text-lg text-red-600">*</h1>

                </div>
                <TextInput id="phoneNumber" name="phoneNumber" value={user?.phoneNumber} required shadow type="text" onChange={e => changeUser(e.target.value, e.target.name)} />
                <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.user && errors.user.phoneNumber}</p>

            </div>
            <div className="mt-3">
                <div className="mb-2 block flex gap-0.5">
                    <Label className="text-lg" htmlFor="email" value="Địa chỉ email" />
                    <h1 className="text-lg text-red-600">*</h1>

                </div>
                <TextInput id="email" name="email" value={user?.email} required shadow type="email" onChange={e => changeUser(e.target.value, e.target.name)} />
                <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.user && errors.user.email}</p>
            </div>
        </div>
    );
};

export default StepTwoRegister;
