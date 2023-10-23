import React, { createContext, useContext, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/User';
import API, { endpoints } from '../../configs/API';
import { Button, Spinner } from 'flowbite-react';
import { UserContext, UserContextType } from '../../App';
import RegisterStepper from './components/Stepper';
import StepOneRegister from './components/StepOneRegister';
import StepTwoRegister from './components/StepTwoRegister';
import StepThreeRegister from './components/StepThreeRegister';
import StepFourRegister from './components/StepFourRegister';
import StepFiveRegister from './components/StepFiveRegister';
import StepSixRegister from './components/StepSixRegister';
import { schemaMotel, schemaUser } from '../../validators/yupValidator';
import { Motel } from '../../interfaces/Motel';
import { LandlordInfo } from '../../interfaces/LandlordInfo';

export interface RegisterContextType {
  errors: any,
  user: User | undefined,
  setUser: any,
  avatar: any,
  setAvatar: any,
  setAvatarFile: any,
  businessLicense: any,
  setBusinessLicense: any,
  setBusinessLicenseFile: any,
  frontOfID: File | null,
  setFrontOfID: any,
  setFrontOfIDFile: any,
  backOfID: File | null,
  setBackOfID: any,
  setBackOfIDFile: any,
  landlordInfo: LandlordInfo | undefined,
  setLandlordInfo: any,
  motel: Motel | undefined,
  setMotel: any,
  motelImages: any[],
  setMotelImages: any
  validate: any,
  setValidate: any,
  setStep: any,
  access: boolean,
  setAccess: any,

}

export const RegisterContext = createContext<RegisterContextType | undefined>(undefined);


const Register: React.FC = () => {

  const userContext = useContext<UserContextType | undefined>(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { currentUser } = userContext;

  const [component, setComponent] = React.useState();
  const [components, setComponents] = React.useState<any[]>([<StepOneRegister />]);

  const [step, setStep] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const nav = useNavigate();

  const [user, setUser] = React.useState<User | undefined>(undefined);
  const [landlordInfo, setLandlordInfo] = React.useState<LandlordInfo | undefined>(undefined);
  const [motel, setMotel] = React.useState<Motel | undefined>(undefined);
  const [motelImages, setMotelImages] = React.useState<any[]>([]);

  const [avatar, setAvatar] = React.useState(null);
  const [avatarFile, setAvatarFile] = React.useState(null);

  const [businessLicense, setBusinessLicense] = React.useState<any>(null);
  const [businessLicenseFile, setBusinessLicenseFile] = React.useState<any>(null);

  const [frontOfID, setFrontOfID] = React.useState<File | null>(null);
  const [frontOfIDFile, setFrontOfIDFile] = React.useState<any>(null);

  const [backOfID, setBackOfID] = React.useState<File | null>(null);
  const [backOfIDFile, setBackOfIDFile] = React.useState<any>(null);

  const [access, setAccess] = React.useState<boolean>(false);
  const [validate, setValidate] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const handleNextStep = () => {
    if (step === 0 && !user?.userRole) {
      return;
    }
    if (step === 1 && !user?.userRole) {
      return;
    }
    if (step !== components.length - 1)
      setStep(prev => prev + 1);

  }

  const handlePrevStep = () => {
    if (step !== 0)
      setStep(prev => prev - 1);
  }

  React.useEffect(() => {
    setComponent(components[step])
  }, [step])


  React.useEffect(() => {
    if (user?.userRole === "TENANT") {
      setComponents([
        <StepOneRegister />,
        <StepTwoRegister />,
        <StepThreeRegister />]);
    } else if (user?.userRole === "LANDLORD") {
      setComponents([
        <StepOneRegister />,
        <StepTwoRegister />,
        <StepThreeRegister />,
        <StepFourRegister />,
        <StepFiveRegister />,
        <StepSixRegister />,
      ]);
    }
  }, [user?.userRole])

  React.useEffect(() => {
    const validateAll = async () => {
      let schemas = [schemaUser, schemaMotel];
      let data = [user, motel];
      let dataNames = ['user', 'motel'];

      if (user?.userRole === "TENANT") {
        schemas = [schemaUser];
        data = [user];
        dataNames = ['user'];
      }

      setErrors({});

      for (let i = 0; i < schemas.length; i++) {
        try {
          await schemas[i].validate(data[i], { abortEarly: false });
        } catch (error: any) {
          const errorMessages: any = {};
          error.inner.forEach((err: any) => {
            errorMessages[err.path] = err.message;
          });
          setErrors(prevErrors => ({
            ...prevErrors,
            [dataNames[i]]: errorMessages
          }));
        }
      }


    };

    validateAll();
  }, [user, motel, user?.userRole]);

  const register = async (evt: any) => {
    evt.preventDefault();
    setLoading(true);

    if (step < components.length - 1)
      return;

    if (Object.keys(errors).length > 0 || !avatarFile || !user?.userRole || ((user?.userRole === "LANDLORD" && (motelImages.length < 3 || access === false)))) {
      alert("Thông tin đăng ký chưa hợp lệ, vui lòng kiểm tra trước khi hoàn tất");
      setLoading(false);
      return;
    }

    const url = endpoints.userInfo(user.username);

    let res = await API.get(url);
    if (res.status === 200) {
      alert("Tên người dùng đã tồn tại, vui lòng chọn tên khác");
      setLoading(false);
      return;
    }
    else {
      const process = async () => {
        try {
          let form = new FormData();
          if (user.userRole === "LANDLORD") {
            setUser((current: any) => {
              return { ...current, "landlordInfo": landlordInfo }
            })
            form.append('user', JSON.stringify(user));
            form.append('motel', JSON.stringify(motel));
            form.append("avatar", avatarFile[0]);
            form.append("businessLicense", businessLicenseFile[0]);
            form.append("frontOfID", frontOfIDFile[0]);
            form.append("backOfID", backOfIDFile[0]);

            motelImages.forEach((file) => {
              form.append('files', file);
            });

            ;
            let res = await API.post(endpoints['register-landlord'], form, {
              headers: {
                "Custom-Header": "value",
              }
            });
            if (res.status === 201) {
              nav("/login");
            }
          } else {
            form.append("user", new Blob([JSON.stringify(user)], {
              type: "application/json"
            }));
            form.append("avatar", avatarFile[0]);

            let res = await API.post(endpoints['register'], form);
            if (res.status === 201) {
              nav("/login");
            }
          }
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      }

      process();
    }
  }

  if (currentUser) {
    return (<Navigate to="/" />)
  }

  return (<>
    <RegisterContext.Provider value={{ errors, user, setUser, avatar, setAvatar, setAvatarFile, businessLicense, setBusinessLicense, setBusinessLicenseFile, frontOfID, setFrontOfID, setFrontOfIDFile, backOfID, setBackOfID, setBackOfIDFile, motel, setMotel, motelImages, setMotelImages, landlordInfo, setLandlordInfo, validate, setValidate, setStep, access, setAccess }}>
      <div className="min-h-screen">
        <div className="grid grid-cols-3 rounded-xl border shadow-lg m-20">
          <div className=" col-span-1 bg-dark flex items-start h-full rounded-l-xl py-24">
            <div className=" flex flex-col mx-auto">
              <h1 className="text-3xl text-white mb-10">Đăng ký người dùng</h1>
              <RegisterStepper step={step} />
            </div>
          </div>
          <div className="col-span-2 flex flex-col ">
            <form onSubmit={register} className="gap-4 flex flex-col justify-center mx-36 h-full">
              <div className="my-10 flex">
                <div className="w-full">
                  {component}
                </div>
              </div>
              {step !== 0 ? (
                <div className="grid grid-cols-2 gap-5">
                  <Button onClick={handlePrevStep} className="bg-dark text-white enabled:hover:bg-darker focus:ring-2 focus:ring-gray-400/90">
                    <p className="font-bold text-base">Quay lại</p>
                  </Button>
                  {step === components.length - 1 ?
                    <>
                      {loading === true ?
                        <div className="mx-auto">
                          <Spinner size="xl" className=" fill-primary" />
                        </div> : <Button onClick={register} className="bg-primary w-full enabled:hover:bg-secondary">
                          <p className="font-bold text-base">Hoàn tất</p>
                        </Button>}

                    </>
                    : <Button onClick={handleNextStep} type="button" className="bg-primary w-full enabled:hover:bg-secondary">
                      <p className="font-bold text-base">Tiếp tục</p>
                    </Button>}

                </div>)
                :
                <Button onClick={handleNextStep} className="bg-primary w-full enabled:hover:bg-secondary">
                  <p className="font-bold text-base">Tiếp tục</p>
                </Button>}
            </form>
            <hr className=" h-px my-10 mx-20 bg-gray-200 border-0 dark:bg-gray-700" />
            <p className="font-thin mb-10 mx-auto text-gray-900">Bạn có tài khoản? <Link to="/login" className="font-bold">Đăng nhập</Link></p>
          </div>
        </div>
      </div>
    </RegisterContext.Provider>
  </>);
};

export default Register;
