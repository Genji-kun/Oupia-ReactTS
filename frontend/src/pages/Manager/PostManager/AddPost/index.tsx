import React from 'react';
import { Motel } from '../../../../interfaces/Motel';
import { UserContext, UserContextType } from '../../../../App';
import API, { authApi, endpoints } from '../../../../configs/API';
import { Post } from '../../../../interfaces/Post';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { Button, Spinner, Toast } from 'flowbite-react';
import { HiXMark } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';
import { PostRentDetail } from '../../../../interfaces/PostRentDetail';
import ManagerBreadCumb from '../../../../components/MyBreadCumb/ManagerBreadCumb';
import { schemaPost, schemaPostRentDetail } from '../../../../validators/yupValidator';

const AddPost: React.FC = () => {

    const userContext = React.useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = userContext;

    const [post, setPost] = React.useState<Post>();
    const [postRentDetail, setPostRentDetail] = React.useState<PostRentDetail>();
    const [motels, setMotels] = React.useState<Motel[] | undefined>(undefined);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [alert, setAlert] = React.useState<boolean>(false);
    const [postImages, setPostImages] = React.useState<any[]>([]);
    const [postErrors, setPostErrors] = React.useState<any>();
    const [postRentDetailErrors, setPostRentDetailErrors] = React.useState<any>();

    const nav = useNavigate();

    React.useEffect(() => {
        const getMotel = async () => {
            try {
                let res = await API.get(endpoints['motels'], {
                    params: {
                        userId: currentUser?.id
                    }
                });
                if (res.status === 200) {
                    setMotels(res.data);
                }
            } catch (ex: any) {
                throw new Error("Xảy ra lỗi khi truy xuất");
            }
        }
        getMotel();
    }, []);

    React.useEffect(() => {
        const validatePost = async () => {
            let schemas = [schemaPost];
            let data = [post];

            setPostErrors({});

            for (let i = 0; i < schemas.length; i++) {
                try {
                    await schemas[i].validate(data[i], { abortEarly: false });
                } catch (error: any) {
                    const errorMessages: any = {};
                    error.inner.forEach((err: any) => {
                        errorMessages[err.path] = err.message;
                    });
                    setPostErrors({ ...errorMessages })
                }
            }
        };

        const validatePostRentDetail = async () => {
            let schemas = [schemaPostRentDetail];
            let data = [postRentDetail];

            setPostRentDetailErrors({});

            for (let i = 0; i < schemas.length; i++) {
                try {
                    await schemas[i].validate(data[i], { abortEarly: false });
                } catch (error: any) {
                    const errorMessages: any = {};
                    error.inner.forEach((err: any) => {
                        errorMessages[err.path] = err.message;
                    });
                    setPostRentDetailErrors({ ...errorMessages })
                }
            }
        };

        validatePost();
        validatePostRentDetail();
    }, [post, postRentDetail]);

    const changePost = (value: string | number, field: string) => {
        setPost((current: any) => {
            return { ...current, [field]: value }
        })
    }

    const changePostRentDetail = (value: string | number, field: string) => {
        setPostRentDetail((current: any) => {
            return { ...current, [field]: value }
        })
    }

    const handleFileChange = (evt: any) => {
        const newFiles = Array.prototype.slice.call(evt.target.files)
        setPostImages((current: any) => [...current, ...newFiles]);
    }

    const handleDelete = (file: any) => {
        setPostImages((postImages: any) => postImages.filter((f: any) => f !== file));
    }

    const addPost = async (evt: any) => {
        evt.preventDefault();
        setLoading(true);
        setAlert(false);

        if (Object.keys(postErrors).length > 0 || Object.keys(postRentDetailErrors).length > 0 || !postRentDetail?.motelId || !postRentDetail || postImages.length < 3) {
            setAlert(true);
            setLoading(false);
            return;
        }

        else {
            const process = async () => {
                try {
                    let form = new FormData();
                    setPost((current: any) => {
                        return { ...current, "postRentDetail": postRentDetail, "userId": currentUser }
                    })
                    console.log(post)
                    form.append('post', JSON.stringify(post));

                    postImages.forEach((file) => {
                        form.append('files', file);
                    });

                    ;
                    let res = await authApi().post(endpoints['addPostRent'], form, {
                        headers: {
                            "Custom-Header": "value",
                        }
                    });
                    if (res.status === 201) {
                        setLoading(false);
                        nav("/manager/posts");
                    }
                } catch (err) {
                    console.error(err);
                    setLoading(false);
                    setAlert(false);

                }
            }

            process();
        }
    }


    return (
        <>
            <div className="w-full relative">
                <ManagerBreadCumb BreadCrumbName="Thêm bài viết"></ManagerBreadCumb>
                <div className="px-5 md:px-20 py-10">
                    <h2 className="text-2xl font-bold leading-7 text-primary">Thêm bài viết mới</h2>
                    <form onSubmit={(e) => addPost(e)} className="flex flex-col gap-5 my-5 rounded-xl shadow-xl p-10 bg-white">
                        <div className="w-full">
                            <div className="flex gap-0.5 items-center">
                                <label htmlFor="motelId" className="block mb-2 text-lg text-gray-900 ">Nhà trọ </label>
                                <h1 className="text-lg text-red-600">*</h1>
                            </div>
                            <div className="w-full flex gap-5 items-center">
                                <select id="motelId" name="motelId" onChange={(e) => changePostRentDetail(e.target.value, e.target.name)} value={postRentDetail?.motelId} className="w-[85%] border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary">
                                    <option value={undefined} disabled>-- Chọn nhà trọ --</option>
                                    {motels && motels.map((motel: any, index) => (
                                        <option key={index} value={motel.id}>
                                            {motel.name}
                                        </option>
                                    ))}
                                </select>
                                <Button className="bg-primary w-[15%]">
                                    <Link to="/manager/motels/add" className="flex items-center gap-2">
                                        <RiAddLine size="18" color='white' />
                                        <p className="text-md">
                                            Thêm nhà trọ
                                        </p>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-0.5 items-center">
                                <label htmlFor="title" className="block mb-2 text-lg text-gray-900 ">Tiêu đề </label>
                                <h1 className="text-lg text-red-600">*</h1>
                            </div>
                            <input value={post?.title} onChange={e => changePost(e.target.value, e.target.name)} type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" />
                            <p id="standard_error_help" className="mt-2 text-xs text-red-600">{postErrors && postErrors.title}</p>
                        </div>
                        <div className="w-full">
                            <div className="flex gap-0.5 items-center">
                                <label htmlFor="description" className="block mb-2 text-lg text-gray-900 ">Nội dung </label>
                                <h1 className="text-lg text-red-600">*</h1>
                            </div>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    value={post?.description}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm sm:leading-6"
                                    defaultValue={''}
                                    onChange={e => changePost(e.target.value, e.target.name)}
                                />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">Viết một tiện ích nhà trọ như bãi gửi xe, mô tả , ...</p>
                            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{postErrors && postErrors.description}</p>

                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <div className="flex gap-0.5 items-center">
                                    <label htmlFor="price" className="block mb-2 text-lg text-gray-900 ">Giá thuê trọ </label>
                                    <h1 className="text-lg text-red-600">*</h1>
                                </div>
                                <div className="relative w-full mt-2">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    </div>
                                    <input value={postRentDetail?.price}
                                        onChange={e => changePostRentDetail(e.target.value, "price")}
                                        type="text" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-36 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" placeholder="Vd: 3000000..." />
                                    <div className="absolute block inset-y-0 right-0 flex items-center px-3">
                                        <span className="border-l-2 pl-3 text-gray-500 dark:text-gray-400">
                                            VND / tháng
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{postRentDetailErrors && postRentDetailErrors.price}</p>
                            </div>
                            <div className="sm:col-span-6 sm:col-start-1">
                                <div className="flex gap-0.5 items-center">
                                    <label htmlFor="area" className="block mb-2 text-lg text-gray-900 ">Diện tích </label>
                                    <h1 className="text-lg text-red-600">*</h1>
                                </div>
                                <div className="relative w-full mt-2">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    </div>
                                    <input
                                        onChange={e => changePostRentDetail(e.target.value, "area")}

                                        value={postRentDetail?.area} id="area" type="number" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-14 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" />
                                    <div className="absolute block inset-y-0 right-0 flex items-center px-3">
                                        <span className="border-l-2 pl-3 text-gray-500 dark:text-gray-400">
                                            m²
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{postRentDetailErrors && postRentDetailErrors.area}</p>
                            </div>

                            <div className="sm:col-span-3">
                                <div className="flex gap-0.5 items-center">
                                    <label htmlFor="minPeople" className="block mb-2 text-lg text-gray-900 ">Số lượng người ở tối thiểu</label>
                                    <h1 className="text-lg text-red-600">*</h1>
                                </div>
                                <div className="relative w-full mt-2">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    </div>
                                    <input
                                        onChange={e => changePostRentDetail(e.target.value, "minPeople")}

                                        value={postRentDetail?.minPeople} id="people" type="number" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-20 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" />
                                    <div className="absolute block inset-y-0 right-0 flex items-center px-3">
                                        <span className="border-l-2 pl-3 text-gray-500 dark:text-gray-400">
                                            người
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{postRentDetailErrors && postRentDetailErrors.minPeople}</p>
                            </div>

                            <div className="sm:col-span-3">
                                <div className="flex gap-0.5 items-center">
                                    <label htmlFor="maxPeople" className="block mb-2 text-lg text-gray-900 ">Số lượng người ở tối đa</label>
                                    <h1 className="text-lg text-red-600">*</h1>
                                </div>
                                <div className="relative w-full mt-2">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    </div>
                                    <input value={postRentDetail?.maxPeople}
                                        onChange={e => changePostRentDetail(e.target.value, "maxPeople")}
                                        id="people" type="number" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-20 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" />
                                    <div className="absolute block inset-y-0 right-0 flex items-center px-3">
                                        <span className="border-l-2 pl-3 text-gray-500 dark:text-gray-400">
                                            người
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{postRentDetailErrors && postRentDetailErrors.maxPeople}</p>

                            </div>

                            <div className="sm:col-span-3">
                                <div className="flex gap-0.5 items-center">
                                    <label htmlFor="bathroom" className="block mb-2 text-lg text-gray-900 ">Số phòng tắm</label>
                                    <h1 className="text-lg text-red-600">*</h1>
                                </div>
                                <div className="relative w-full mt-2">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    </div>
                                    <input value={postRentDetail?.numOfBathrooms}
                                        onChange={e => changePostRentDetail(e.target.value, "numOfBathrooms")}
                                        id="bathroom" type="number" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-24 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" />
                                    <div className="absolute block inset-y-0 right-0 flex items-center px-3">
                                        <span className="border-l-2 pl-3 text-gray-500 dark:text-gray-400">
                                            phòng
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{postRentDetailErrors && postRentDetailErrors.numOfBathrooms}</p>

                            </div>
                            <div className="sm:col-span-3">
                                <div className="flex gap-0.5 items-center">
                                    <label htmlFor="bedroom" className="block mb-2 text-lg text-gray-900 ">Số phòng ngủ</label>
                                    <h1 className="text-lg text-red-600">*</h1>
                                </div>
                                <div className="relative w-full mt-2">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    </div>
                                    <input value={postRentDetail?.numOfBedrooms}
                                        onChange={e => changePostRentDetail(e.target.value, "numOfBedrooms")}
                                        id="bedroom" type="number" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-24 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" />
                                    <div className="absolute block inset-y-0 right-0 flex items-center px-3">
                                        <span className="border-l-2 pl-3 text-gray-500 dark:text-gray-400">
                                            phòng
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{postRentDetailErrors && postRentDetailErrors.numOfBedrooms}</p>

                            </div>
                        </div>
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
                                <h1 className="font-bold text-xl">Ảnh đã thêm:</h1>
                                {postImages.map((file, index) => (
                                    <div className="col-span-1 relative w-32 h-32">
                                        <IoClose size="25" className="text-red-600 bg-white rounded-lg absolute right-2 top-2 cursor-pointer" onClick={() => handleDelete(file)} />
                                        <img key={index} className="rounded-xl w-full h-full object-cover" src={URL.createObjectURL(file)} alt={file.name} />
                                    </div>
                                ))}
                            </div>)}
                            <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{postImages.length < 3 && 'Ít nhất 3 ảnh'}</p>
                        </div>
                        {loading === true ? <>
                            <div className="w-full flex">
                                <div className="ml-auto px-5 py-2 flex gap-2 items-center">
                                    <Spinner size="md" className="fill-primary"></Spinner>
                                    <h2 className="font-bold text-primary">Đang xử lý</h2>
                                </div>
                            </div>
                        </> : <button type="submit" className="ml-auto w-40 text-white bg-primary hover:bg-secondary focus:ring-2 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 focus:outline-none">Thêm bài viết</button>
                        }
                    </form>
                </div>
                {alert ? <>
                    <Toast className="absolute left-5 bottom-24">
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                            <HiXMark className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">
                            Có lỗi xảy ra, vui lòng thử lại
                        </div>
                        <Toast.Toggle onClick={() => { setAlert(false) }} />
                    </Toast>
                </> : <></>}
            </div>

        </>
    );
};

export default AddPost;
