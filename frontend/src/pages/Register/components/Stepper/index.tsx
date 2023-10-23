import React from 'react'
import { RegisterContext, RegisterContextType } from '../..'
import { PiClipboardText, PiIdentificationCard, PiIdentificationCardThin, PiUserFocus, PiUserFocusLight, PiUserRectangle, PiUserRectangleThin } from 'react-icons/pi'
import { HiOutlineHomeModern } from 'react-icons/hi2'
import { RiUserSettingsLine } from 'react-icons/ri'

interface RegisterStepperProps {
  step: number
}

const RegisterStepper: React.FC<RegisterStepperProps> = (props) => {

  const registerContext = React.useContext<RegisterContextType | undefined>(RegisterContext);
  if (!registerContext) {
    throw new Error("RegisterContext must be used within a RegisterContextProvider");
  }

  const { user, setStep } = registerContext;

  const { step } = props;

  if (user?.userRole === "TENANT") {
    return (<>
      <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="mb-10 ml-6">
          {step > 0 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <PiUserFocusLight className="text-dark" size="20" />
          </span>}

          <h3 className={`${step !== 0 ? "text-primary" : step === 0 ? "text-white" : ""} font-medium leading-tight ml-3`}>Loại người dùng</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 0) { setStep(0) } }}>Xem thông tin</p>
        </li>
        <li className="mb-10 ml-6">
          {step > 1 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <PiIdentificationCardThin className="text-dark" size="20" />
          </span>}
          <h3 className={`${step > 1 ? "text-primary" : step === 1 ? "text-white" : ""} font-medium leading-tight ml-3`}>Thông tin người dùng</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 1) { setStep(1) } }}>Xem thông tin</p>
        </li>
        <li className="ml-6">
          {step > 5 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <PiUserRectangleThin className="text-dark" size="20" />
          </span>}
          <h3 className={`${step > 2 ? "text-primary" : step === 2 ? "text-white" : ""} font-medium leading-tight ml-3`}>Thông tin tài khoản</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer"onClick={() => { if (step > 2) { setStep(2) } }}>Xem thông tin</p>
        </li>
      </ol>
    </>);
  } else if (user?.userRole === "LANDLORD") {
    return (<>
      <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="mb-10 ml-6">
          {step > 0 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <RiUserSettingsLine className="text-dark" size="20" />
          </span>}

          <h3 className={`${step > 0 ? "text-primary" : step === 0 ? "text-white" : ""} font-medium leading-tight ml-3`}>Loại người dùng</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 0) { setStep(0) } }}>Xem thông tin</p>
        </li>
        <li className="mb-10 ml-6">
          {step > 1 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <PiIdentificationCard className="text-dark" size="20" />
          </span>}
          <h3 className={`${step > 1 ? "text-primary" : step === 1 ? "text-white" : ""} font-medium leading-tight ml-3`}>Thông tin người dùng</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 1) { setStep(1) } }}>Xem thông tin</p>
        </li>
        <li className="mb-10 ml-6">
          {step > 2 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <PiUserRectangle className="text-dark" size="20" />
          </span>}
          <h3 className={`${step > 2 ? "text-primary" : step === 2 ? "text-white" : ""} font-medium leading-tight ml-3`}>Thông tin tài khoản</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 2) { setStep(2) } }}>Xem thông tin</p>
        </li>
        <li className="mb-10 ml-6">
          {step > 3 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <PiClipboardText className="text-dark" size="20" />
          </span>}
          <h3 className={`${step > 3 ? "text-primary" : step === 3 ? "text-white" : ""} font-medium leading-tight ml-3`}>Giấy phép kinh doanh</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 3) { setStep(3) } }}>Xem thông tin</p>
        </li>
        <li className="mb-10 ml-6">
          {step > 4 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <PiUserFocus className="text-dark" size="20" />
          </span>}
          <h3 className={`${step > 4 ? "text-primary" : step === 4 ? "text-white" : ""} font-medium leading-tight ml-3`}>Xác thực khuôn mặt</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 4) { setStep(4) } }}>Xem thông tin</p>
        </li>
        <li className="ml-6">
          {step > 5 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
            <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <HiOutlineHomeModern className="text-dark" size="20" />
          </span>}
          <h3 className={`${step > 5 ? "text-primary" : step === 5 ? "text-white" : ""} font-medium leading-tight ml-3`}>Thêm nhà trọ</h3>
          <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 5) { setStep(5) } }}>Xem thông tin</p>
        </li>
      </ol>
    </>)
  }

  return (<>
    <ol className="relative text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <li className="mb-10 ml-6">
        {step > 0 ? <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-primary">
          <svg className="w-3.5 h-3.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
          </svg>
        </span> : <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
          <RiUserSettingsLine className="text-dark" size="20" />
        </span>}

        <h3 className={`${step > 0 ? "text-primary" : step === 0 ? "text-white" : ""} font-medium leading-tight ml-3`}>Loại người dùng</h3>
        <p className="text-sm ml-3 hover:text-white cursor-pointer" onClick={() => { if (step > 0) { setStep(0) } }}>Xem thông tin</p>
      </li>
    </ol>
  </>);
};

export default RegisterStepper;
