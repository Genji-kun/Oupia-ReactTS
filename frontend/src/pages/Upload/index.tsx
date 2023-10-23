import { Button, Spinner } from 'flowbite-react';
import React from 'react';
import './style.scss'
import { UserContext, UserContextType } from '../../App';
import { Navigate, useNavigate } from 'react-router-dom';
import MyBreadCrumb from '../../components/MyBreadCumb';
import NotFound from '../NotFound';
import API, { authApi, endpoints } from '../../configs/API';
import axios from 'axios';
import { schemaPost, schemaPostFindDetail } from '../../validators/yupValidator';
import { IoClose } from 'react-icons/io5';
import { AiOutlineCloudUpload } from 'react-icons/ai';

const Upload: React.FC = () => {

    const userContext = React.useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = userContext;

    const [provs, setProvs] = React.useState<any[]>([]);
    const [dists, setDists] = React.useState<any[]>([]);
    const [ws, setWs] = React.useState<any[]>([]);

    const [locationResult, setLocationResult] = React.useState(null);
    const [query, setQuery] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [post, setPost] = React.useState({});
    const [postFindDetail, setPostFindDetail] = React.useState<any>({});
    const [postImages, setPostImages] = React.useState<any[]>([]);

    const [loading, setLoading] = React.useState(false);


    const changePost = (value: any, field: string) => {
        setPost(current => {
            return { ...current, [field]: value }
        });
    }

    const handleFileChange = (evt: any) => {
        const newFiles = Array.prototype.slice.call(evt.target.files)
        setPostImages((current: any) => [...current, ...newFiles]);
    }

    const handleDelete = (file: any) => {
        setPostImages((postImages: any) => postImages.filter((f: any) => f !== file));
    }

    React.useEffect(() => {
        const validateAll = async () => {
            let schemas = [schemaPost, schemaPostFindDetail];
            let data = [post, postFindDetail];
            let dataNames = ['post', 'postFindDetail'];

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
    }, [post, postFindDetail]);


    const changePostDetail = (value: any, field: string) => {
        setPostFindDetail((current: any) => {
            return { ...current, [field]: value }
        });
    }

    const getValue = (target: any) => {
        if (!target.value) return null;
        let result;
        const options = target.childNodes;
        options.forEach((op: any) => {
            if (target.value === op.value)
                result = op.innerHTML;
        })
        return result;
    }

    const refreshLocation = () => {
        const provInput = document.querySelector("#province");
        const provVal = getValue(provInput);

        const distInput = document.querySelector("#district");
        const distVal = getValue(distInput);

        const wardInput = document.querySelector("#ward");
        const wardVal = getValue(wardInput);
        let queryTemp: any;
        if (provVal) queryTemp = provVal;
        if (distVal) queryTemp = distVal + ", " + provVal;
        if (wardVal) queryTemp = wardVal + ", " + distVal + ", " + provVal;
        setQuery(queryTemp);
    }

    const handleProvince = async (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProvCode = evt.target.value;

        if (selectedProvCode) {
            try {
                const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvCode}?depth=2`);
                const resDist = res.data.districts;
                setDists(resDist);

            } catch (ex) {
                console.error('Error fetching provinces: ', ex);
            }
        } else {
            setDists([]);
            setWs([]);
        }
        const distInput: any = document.querySelector("#district");
        const wardInput: any = document.querySelector("#ward");

        distInput.value = "";
        wardInput.value = "";
        refreshLocation();
    }


    const handleDistrict = async (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDistCode = evt.target.value;

        if (selectedDistCode) {
            try {
                const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistCode}?depth=2`);
                const resWard = res.data.wards;
                setWs(resWard);

            } catch (ex) {
                console.error('Error fetching districts: ', ex);
            }
        } else setWs([]);
        const wardInput: any = document.querySelector("#ward");
        wardInput.value = "";
        refreshLocation();
    }

    const handleWard = () => {
        refreshLocation();
    }

    React.useEffect(() => {
        const getDetail = async (placeId: any) => {
            const res = await API.get(endpoints["mapDetail"], {
                params: {
                    placeId: placeId,
                }
            })
            const data = await res.data;
            setLocationResult(data.result.formatted_address);
            changePostDetail(data.result.formatted_address, "location");
            changePostDetail(data.result.geometry.location.lat, "locationLatitude");
            changePostDetail(data.result.geometry.location.lng, "locationLongitude");
        }
        const getDatas = async (queryInput: any) => {
            const res = await API.get(endpoints["mapAutocomplate"], {
                params: {
                    input: queryInput,
                    sessionToken: localStorage.getItem("sessionToken")
                }
            })
            const data = await res.data;
            if (data.predictions) {
                const rs = data.predictions[0];
                const placeId = rs.place_id;
                getDetail(placeId)
            } else {
                setLocationResult(null);
            }
        }
        if (query) {
            getDatas(query);
        } else {
            setLocationResult(null);
            changePostDetail(null, "location");
            changePostDetail(null, "locationLatitude");
            changePostDetail(null, "locationLongitude");
        }
    }, [query])


    React.useEffect(() => {
        const getProvince = async () => {
            try {
                const res = await axios.get("https://provinces.open-api.vn/api/?depth=2");
                const resProv = res.data;
                setProvs(await resProv);
            } catch (ex) {
                console.error('Error fetching wards: ', ex);
            }
        }
        getProvince();
    }, []);

    const submitForm = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        console.log(post)
        // if (Object.keys(errors).length > 0) {
        //     alert("Thông tin chưa hợp lệ, vui lòng kiểm tra trước khi hoàn tất");
        //     setLoading(false);
        //     return;
        // }

        if (!postFindDetail.location) {
            alert("Thông tin chưa hợp lệ, vui lòng chọn khu vực");
            setLoading(false);
            return;
        }
        let form = new FormData();
        let newPost: any = {
            ...post,
            "postFindDetail": { ...postFindDetail },
            "userId": currentUser
        }
        form.append('post', JSON.stringify(newPost));
        postImages.forEach((file) => {
            form.append('files', file);
        });
        try {
            let res = await authApi().post(endpoints['addPostFind'], form, {
                headers: {
                    "Custom-Header": "value",
                }
            });
            if (res.status === 201) {
                setLoading(false);
                const nav = useNavigate()
                nav("/forum");
            }
            else {
                setLoading(false);
            }
        } catch (ex) {
            setLoading(false);
        }
    }

    if (!currentUser) {
        return (<Navigate to="/login?next=/upload" />)
    }

    if (currentUser.userRole === "LANDLORD") {
        return (<NotFound></NotFound>)
    }

    return (
        <>
            <div className="relative">
                <div className="mx-10 lg:mx-20">
                    <MyBreadCrumb BreadCrumbName="Đăng bài" />
                    <div className="w-full items-center p-10 rounded-lg border-2 border-gray-200 bg-white shadow-xl">
                        <form className="" onSubmit={e => submitForm(e)}>
                            <div className="my-5 flex items-center">
                                <div className="w-full">
                                    <div className="border-b border-gray-900/10 pb-12">
                                        <h2 className="text-2xl font-bold text-primary">Yêu cầu về nhà trọ</h2>
                                        <div className="mt-10 grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4 lg:gap-y-6">
                                            <div className="col-span-6 md:col-span-3">
                                                <div className="flex gap-0.5 items-center">
                                                    <label htmlFor="minPrice" className="block mb-2 text-lg text-gray-900 ">Giá tối thiểu</label>
                                                    <h1 className="text-lg text-red-600">*</h1>
                                                </div>
                                                <div className="relative w-full mt-2">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    </div>
                                                    <input value={postFindDetail.minPrice} onChange={e => changePostDetail(e.target.value, "minPrice")} type="text" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-20 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  " placeholder="Vd: 3000000..." />
                                                    <div className="absolute block inset-y-0 right-0 flex items-center px-3">
                                                        <span className="border-l-2 pl-3 text-gray-500 dark:text-gray-400">
                                                            VND
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.postFindDetail && errors.postFindDetail.minPrice}</p> */}
                                            </div>

                                            <div className="col-span-6 md:col-span-3">
                                                <div className="flex gap-0.5 items-center">
                                                    <label htmlFor="maxPrice" className="block mb-2 text-lg text-gray-900 ">Giá tối đa</label>
                                                    <h1 className="text-lg text-red-600">*</h1>
                                                </div>
                                                <div className="relative w-full mt-2">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    </div>
                                                    <input type="text" value={postFindDetail.maxPrice} onChange={e => changePostDetail(e.target.value, "maxPrice")} className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-20 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  " placeholder="Vd: 6000000..." />
                                                    <div className="absolute block inset-y-0 right-0 flex items-center px-3">
                                                        <span className="border-l-2 pl-3 text-gray-500 dark:text-gray-400">
                                                            VND
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.postFindDetail && errors.postFindDetail.maxPrice}</p> */}

                                            </div>

                                            <div className="col-span-6 lg:col-span-2 w-full">
                                                <div className="flex gap-0.5 items-center">
                                                    <label htmlFor="province" className="block mb-2 text-lg text-gray-900 ">Tỉnh / Thành phố</label>
                                                    <h1 className="text-lg text-red-600">*</h1>
                                                </div>
                                                <div className="mt-2">
                                                    <select
                                                        id="province"
                                                        name="province"
                                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary"
                                                        onChange={handleProvince} defaultValue="">
                                                        <option value="">
                                                            --Chọn tỉnh / thành phố--
                                                        </option>
                                                        {provs.map((resProv, index) => (
                                                            <option key={index} value={resProv.code}>
                                                                {resProv.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-span-6 lg:col-span-2">
                                                <div className="flex gap-0.5 items-center">
                                                    <label htmlFor="district" className="block mb-2 text-lg text-gray-900 ">Quận / Huyện</label>
                                                    <h1 className="text-lg text-red-600">*</h1>
                                                </div>
                                                <div className="mt-2">
                                                    <select
                                                        id="district"
                                                        name="district"
                                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary "
                                                        onChange={handleDistrict} defaultValue=""
                                                    >
                                                        <option value="">
                                                            --Chọn quận / huyện--
                                                        </option>
                                                        {dists && dists.map((resDist, index) => (
                                                            <option key={index} value={resDist.code}>
                                                                {resDist.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <div className="flex gap-0.5 items-center">
                                                    <label htmlFor="ward" className="block mb-2 text-lg text-gray-900 ">Phường / Xã</label>
                                                    <h1 className="text-lg text-red-600">*</h1>
                                                </div>
                                                <div className="mt-2">
                                                    <select
                                                        id="ward"
                                                        name="ward"
                                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary"
                                                        onChange={handleWard} defaultValue=""
                                                    >
                                                        <option value="">
                                                            --Chọn phường / xã--
                                                        </option>
                                                        {ws && ws.map((resWard, index) => (
                                                            <option key={index} value={resWard.code}>
                                                                {resWard.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <h5 id="locationResult" className="text-lg font-bold text-gray-700 mt-5">{locationResult ? (<>Khu vực bạn chọn: <span className="text-primary">{locationResult}</span></>) : "Địa điểm..."}</h5>
                                        {/* <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.postFindDetail && errors.postFindDetail.location}</p> */}
                                        <h2 className="text-2xl font-bold text-primary mt-10">Nội dung bài viết</h2>
                                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                            <div className="col-span-full">
                                                <div className="flex gap-0.5 items-center">
                                                    <label htmlFor="title" className="block mb-2 text-lg text-gray-900 ">Tiêu đề</label>
                                                    <h1 className="text-lg text-red-600">*</h1>
                                                </div>                                                <input onChange={e => changePost(e.target.value, "title")} type="text" id="title" className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" />

                                                {/* <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.post && errors.post.title}</p> */}

                                            </div>

                                            <div className="col-span-full">
                                                <div className="flex gap-0.5 items-center">
                                                    <label htmlFor="description" className="block mb-2 text-lg text-gray-900 ">Nội dung</label>
                                                    <h1 className="text-lg text-red-600">*</h1>
                                                </div>
                                                <div className="mt-2">
                                                    <textarea
                                                        id="about"
                                                        name="about"
                                                        rows={3}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm"
                                                        defaultValue={''}
                                                        onChange={e => changePost(e.target.value, "description")}

                                                    />
                                                </div>

                                                {/* <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.post && errors.post.description}</p> */}

                                            </div >

                                            <div className="col-span-full">
                                                <div>
                                                    <div className="flex gap-0.5 items-center">
                                                        <label htmlFor="motelImages" className="block mb-2 text-lg text-gray-900 ">Hình ảnh</label>
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
                                                    {postImages.length !== 0 && (<div className="flex gap-5 mt-10 items-center">
                                                        <h1 className="font-bold text-xl text-secondary">Ảnh đã thêm:</h1>
                                                        {postImages.map((file, index) => (
                                                            <div className="col-span-1 relative w-32 h-32">
                                                                <IoClose size="25" className="text-red-600 bg-white rounded-lg absolute right-2 top-2 cursor-pointer" onClick={() => handleDelete(file)} />
                                                                <img key={index} className="rounded-xl w-full h-full object-cover" src={URL.createObjectURL(file)} alt={file} />
                                                            </div>
                                                        ))}
                                                    </div>)}
                                                    {/* <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{postImages.length < 3 && 'Ít nhất 3 ảnh'}</p> */}
                                                </div>
                                            </div>
                                        </div >
                                    </div >
                                </div >
                            </div >
                            <div className="flex justify-center">
                                {loading === true ?
                                    <Spinner size="xl" className=" fill-primary mx-auto" />
                                    : <Button type="submit" className="bg-primary w-1/2 mx-auto whitespace-nowrap">
                                        <p className="font-bold text-base">Đăng bài viết</p>
                                    </Button>}
                            </div>

                        </form >
                    </div>
                </div>
            </div>
        </>)
};

export default Upload;