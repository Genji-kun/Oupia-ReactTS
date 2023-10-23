import { Label, TextInput } from 'flowbite-react';
import React from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { RegisterContext, RegisterContextType } from '../..';

const StepFourRegister: React.FC = () => {

  const registerContext = React.useContext<RegisterContextType | undefined>(RegisterContext);
  if (!registerContext) {
    throw new Error("RegisterContext must be used within a RegisterContextProvider");
  }
  const { landlordInfo, setLandlordInfo, businessLicense, setBusinessLicense, setBusinessLicenseFile, errors} = registerContext;

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
    // const newFiles = Array.from(evt.dataTransfer.files);
  }

  const handleFileChange = (evt: any) => {
    if (evt.target.files && evt.target.files[0]) {
      const file = evt.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setBusinessLicense(fileURL);
      setBusinessLicenseFile(evt.target.files);
    }
  }
  const handleRemoveImage = () => {
    setBusinessLicense(null);
  };



  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div>
          <div className="mb-2 block flex gap-0.5">
            <Label className="text-lg" htmlFor="taxCode" value="Mã số thuế" />
            <h1 className="text-lg text-red-600">*</h1>
          </div>
          <TextInput id="taxCode" name="taxCode" required shadow type="text" value={landlordInfo?.taxCode} onChange={(e) => changeLandlordInfo(e.target.value, e.target.name)} />
          <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.landlordInfo && errors.landlordInfo.taxCode}</p>
        </div>
        <div className="block  flex gap-0.5">
          <Label className="text-lg " htmlFor="license" value="Giấy phép kinh doanh" />
          <h1 className="text-lg text-red-600">*</h1>

        </div>
        {businessLicense ? (
          <div className=" w-full justify-center rounded-lg border border-dashed border-dark/50 relative p-5">
            <img src={businessLicense} alt="Selected" className="rounded-lg " />
            <button className="absolute right-2 top-2 text-red-600 rounded bg-white hover:bg-gray-300" onClick={() => handleRemoveImage()}><IoClose size="20"></IoClose></button>
          </div>
        ) : <>
          <div onDragOver={handleDragOver} onDrop={handleDrop} className="flex w-full justify-center rounded-lg border border-dashed border-dark/50 px-6 py-10">
            <div className="text-center relative">
              <AiOutlineCloudUpload className="mx-auto h-12 w-12" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="license"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-secondary"
                >
                  <span>Tải lên file</span>
                  <input
                    id="license"
                    name="license"
                    type="file"
                    multiple
                    className="sr-only"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">hoặc kéo thả từ thư mục</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">Chỉ nhận ảnh PNG, JPG</p>
            </div>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">{!businessLicense && 'Phải có ảnh chụp kinh phép kinh doanh'}</p>
        </>}
      </div>
    </>
  );
};

export default StepFourRegister;
