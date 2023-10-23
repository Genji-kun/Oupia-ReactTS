import { Badge, Dropdown, Table, Tooltip } from 'flowbite-react';
import React from 'react';
import { RiAddFill, RiSearch2Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Motel } from '../../../interfaces/Motel';
import API, { endpoints } from '../../../configs/API';
import { UserContext, UserContextType } from '../../../App';
import { LuEraser, LuEye, LuPencilLine } from 'react-icons/lu';
import ManagerBreadCumb from '../../../components/MyBreadCumb/ManagerBreadCumb';
import { AiOutlineClockCircle } from 'react-icons/ai';

const MotelManager: React.FC = () => {
  const userContext = React.useContext<UserContextType | undefined>(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { currentUser } = userContext;

  const [motels, setMotels] = React.useState<Motel[] | undefined>(undefined);

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
  

  if (!motels) {
    return <></>
  }

  return (
    <>
      <ManagerBreadCumb BreadCrumbName='Nhà trọ'></ManagerBreadCumb>
      <div className="flex flex-col p-5 pt-0 w-full ">
        <div className="flex items-center mb-5 pt-5">
          <div>
            <div className="flex gap-2 items-center">
              <h1 className="font-semibold text-lg">Nhà trọ</h1>
              <Badge
                color="info"
                size="sm"
                className="rounded-lg px-3"
              >{motels.length} nhà trọ</Badge>
            </div>
            <h1 >Danh sách nhà trọ</h1>
          </div>
          <div className="flex ml-auto gap-2 items-center">
            <div className="w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <RiSearch2Line className="text-gray-900" size={20} />
                </div>
                <input type="search" id="location-search"
                  // onChange={(evt) => updateResult(evt)}
                  className="h-full block w-full pl-10 p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Nhập nhà trọ..." />
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
                Tên nhà trọ
              </Table.HeadCell>
              <Table.HeadCell className="py-5 text-secondary text-sm">
                Địa chỉ
              </Table.HeadCell>
              <Table.HeadCell className="py-5 text-secondary text-sm">
                <span className="sr-only">
                  Button
                </span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <>
                {motels.map((motel, index: number) => (

                  <Table.Row key={index} className="hover:bg-p10">
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      <img src={motel.image} className="h-32 w-32 rounded-lg object-cover " />
                    </Table.Cell>
                    <Table.Cell>
                      {motel.name}
                    </Table.Cell>
                    <Table.Cell>
                      {motel.fullLocation}
                    </Table.Cell>
                    <Table.Cell className="w-fit">
                      <div className="flex gap-2">
                        <Tooltip content="Xem chi tiết">
                          <LuEye size="24" className="hover:text-primary" />
                        </Tooltip>
                        <Tooltip content="Chỉnh sửa">
                          <LuPencilLine size="24" className="hover:text-primary" />
                        </Tooltip>
                        <Tooltip content="Xóa">
                          <LuEraser size="24" className="hover:text-red-600" />
                        </Tooltip>
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
        <Tooltip content="Thêm nhà trọ mới" className="w-36">
          <Link to="/manager/motels/add">
            <button className="bg-primary p-2 rounded-full hover:bg-secondary">
              <RiAddFill className="text-white" size="36"></RiAddFill>
            </button>
          </Link>
        </Tooltip>
      </div>
    </>
  );
};

export default MotelManager;
