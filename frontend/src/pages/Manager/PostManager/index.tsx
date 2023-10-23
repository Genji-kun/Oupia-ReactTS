import React, { useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../../../App';
import { Post } from '../../../interfaces/Post';
import API, { authApi, endpoints } from '../../../configs/API';
import ManagerBreadCumb from '../../../components/MyBreadCumb/ManagerBreadCumb';
import { Badge, Button, Dropdown, Modal, Table, Tooltip } from 'flowbite-react';
import { RiAddFill, RiSearch2Line } from 'react-icons/ri';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { LuEraser, LuEye, LuPencilLine } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import formatCurrency from '../../../utils/priceUtils';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { schemaPost, schemaPostRentDetail } from '../../../validators/yupValidator';
import { PostRentDetail } from '../../../interfaces/PostRentDetail';

const PostManager: React.FC = () => {
  const userContext = React.useContext<UserContextType | undefined>(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { currentUser } = userContext;

  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  const [openModal, setOpenModal] = useState<string | undefined>();
  const props = { openModal, setOpenModal };
  const [selectedPost, setSelectedPost] = React.useState<Post>();
  const [postRentDetail, setPostRentDetail] = React.useState<PostRentDetail>();
  const [postErrors, setPostErrors] = React.useState<any>();
  const [postRentDetailErrors, setPostRentDetailErrors] = React.useState<any>();


  useEffect(() => {
    const getPost = async () => {
      try {
        let res = await API.get(endpoints['posts'], {
          params: {
            userId: currentUser?.id
          }
        });
        if (res.status === 200) {
          setPosts(res.data.posts);
        }
      } catch (ex: any) {
        throw new Error("Xảy ra lỗi khi truy xuất");
      }
    }
    getPost();
  }, []);

  const removePost = async (post: any) => {
    if (post)
      try {
        console.log(post.title);
        return;
        const url = endpoints.postInfo(post.slug);
        const res = await authApi().delete(url);

        if (res.status === 204) {
          alert("Xóa thành công")
        }


      } catch (err) {
        console.error(err);
      }
  }

  React.useEffect(() => {
    const validatePost = async () => {
      let schemas = [schemaPost];
      let data = [selectedPost];

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
  }, [selectedPost, postRentDetail]);


  const changePost = (value: string | number, field: string) => {
    setSelectedPost((current: any) => {
      return { ...current, [field]: value }
    })
  }

  const changePostRentDetail = (value: string | number, field: string) => {
    setPostRentDetail((current: any) => {
      return { ...current, [field]: value }
    })
  }

  const updatePost = async (evt: any) => {
    evt.preventDefault();


    if (Object.keys(postErrors).length > 0 || Object.keys(postRentDetailErrors).length > 0) {
      alert("lỗi")
      return;
    }

    else {
      const process = async () => {
        try {
          let form = new FormData();
          setSelectedPost((current: any) => {
            return { ...current, "postRentDetail": postRentDetail, "userId": currentUser }
          })
          form.append('post', JSON.stringify(selectedPost));


          let res = await authApi().patch(endpoints['addPostRent'], form, {
            headers: {
              "Custom-Header": "value",
            }
          });
          if (res.status === 200) {
            alert("Sửa thành công")
          }
        } catch (err) {
          console.error(err);
          // setLoading(false);
          // setAlert(false);
        }
      }

      process();
    }
  }

  if (!posts) {
    return <></>
  }

  return (
    <>
      <ManagerBreadCumb BreadCrumbName='Bài viết'></ManagerBreadCumb>
      <div className="flex flex-col p-5 pt-0 w-full ">
        <div className="flex items-center mb-5 pt-5">
          <div>
            <div className="flex gap-2 items-center">
              <h1 className="font-semibold text-lg">Bài viết</h1>
              <Badge
                color="info"
                size="sm"
                className="rounded-lg px-3"
              >{posts && posts.length} bài</Badge>
            </div>
            <h1 >Danh sách bài viết</h1>
          </div>
          <div className="flex ml-auto gap-2 items-center">
            <div className="w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <RiSearch2Line className="text-gray-900" size={20} />
                </div>
                <input type="search" id="location-search"
                  // onChange={(evt) => updateResult(evt)}
                  className="h-full block w-full pl-10 p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Nhập tiêu đề bài viết..." />
              </div>
            </div>
            <Dropdown
              label={<div className="flex gap-2 items-center"><AiOutlineClockCircle size="20"></AiOutlineClockCircle><h1>Tất cả</h1></div>}
            >
              <ul className="p-3 space-y-1 text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHelperRadioButton">
                <li>
                  <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex gap-2 items-center h-5">
                      <input checked={true} id="helper-radio-4" name="helper-radio" type="radio" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                    </div>
                    <div className="ml-2 ">
                      <label className=" text-gray-900 dark:text-gray-300">
                        <div>Tất cả</div>
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex gap-2 items-center h-5">
                      <input name="helper-radio" type="radio" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                    </div>
                    <div className="ml-2 ">
                      <label className=" text-gray-900 dark:text-gray-300">
                        <div>Hôm nay</div>
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex gap-2 items-center h-5">
                      <input name="helper-radio" type="radio" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                    </div>
                    <div className="ml-2 ">
                      <label className=" text-gray-900 dark:text-gray-300">
                        <div>Tháng này</div>
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex gap-2 items-center h-5">
                      <input name="helper-radio" type="radio" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                    </div>
                    <div className="ml-2 ">
                      <label className=" text-gray-900 dark:text-gray-300">
                        <div>Năm nay</div>
                      </label>
                    </div>
                  </div>
                </li>
              </ul>
            </Dropdown>
          </div>
        </div >
        <div className="bg-white shadow-xl rounded-xl">
          <Table>
            <Table.Head className="border-b-2 border-gray-200">
              <Table.HeadCell className="py-5 text-secondary text-sm">
                Ảnh
              </Table.HeadCell >
              <Table.HeadCell className="py-5 text-secondary text-sm">
                Tiêu đề
              </Table.HeadCell>
              <Table.HeadCell className="py-5 text-secondary text-sm">
                Giá
              </Table.HeadCell>
              <Table.HeadCell className="py-5 text-secondary text-sm">
                <span className="sr-only">
                  Button
                </span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <>
                {posts && posts.map((post, index: number) => (

                  <Table.Row key={index} className="hover:bg-p10">
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      <img src={post.image} className="h-32 w-32 rounded-lg object-cover " />
                    </Table.Cell>
                    <Table.Cell>
                      {post.title}
                    </Table.Cell>
                    <Table.Cell className="text-primary font-bold">
                      {formatCurrency(post.postRentDetail.price) + "đ"}
                    </Table.Cell>
                    <Table.Cell className="w-fit">
                      <div className="flex gap-2">
                        <Tooltip content="Xem chi tiết">
                          <LuEye onClick={() => props.setOpenModal('view')} size="24" className="hover:text-primary cursor-pointer" />
                        </Tooltip>
                        <Modal show={props.openModal === 'view'} size="7xl" onClose={() => props.setOpenModal(undefined)} className="bg-gray-200/10">
                          <Modal.Header>Thông tin bài đăng</Modal.Header>
                          <Modal.Body>
                            <div className="w-full px-20 grid grid-cols-2 gap-10">
                              <div>
                                <h1>Tiêu đề:</h1>
                                <h1>Nội dung:</h1>
                              </div>
                              <div>
                                <p>{post.title}</p>
                                <p>{post.description}</p>
                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={() => props.setOpenModal(undefined)}>Đóng</Button>
                          </Modal.Footer>
                        </Modal>
                        <Tooltip content="Chỉnh sửa">
                          <LuPencilLine onClick={() => {
                            setSelectedPost(post);
                            setPostRentDetail(post.postRentDetail);
                            props.setOpenModal('edit')
                          }} size="24" className="hover:text-primary cursor-pointer" />
                        </Tooltip>
                        <Modal show={props.openModal === 'edit'} size="7xl" onClose={() => props.setOpenModal(undefined)} className="bg-gray-200/10">
                          <Modal.Header>Thông tin bài đăng</Modal.Header>
                          <Modal.Body>
                            <div className="w-full px-20">
                              <form onSubmit={(e) => updatePost(e)} className="flex flex-col gap-5 my-5 rounded-xl shadow-xl p-10 bg-white">
                                <div>
                                  <div className="flex gap-0.5 items-center">
                                    <label htmlFor="title" className="block mb-2 text-lg text-gray-900 ">Tiêu đề </label>
                                    <h1 className="text-lg text-red-600">*</h1>
                                  </div>
                                  <input value={selectedPost?.title} onChange={e => changePost(e.target.value, e.target.name)} type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" />
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
                                      value={selectedPost?.description}
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm sm:leading-6"
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
                                <button type="submit" className="ml-auto w-40 text-white bg-primary hover:bg-secondary focus:ring-2 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 focus:outline-none">Sửa bài viết</button>

                                {/* {loading === true ? <>
                                  <div className="w-full flex">
                                    <div className="ml-auto px-5 py-2 flex gap-2 items-center">
                                      <Spinner size="md" className="fill-primary"></Spinner>
                                      <h2 className="font-bold text-primary">Đang xử lý</h2>
                                    </div>
                                  </div>
                                } */}
                              </form>
                            </div>
                          </Modal.Body>
                        </Modal>
                        <Tooltip content="Xóa">
                          <LuEraser onClick={() => {
                            props.setOpenModal('pop-up');

                          }} size="24" className="hover:text-red-600 cursor-pointer" />
                        </Tooltip>
                        <Modal show={props.openModal === 'pop-up'} size="md" popup onClose={() => props.setOpenModal(undefined)} className="bg-gray-200/10">
                          <Modal.Header />
                          <Modal.Body>
                            <div className="text-center">
                              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Bạn muốn xóa bài viết?
                              </h3>
                              <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={() => {
                                  removePost(selectedPost)
                                  props.setOpenModal(undefined);
                                }}>
                                  Xóa bài viết
                                </Button>
                                <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
                                  Hủy
                                </Button>
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal>
                      </div>

                    </Table.Cell>
                  </Table.Row>
                ))}
              </>
            </Table.Body>
          </Table>
        </div>
      </div >
      <div className="fixed bottom-5 right-5 z-999">
        <Tooltip content="Thêm bài viết mới" className="w-36">
          <Link to="/manager/posts/add">
            <button className="bg-primary p-2 rounded-full hover:bg-secondary">
              <RiAddFill className="text-white" size="36"></RiAddFill>
            </button>
          </Link>
        </Tooltip>
      </div>
    </>)
};

export default PostManager;
