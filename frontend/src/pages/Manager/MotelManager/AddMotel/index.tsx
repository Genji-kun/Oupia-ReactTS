import goongJs from '@goongmaps/goong-js';
import React from 'react';
import { Motel } from '../../../../interfaces/Motel';
import { useDebounce } from 'use-debounce';
import API, { authApi, endpoints } from '../../../../configs/API';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { schemaMotel } from '../../../../validators/yupValidator';
import { UserContext, UserContextType } from '../../../../App';
import { Spinner, Toast } from 'flowbite-react';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import ManagerBreadCumb from '../../../../components/MyBreadCumb/ManagerBreadCumb';
import { useNavigate } from 'react-router-dom';

const AddMotel: React.FC = () => {

    const userContext = React.useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = userContext;

    const [motel, setMotel] = React.useState<Motel>();
    const [motelImages, setMotelImages] = React.useState<any[]>([]);
    const [isSelect, setIsSelect] = React.useState(false);
    const query = useDebounce(motel?.fullLocation, 300);
    const [isFocused, setIsFocused] = React.useState(false);
    const [results, setResults] = React.useState([]);
    const [map, setMap] = React.useState<any | null>(null);
    const [marker, setMarker] = React.useState<any | null>(null);
    const [errors, setErrors] = React.useState<any>();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [alert, setAlert] = React.useState<boolean | undefined>(undefined);

    const key = import.meta.env.VITE_GOONG_MAPS_MAPTILES_KEY;
    goongJs.accessToken = key;

    const nav = useNavigate();

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

    React.useEffect(() => {
        const validateAll = async () => {
            let schemas = [schemaMotel];
            let data = [motel];

            setErrors({});

            for (let i = 0; i < schemas.length; i++) {
                try {
                    await schemas[i].validate(data[i], { abortEarly: false });
                } catch (error: any) {
                    const errorMessages: any = {};
                    error.inner.forEach((err: any) => {
                        errorMessages[err.path] = err.message;
                    });
                    setErrors({ ...errorMessages })
                }
            }
        };

        validateAll();
    }, [motel]);


    const handleFileChange = (evt: any) => {
        const newFiles = Array.prototype.slice.call(evt.target.files)
        setMotelImages((current: any) => [...current, ...newFiles]);
    }

    const handleDelete = (file: any) => {
        setMotelImages((postImages: any) => postImages.filter((f: any) => f !== file));
    }

    const addMotel = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setAlert(undefined);

        if (motelImages.length < 3 || !currentUser) {
            setAlert(false);
            setLoading(false);

            return;
        }

        try {
            let form = new FormData();
            setMotel((current: any) => {
                return { ...current, "userId": currentUser }
            })
            form.append("motel", new Blob([JSON.stringify(motel)], {
                type: "application/json"
            }));


            motelImages.forEach((file) => {
                form.append('files', file);
            });

            let res = await authApi().post(endpoints['motels'], form, {
                headers: {
                    "Custom-Header": "value",
                }
            });
            if (res.status === 201) {
                setAlert(true);
                setLoading(false);
                nav("/manager/motels")
            }
        } catch (ex) {
            setAlert(false);
            setLoading(false);
        }

    }


    return (
        <>
            <div className="w-full relative">
                <ManagerBreadCumb BreadCrumbName="Thêm nhà trọ"></ManagerBreadCumb>
                <div className="px-5 md:px-20 py-10">
                    <h2 className="text-2xl font-bold leading-7 text-primary">Thêm nhà trọ mới</h2>
                    <div className="flex flex-col gap-5 my-5 rounded-xl shadow-xl p-10 bg-white ">
                        <div>
                            <div className="flex gap-0.5 items-center">
                                <label htmlFor="location" className="block mb-2 text-lg text-gray-900 ">Tên nhà trọ</label>
                                <h1 className="text-lg text-red-600">*</h1>
                            </div>
                            <input value={motel?.name} onChange={e => changeMotel(e.target.value, "name")} type="text" id="motelName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" />
                            <p id="standard_error_help" className="mt-2 text-xs text-red-600">{errors && errors.name}</p>
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
                            <p id="standard_error_help" className="mt-2 text-xs text-red-600 ">{errors && errors.fullLocation}</p>
                        </div>
                        <div>
                            <label className="block mb-2 text-lg text-gray-900 ">Địa điểm trên bản đồ</label>
                            <div id="map" style={{ width: "100%", height: "350px" }} />
                        </div>
                        <p id="standard_error_help" className="mt-2 text-xs text-red-600">{errors && errors.locationLongitude}</p>
                        <div>
                            <div className="flex gap-0.5 items-center">
                                <label htmlFor="motelImages" className="block mb-2 text-lg text-gray-900 ">Hình ảnh nhà trọ</label>
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
                            {motelImages.length !== 0 && (<div className="flex gap-5 mt-10 items-center">
                                <h1 className="font-bold text-xl text-secondary">Ảnh đã thêm:</h1>
                                {motelImages.map((file, index) => (
                                    <div className="col-span-1 relative w-32 h-32">
                                        <IoClose size="25" className="text-red-600 bg-white rounded-lg absolute right-2 top-2 cursor-pointer" onClick={() => handleDelete(file)} />
                                        <img key={index} className="rounded-xl w-full h-full object-cover" src={URL.createObjectURL(file)} alt={file.name} />
                                    </div>
                                ))}
                            </div>)}
                            <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{motelImages.length < 3 && 'Ít nhất 3 ảnh'}</p>
                        </div>
                        {loading === true ? <>
                            <div className="w-full flex">
                                <div className="ml-auto px-5 py-2 flex gap-2 items-center">
                                    <Spinner size="md" className="fill-primary"></Spinner>
                                    <h2 className="font-bold text-primary">Đang xử lý</h2>
                                </div>
                            </div>
                        </> : <button onClick={(e) => addMotel(e)} type="button" className="ml-auto w-40 text-white bg-primary hover:bg-secondary focus:ring-2 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 focus:outline-none">Thêm nhà trọ</button>
                        }
                    </div>
                </div>
                {alert !== undefined ? <>
                    {alert === true ? <Toast className="absolute left-5 bottom-24">
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">
                            Thêm thành công.
                        </div>
                        <Toast.Toggle />
                    </Toast> :
                        <Toast className="absolute left-5 bottom-24">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                <HiXMark className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">
                                Có lỗi xảy ra, vui lòng thử lại
                            </div>
                            <Toast.Toggle onClick={() => { setAlert(undefined) }} />
                        </Toast>}
                </> : <></>}

            </div>

        </>
    );
};

export default AddMotel;
