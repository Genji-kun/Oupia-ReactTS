import React from 'react';
import { RegisterContext, RegisterContextType } from '../..';
import goongJs from '@goongmaps/goong-js';
import { useDebounce } from 'use-debounce';
import API, { endpoints } from '../../../../configs/API';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const StepSixRegister: React.FC = () => {

  const registerContext = React.useContext<RegisterContextType | undefined>(RegisterContext);
  if (!registerContext) {
    throw new Error("RegisterContext must be used within a RegisterContextProvider");
  }
  const { motel, setMotel, motelImages, setMotelImages, errors } = registerContext;

  const [isSelect, setIsSelect] = React.useState(false);
  const query = useDebounce(motel?.fullLocation, 300);
  const [isFocused, setIsFocused] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [map, setMap] = React.useState<any | null>(null);
  const [marker, setMarker] = React.useState<any | null>(null);

  const key = import.meta.env.VITE_GOONG_MAPS_MAPTILES_KEY;
  goongJs.accessToken = key;

  const getDatas = async (queryInput: string) => {
    const res = await API.get(endpoints["mapAutocomplate"], {
      params: {
        input: queryInput,
        sessionToken: localStorage.getItem("sessionToken")
      }
    })
    const data = await res.data;
    if (data.predictions) {
      setResults(data.predictions);
    }
  }

  const geteocode = async (placeId: string) => {
    const res = await API.get(endpoints["mapDetail"], {
      params: {
        placeId: placeId,
      }
    })
    const data = await res.data;
    changeMotel(data.result.geometry.location.lat, "locationLatitude");
    changeMotel(data.result.geometry.location.lng, "locationLongitude");
    map?.flyTo({ center: [data.result.geometry.location.lng, data.result.geometry.location.lat] })
    if (marker === null)
      initMarker(data.result.geometry.location.lng, data.result.geometry.location.lat)
    else {
      marker.setLngLat([data.result.geometry.location.lng, data.result.geometry.location.lat])
    }
  }

  const handleSelectPlace = (e: any) => {
    setIsSelect(true);
    changeMotel(e.target.innerHTML, "fullLocation");
    setTimeout(() => {
      setIsSelect(false);
      geteocode(e.target.dataset.placeId);
      setIsFocused(false);
    }, 305);

  };

  React.useEffect(() => {
    if (!query[0]) {
      setResults([]);
      changeMotel("", "locationLatitude");
      changeMotel("", "locationLongitude");
    }
    else if (query[0] && isSelect === false) {
      getDatas(query[0]);
    }
  }, [query[0]])


  const changeMotel = (value: string | number, field: string) => {
    setMotel((current: any) => {
      return { ...current, [field]: value }
    })
  }

  const initMarker = (x: number, y: number) => {
    if (map)
      setMarker(
        new goongJs.Marker()
          .setLngLat([x, y])
          .addTo(map)
      );
  }

  const [mapReady] = React.useState(false);

  React.useEffect(() => {
    if (document.querySelector("#map")?.innerHTML === "") {

      setMap(new goongJs.Map({
        container: 'map',
        style: 'https://tiles.goong.io/assets/goong_map_web.json',
        center: [105.83991, 21.02800],
        zoom: 20
      }));

    }
  }, []);

  React.useEffect(() => {
    if (mapReady && motel) {
      initMarker(motel.locationLongitude, motel.locationLatitude);
    }
  }, [mapReady]);

  const handleFileChange = (evt: any) => {
    const newFiles = Array.prototype.slice.call(evt.target.files)
    setMotelImages((current: any) => [...current, ...newFiles]);
  }

  const handleDelete = (file: any) => {
    setMotelImages((postImages: any) => postImages.filter((f: any) => f !== file));
  }

  return (
    <>
      <div className="w-full">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-bold leading-7 text-primary">Thông tin nhà trọ</h2>
          <div className="flex flex-col gap-5 my-5">
            <div>
              <div className="flex gap-0.5 items-center">
                <label htmlFor="location" className="block mb-2 text-lg text-gray-900 ">Tên nhà trọ</label>
                <h1 className="text-lg text-red-600">*</h1>
              </div>
              <input value={motel?.name} onChange={e => changeMotel(e.target.value, "name")} type="text" id="motelName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" />
              <p id="standard_error_help" className="mt-2 text-xs text-red-600">{errors.motel && errors.motel.name}</p>
            </div>
            <div className="relative">
              <div className="flex gap-0.5 items-center">
                <label htmlFor="location" className="block mb-2 text-lg text-gray-900 ">Địa chỉ chi tiết</label>
                <h1 className="text-lg text-red-600">*</h1>
              </div>
              <input value={motel?.fullLocation}
                onChange={e => changeMotel(e.target.value, "fullLocation")}
                onFocus={() => setIsFocused(true)}
                type="text" id="location" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" />
              <ul className={isFocused ? "absolute bg-white z-50 shadow mt-1 rounded-lg w-full py-2 text-sm text-dark dark:text-gray-200" : "hidden"}>
                {results.map((result: any, index: number) => (
                  <li key={index} onClick={(e) => handleSelectPlace(e)} className="cursor-pointer px-4 py-2 hover:bg-primary hover:text-white" data-place-id={result.place_id}>{result.description}</li>
                ))}
              </ul>
              <p id="standard_error_help" className="mt-2 text-xs text-red-600 ">{errors.motel && errors.motel.fullLocation}</p>
            </div>
            <div>
              <label className="block mb-2 text-lg text-gray-900 ">Địa điểm trên bản đồ</label>
              <div id="map" style={{ width: "100%", height: "350px" }} />
            </div>
            <p id="standard_error_help" className="mt-2 text-xs text-red-600">{errors.motel && errors.motel.locationLongitude}</p>
          </div>
          <div>
            <div className="flex gap-0.5 items-center">
              <label htmlFor="motelImages" className="block mb-2 text-lg text-gray-900 ">Hình ảnh nhà trọ   </label>
              <h1 className="text-lg text-red-600">*</h1>
            </div>
            <div className="flex w-full justify-center rounded-lg border border-dashed border-dark/50 px-6 py-10">
              <div className="text-center relative">
                <AiOutlineCloudUpload className="mx-auto h-12 w-12" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="motelImages"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-secondary"
                  >
                    <span>Tải lên file</span>
                    <input
                      id="motelImages"
                      name="motelImages"
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
            {motelImages.length !== 0 && (<div className="grid grid-cols-6 gap-5 mt-10">
              {motelImages.map((file, index) => (
                <div className="relative w-32 h-32">
                  <IoClose size="25" className="text-red-600 bg-white rounded-lg absolute right-2 top-2 cursor-pointer" onClick={() => handleDelete(file)} />
                  <img key={index} className="rounded-xl w-full h-full object-cover" src={URL.createObjectURL(file)} alt={file.name} />
                </div>
              ))}
            </div>)}
            <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{motelImages.length < 3 && 'Ít nhất 3 ảnh'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepSixRegister;
