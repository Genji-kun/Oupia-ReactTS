import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import React from 'react';
import Webcam from 'react-webcam';
import { IoBan, IoClose } from 'react-icons/io5';
import axios from 'axios';
import { RegisterContext, RegisterContextType } from '../..';


const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};


const StepFiveRegister: React.FC = function () {
  const [imageCamera, setImageCamera] = React.useState<File | null>(null);
  const [result, setResult] = React.useState<string>('');
  const [hasOpen, setHasOpen] = React.useState<boolean>(false);
  const [accuracy, setAccuracy] = React.useState<number | undefined>(undefined);
  const [accuracyLoading, setAccuracyLoading] = React.useState<boolean>(false);

  const registerContext = React.useContext<RegisterContextType | undefined>(RegisterContext);
  if (!registerContext) {
    throw new Error("RegisterContext must be used within a RegisterContextProvider");
  }
  const { landlordInfo, setLandlordInfo, frontOfID, setFrontOfID, setFrontOfIDFile, backOfID, setBackOfID, setBackOfIDFile, access, setAccess, errors } = registerContext;

  const changeLandlordInfo = (value: any, field: string) => {
    setLandlordInfo((current: any) => {
      return { ...current, [field]: value }
    })
  }

  const handleDragOver = (evt: any) => {
    evt.preventtDefault();
  }

  const handleDrop = (evt: any) => {
    evt.preventDefault();
  }

  const handleFileIdentityFrontChange = (evt: any) => {
    if (evt.target.files && evt.target.files[0]) {
      const file = evt.target.files[0];
      setFrontOfID(file);
      setFrontOfIDFile(evt.target.files);
    }
  };

  const handleFileIdentityBackChange = (evt: any) => {
    if (evt.target.files && evt.target.files[0]) {
      const file = evt.target.files[0];
      setBackOfID(file);
      setBackOfIDFile(evt.target.files);
    }
  };

  const handleRemoveImage = (which: string) => {
    if (which === "front") {
      setFrontOfID(null);
    }
    else
      setBackOfID(null);

  };


  // Webcam

  const webcamRef = React.useRef<Webcam>(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    const byteString = atob(imageSrc ? imageSrc.split(',')[1] : "");
    const mimeString = imageSrc?.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], 'image_camera.jpg', { type: mimeString });

    setImageCamera(file);
  }, [webcamRef, setImageCamera]);

  React.useEffect(() => {
    const compareFaces = async () => {
      if (!frontOfID || !backOfID || !imageCamera) {
        setAccuracy(undefined);
        return;
      }
      setAccuracyLoading(true);
      const formData = new FormData();
      formData.append('image_file1', frontOfID);
      formData.append('image_file2', imageCamera);
      formData.append('api_key', import.meta.env.VITE_FACEPP_API_KEY);
      formData.append('api_secret', import.meta.env.VITE_FACEPP_SERCET_KEY);

      try {
        const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/compare', formData);
        setResult(JSON.stringify(response.data, undefined, 2));
        setAccuracy(Number(response.data.confidence));
        if (accuracy && accuracy >= 65) {
          setAccess(true);
        }
        setAccuracyLoading(false);
      } catch (error) {
        console.error('Error comparing faces:', error);
      }
    };

    compareFaces();
    setImageCamera(null);
  }, [imageCamera, frontOfID, backOfID]);

  React.useEffect(() => {
    if (frontOfID) {
      const fetchData = async () => {
        const url = 'https://api.fpt.ai/vision/idr/vnm';
        const headers = {
          'api-key': import.meta.env.VITE_FPT_RECOGNITION_API_KEY,
        };
        let formData = new FormData();
        formData.append('image', frontOfID);

        try {
          const result2 = await axios.post(url, formData, { headers });
          const data = result2.data.data[0];
          changeLandlordInfo(data.id, "identityNumber");
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchData();
    }

  }, [frontOfID])

  return (
    <>
      <div className="py-5">
        <div className="mb-4 block flex gap-0.5 items-center">
          <Label className="text-lg" value="CMND/ CCCD của chủ trọ" />
          <h1 className="text-lg text-red-600">*</h1>
        </div>
        <div className="w-full flex gap-5">
          {frontOfID ? (
            <div className=" w-full justify-center rounded-lg border border-dashed border-dark/50 relative p-5">
              <img src={URL.createObjectURL(frontOfID)} alt="Selected" className="rounded-lg " />
              <button className="absolute right-2 top-2 text-red-600 rounded bg-white hover:bg-gray-300" onClick={() => handleRemoveImage("front")}><IoClose size="20"></IoClose></button>
            </div>
          ) : <>
            <div onDragOver={handleDragOver} onDrop={handleDrop} className="flex w-full justify-center rounded-lg border border-dashed border-dark/50 px-6 py-10 items-center">
              <div className="text-center relative">
                <h3 className="font-semibold w-full center text-3xl text-secondary py-2">Mặt trước</h3>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="front_identity"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-secondary"
                  >
                    <span>Tải lên file</span>
                    <input
                      id="front_identity"
                      name="front_identity"
                      type="file"
                      className="sr-only"
                      accept="image/png, image/jpeg"
                      onChange={handleFileIdentityFrontChange}
                    />
                  </label>
                  <p className="pl-1">hoặc kéo thả từ thư mục</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">Chỉ nhận ảnh PNG, JPG</p>
              </div>
            </div>
          </>}
          {backOfID ? (
            <div className=" w-full justify-center rounded-lg border border-dashed border-dark/50 relative p-5">
              <img src={URL.createObjectURL(backOfID)} alt="Selected" className="rounded-lg " />
              <button className="absolute right-2 top-2 text-red-600 rounded bg-white hover:bg-gray-300" onClick={() => handleRemoveImage("back")}><IoClose size="20"></IoClose></button>
            </div>
          ) : <>
            <div onDragOver={handleDragOver} onDrop={handleDrop} className="flex w-full justify-center rounded-lg border border-dashed border-dark/50 px-6 py-10 items-center ">
              <div className="text-center relative">
                <h3 className="font-semibold w-full center text-3xl text-secondary py-2">Mặt sau</h3>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="back_identity"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-secondary"
                  >
                    <span>Tải lên file</span>
                    <input
                      id="back_identity"
                      name="back_identity"
                      type="file"
                      className="sr-only"
                      accept="image/png, image/jpeg"
                      onChange={handleFileIdentityBackChange}
                    />
                  </label>
                  <p className="pl-1">hoặc kéo thả từ thư mục</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">Chỉ nhận ảnh PNG, JPG</p>
              </div>
            </div>
          </>}
        </div>
      </div>
      <div className="my-5">
        <div className="mb-2 block flex gap-0.5 items-center">
          <Label className="text-lg" htmlFor="identityNumber" value="Số chứng minh thư" />
          <h1 className="text-lg text-red-600">*</h1>
        </div>
        <TextInput id="identity" name="identityNumber" disabled required shadow type="text" value={landlordInfo?.identityNumber} onChange={(e) => changeLandlordInfo(e.target.value, e.target.name)} />
        <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.landlordInfo && errors.landlordInfo.identity}</p>

      </div>
      <div className="py-5">
        <div className="mb-4 block w-full flex items-center gap-0.5">
          <Label className="text-lg" value="Xác thực khuôn mặt" />
          <h1 className="text-lg text-red-600">*</h1>

          {accuracyLoading === true ?
            <div className="ml-auto flex gap-2 items-center">
              <Spinner className="fill-primary"></Spinner>
              <h1 className="font-bold text-primary">Đang xác thực</h1>
            </div> : <>
              {(!access && !accuracy) ?
                <>
                  <div className="ml-auto text-red-600 flex gap-2 items-center">
                    <h1 className="font-bold">Chưa xác thực</h1>
                    <IoBan></IoBan>
                  </div>
                </> : <>
                  {(accuracy && accuracy >= 75 || access) ?
                    <>
                      <div className="ml-auto text-green-600 flex gap-2 items-center">
                        <h1 className="text-lg font-bold">Xác thực thành công</h1>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                        </svg>
                      </div>
                    </> : <>
                      <div className="ml-auto text-red-400 flex gap-2 items-center">
                        <h1 className="text-lg font-bold">Độ chính xác thấp</h1>
                        <IoBan></IoBan>
                      </div>
                    </>}
                </>
              }
            </>}

        </div>
        <div>
          <h3 className="mb-4"><span className="text-red-600 font-semibold">*Lưu ý</span>: Vui lòng thêm chứng minh thư có ảnh mới xác thực được</h3>
          {(hasOpen === false) ? <>
            <Button onClick={() => { setHasOpen(true) }}>Bắt đầu xác thực</Button>

          </> : <>
            <div className="relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                className="w-full object-cover"
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
              <div className="absolute right-5 top-5 flex flex-col gap-2">
                <Button onClick={() => setHasOpen(false)} color="failure" >Đóng</Button>
                <Button onClick={capture} color="success" >Chụp ảnh</Button>
              </div>
            </div>
          </>}
        </div>
      </div >
    </>
  );
};

export default StepFiveRegister;
