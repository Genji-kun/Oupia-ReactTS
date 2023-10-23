import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { Motel } from '../../interfaces/Motel';
import API, { authApi, endpoints } from '../../configs/API';
import { PiClipboardLight, PiDotBold, PiStar, PiUser, PiUsers } from 'react-icons/pi';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import { Button, Card, Modal, Rating } from 'flowbite-react';
import { BsCalendar4 } from 'react-icons/bs';
import { UserContext, UserContextType } from '../../App';
import { Rate } from '../../interfaces/Rate';

export interface RateContextType {
    rateStats: any,
    rateTotal: number,
    rates: Rate[] | undefined,
}

export const RateContext = createContext<RateContextType | undefined>(undefined);

const MotelLayout: React.FC = () => {

    const userContext = useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = userContext;

    const { slugMotel } = useParams();
    const [motel, setMotel] = useState<Motel | undefined>(undefined);
    const [images, setImages] = useState();
    const [rateStats, setRateStats] = useState<any>();
    const [rateTotal, setRateTotal] = useState<number>(0);
    const [rates, setRates] = useState<Rate[] | undefined>();


    const [openModal, setOpenModal] = useState<string | undefined>();
    const props = { openModal, setOpenModal };
    const [currentStar, setCurrentStar] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const [toggle, setToggle] = useState<boolean>(false);
    const [rateCurrentUser, setRateCurrentUser] = useState<Rate | undefined>(undefined);


    useEffect(() => {
        const getMotel = async () => {
            const url = endpoints.motelInfo(slugMotel);
            try {
                let res = await API.get(url);
                if (res.status === 200) {
                    setMotel(res.data);
                }
            } catch (ex) {
                console.error(ex);
            }
        }
        const getImages = async () => {
            try {
                const url = endpoints.motelImages(slugMotel);

                let res = await API.get(url);
                if (res.status === 200) {
                    setImages(res.data);
                }

            } catch (err) {
                console.error(err);
            }
        }

        getImages();
        getMotel();
    }, [slugMotel]);

    useEffect(() => {
        const getRates = async () => {
            try {
                let res = await API.get(endpoints["rates-motels-stats"], {
                    params: {
                        'motelId': motel?.id,
                    }
                });
                if (res.status === 200) {
                    setRateStats(res.data);
                    const detail = res.data.details;
                    let sum = Object.values(detail).reduce((a: any, b: any) => Number(a) + Number(b), 0);
                    setRateTotal(Number(sum));
                }

            } catch (err) {
                console.error(err);
            }
        }

        const getRateList = async () => {
            try {
                let res = await API.get(endpoints["rates-motels"], {
                    params: {
                        'motelId': motel?.id,
                        'userExisted': "1",
                    }
                });
                if (res.status === 200) {
                    setRates(res.data.rates);
                }

            } catch (err) {
                console.error(err);
            }
        }
        if (motel) {
            getRates();
            getRateList();
        }
    }, [motel, toggle])

    const sendRate = () => {

        const process = async (rate: Rate) => {
            try {
                const res = await authApi().post(endpoints["rates"], rate);
                if (res.status === 201) {
                    setRateCurrentUser(rate);
                    props.setOpenModal(undefined);
                    setToggle(!toggle);
                }
            } catch (err) {
                console.error(err);
            }

        }
        if (currentStar < 1) {
            alert("Vuii lòng chọn số sao lúc đánh giá");
            return;
        }
        if (!motel || !currentUser) {
            return;
        }

        const rate: Rate = {
            rateStars: currentStar,
            content: content,
            userId: currentUser,
            motelId: motel
        }
        process(rate);
    }

    useEffect(() => {
        if (currentUser) {
            const getRateCurrentUser = async () => {
                try {
                    const data: any = {
                        userId: currentUser.id,
                        motelId: motel?.id
                    };
                    const res = await authApi().get(endpoints["rate-user-motel"], {
                        params: data
                    });
                    if (res.status === 200) {
                        setRateCurrentUser(res.data);
                    }

                } catch (ex) {
                    console.error(ex);
                }
            }
            if (motel) {
                getRateCurrentUser();
            }
        } else {
            setRateCurrentUser(undefined);
        }
    }, [currentUser, motel]);

    if (!motel) return <></>

    return (
        <>
            <>
                <div>
                    <div className=" bg-wallpaper bg-dark">
                        <div className="grid grid-cols-10 gap-2 w-full">
                            <div className=" relative md:col-span-3 col-span-10 h-full">
                                <div className="absolute img-translate-y top-full z-999 left-1/2 w-56 h-56 ring-[5px] ring-white shadow-xl">
                                    <img
                                        src={images && images[0]}
                                        alt="Avatar"
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-7 absolute sm:block">
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-10 grid-row-2 gap-2">
                        <div className="md:col-span-3 col-span-10 hidden md:block row-span-2 md:mx-16">
                            <Card className="w-full mt-36 pb-2x">
                                <h5 className="tracking-tight text-gray-900 dark:text-white">
                                    <p className="text-xl font-bold ">
                                        Giới thiệu
                                    </p>
                                </h5>
                                <hr />
                                <div className="flex gap-2">
                                    <PiUser size="21" />
                                    <h3>Chủ nhà trọ: </h3>
                                    <h3 className="font-bold">{motel?.userId.fullName}</h3>

                                </div>
                                <div className="flex gap-2">
                                    <BsCalendar4 size="21" />
                                    <h3>Ngày tạo: </h3>
                                    <h3>{motel?.createdAt?.toString().split(" ")[0]}</h3>
                                </div>
                            </Card>
                        </div>
                        <div className="md:col-span-6 col-span-10 mt-36 md:mt-0">
                            <div className="flex flex-col mt-5 gap-2">
                                <h1 className="text-3xl font-bold text-left">{motel?.name}</h1>
                                <div className="flex">
                                    <div className="lg:w-auto w-full gap-3 text-gray-500 items-start">
                                        <div className="flex gap-2">
                                            <div className="flex gap-3">
                                                <PiStar size="21" />
                                                <h3 className="font-bold">{rateStats?.avg ? rateStats?.avg : 0}</h3>
                                            </div>
                                            <PiDotBold size="25" />
                                            <div className="flex gap-3">
                                                <PiUsers size="21" />
                                                <h3 className="font-bold">{rateTotal + " người đánh giá"} </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-auto flex gap-5">
                                    {<>
                                        <Button onClick={() => { props.setOpenModal("open") }} className="bg-primary font-semibold text-base ring-2 ring-primary enabled:hover:bg-secondary focus:bg-secondary"><p>Đánh giá nhà trọ</p></Button>
                                        {!rateCurrentUser ?
                                            <>
                                                <Modal show={props.openModal === 'open'} onClose={() => props.setOpenModal(undefined)}>
                                                    <Modal.Body>
                                                        <div className="flex flex-col gap-5 justify-center">
                                                            <h5 className=" text-lg font-semibold text-dark text-center" >Bạn đánh giá như thế nào về nhà trọ?</h5>
                                                            <div className="w-full flex justify-center" >
                                                                <Rating size="lg">
                                                                    <Rating.Star filled={(currentStar >= 1) ? true : false} onClick={() => { setCurrentStar(1) }} className="cursor-pointer" />
                                                                    <Rating.Star filled={(currentStar >= 2) ? true : false} onClick={() => { setCurrentStar(2) }} className="cursor-pointer" />
                                                                    <Rating.Star filled={(currentStar >= 3) ? true : false} onClick={() => { setCurrentStar(3) }} className="cursor-pointer" />
                                                                    <Rating.Star filled={(currentStar >= 4) ? true : false} onClick={() => { setCurrentStar(4) }} className="cursor-pointer" />
                                                                    <Rating.Star filled={(currentStar === 5) ? true : false} onClick={() => { setCurrentStar(5) }} className="cursor-pointer" />
                                                                </Rating>
                                                            </div>
                                                            <label className="sr-only" htmlFor="content"></label>
                                                            <textarea id="content" className="w-full rounded-lg focus:outline-none focus:ring-primary/10 focus:ring-4 focus:border-primary" rows={4} placeholder='Nhập nội dung đánh giá...' onChange={(evt) => { setContent(evt.target.value) }}></textarea>
                                                        </div>

                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <div className="w-full flex gap-2 justify-center">
                                                            <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
                                                                Hủy
                                                            </Button>
                                                            <Button color="dark" onClick={sendRate}>Gửi</Button>
                                                        </div>
                                                    </Modal.Footer>
                                                </Modal>
                                            </> : <>
                                                <Modal show={props.openModal === 'open'} onClose={() => props.setOpenModal(undefined)}>
                                                    <Modal.Body>
                                                        <div className="flex flex-col gap-5 justify-center">
                                                            <div className="flex flex-col gap-5 justify-center">
                                                                <h5 className=" text-lg font-semibold text-dark text-center" >Bạn đã đánh giá nhà trọ này rồi !!!</h5>
                                                                <hr className="w-96 border-dark mx-auto" />
                                                                <h5 className=" text-lg font-semibold text-dark text-center" >Đánh giá về nhà trọ của bạn</h5>
                                                                <div className="w-full flex justify-center" >
                                                                    <Rating size="lg">
                                                                        <Rating.Star filled={(rateCurrentUser.rateStars >= 1) ? true : false} />
                                                                        <Rating.Star filled={(rateCurrentUser.rateStars >= 2) ? true : false} />
                                                                        <Rating.Star filled={(rateCurrentUser.rateStars >= 3) ? true : false} />
                                                                        <Rating.Star filled={(rateCurrentUser.rateStars >= 4) ? true : false} />
                                                                        <Rating.Star filled={(rateCurrentUser.rateStars === 5) ? true : false} />
                                                                    </Rating>
                                                                </div>
                                                                <label className="sr-only" htmlFor="content"></label>
                                                                <p id="content" className="w-full rounded-lg font-medium text-left p-5 border-2 border-gray-200"> {rateCurrentUser.content}</p>
                                                            </div>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <div className="w-full flex gap-2 justify-center">
                                                            <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
                                                                Trở về
                                                            </Button>
                                                        </div>
                                                    </Modal.Footer>
                                                </Modal>
                                            </>
                                        }
                                    </>
                                    }

                                </div>
                            </div>
                            <div>
                                <hr className="mt-10" />
                                <div className="flex text-center flex-wrap -mb-px border-b border-gray-200 dark:border-gray-700">
                                    <NavLink to={`/motels/${motel?.slug}/posts`} className="tab-item flex font-bold items-center justify-center p-4 text-sm first:ml-0 focus:outline-none rounded-t-lg border-b-2 border-transparent text-gray-500">
                                        <PiClipboardLight size="20" className="mr-2" />
                                        <p className="mt-1">Bài viết</p>
                                    </NavLink>
                                    <NavLink to={`/motels/${motel?.slug}/rating`} className="tab-item flex font-bold items-center justify-center p-4 text-sm first:ml-0 focus:outline-none rounded-t-lg border-b-2 border-transparent text-gray-500">
                                        <PiStar size="20" className="mr-2" />
                                        <p className="mt-1">Đánh giá</p>
                                    </NavLink>
                                    <NavLink to={`/motels/${motel?.slug}/map`} className="tab-item flex font-bold items-center justify-center p-4 text-sm first:ml-0 focus:outline-none rounded-t-lg border-b-2 border-transparent text-gray-500">
                                        <LiaMapMarkedAltSolid size="20" className="mr-2" />
                                        <p className="mt-1">Bản đồ</p>
                                    </NavLink>
                                </div>
                                <div>
                                    <RateContext.Provider value={{ rateStats, rateTotal, rates }}>
                                        <Outlet />
                                    </RateContext.Provider>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 hidden md:block"></div>
                    </div>
                </div >
            </>
        </>
    );
};

export default MotelLayout;
