import React, { useContext } from 'react'
import { BiArea, BiBath } from 'react-icons/bi'
import { GrLocation } from 'react-icons/gr'
import { HiOutlineHomeModern } from 'react-icons/hi2'
import { LiaPhoneSolid } from 'react-icons/lia'
import { LuBedSingle } from 'react-icons/lu'
import { PiHeartBold, PiHeartBreakFill, PiHeartFill, PiShareFat, PiUsersThree } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import formatCurrency from '../../../../utils/priceUtils'
import API, { authApi, endpoints } from '../../../../configs/API'
import { Favourite } from '../../../../interfaces/Favourite'
import { UserContext, UserContextType } from '../../../../App'
import goongJs from '@goongmaps/goong-js';
import { Card, Carousel, Timeline } from 'flowbite-react'
import { PostRentContext, PostRentContextType } from '../..'
import { IoClose } from 'react-icons/io5'
import { useDebounce } from 'use-debounce'
import * as polyline from '@mapbox/polyline';

const PostContent: React.FC = () => {

    const postRentContext = useContext<PostRentContextType | undefined>(PostRentContext);
    if (!postRentContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { post, images, motelImage } = postRentContext;

    const price = formatCurrency(post.postRentDetail.price);

    const userContext = useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = userContext;

    const [favour, setFavour] = React.useState<Favourite | null>(null);
    const [isHeartHover, setIsHeartHover] = React.useState(false);
    const [map, setMap] = React.useState<any>(null);
    const [, setMarker] = React.useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const key = import.meta.env.VITE_GOONG_MAPS_MAPTILES_KEY;
    goongJs.accessToken = key;

    React.useEffect(() => {
        if (currentUser && post) {
            const getFavourStatus = async () => {
                try {
                    const res = await authApi().get(endpoints["favour"], {
                        params: {
                            userId: currentUser.id,
                            postId: post.id
                        }
                    });

                    if (res.status === 200) {
                        setFavour(res.data);
                    }
                    else {
                        setFavour(null);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            getFavourStatus();
        }

    }, [currentUser, post])

    const addFavour = async () => {
        try {
            const favourite = {
                postId: post,
            }
            const res = await authApi().post(endpoints["favour"], favourite);

            if (res.status === 201) {
                setFavour(res.data);
            }
            else {
                alert("error");
                setFavour(null);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const removeFavour = async () => {
        try {
            const res = await authApi().delete(endpoints["favour"], {
                params: {
                    favId: favour?.id
                }
            });

            if (res.status === 204) {
                setFavour(null);
            }
            else {
                alert("error");
            }
        } catch (err) {
            console.error(err);
        }
    }



    const [mapReady, setMapReady] = React.useState(false);

    React.useEffect(() => {
        if (post) {
            if (document.querySelector("#map")?.innerHTML === "") {
                if (post.postRentDetail.motelId.locationLongitude && post.postRentDetail.motelId.locationLatitude) {
                    setMap(new goongJs.Map({
                        container: 'map',
                        style: 'https://tiles.goong.io/assets/goong_map_web.json',
                        center: [post.postRentDetail.motelId.locationLongitude, post.postRentDetail.motelId.locationLatitude],
                        zoom: 20
                    }));
                    setMapReady(true);
                }
            }
        }
    }, [post]);

    React.useEffect(() => {
        if (!post) {
            document.querySelector("#map")!.innerHTML = "";
            setMapReady(false);
        }
    }, [post])

    React.useEffect(() => {
        const initMarker = (x: any, y: any) => {
            if (map)
                setMarker(
                    new goongJs.Marker()
                        .setLngLat([x, y])
                        .addTo(map)
                );
        }
        if (mapReady) {
            initMarker(post.postRentDetail.motelId.locationLongitude, post.postRentDetail.motelId.locationLatitude);
        }
    }, [mapReady, post, map]);

    const [address, setAddress] = React.useState("");
    const [origin, setOrigin] = React.useState("");
    const [destination, setDestination] = React.useState("");
    const [isFocused, setIsFocused] = React.useState<boolean>(false);
    const [isSelect, setIsSelect] = React.useState<boolean>(false);
    const [results, setResults] = React.useState<any[]>([]);
    const myQuery = useDebounce(address, 300);
    const [uniqueId, setUniqueId] = React.useState<String>("");
    const [direction, setDirection] = React.useState<any>(null);
    const [steps, setSteps] = React.useState<any>([]);



    const getDatas = async (queryInput: any) => {
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

    React.useEffect(() => {
        if (!myQuery[0]) {
            setResults([]);
        }
        else if (myQuery[0] && isSelect === false) {
            getDatas(myQuery[0]);
        }
    }, [myQuery[0]])


    const getGeocode = async (placeId: any) => {
        const res = await API.get(endpoints["mapDetail"], {
            params: {
                placeId: placeId,
            }
        })
        const data = await res.data;
        setOrigin(data.result.geometry.location.lat + "," + data.result.geometry.location.lng);
    }

    const handleResult = (e: any) => {
        setAddress(e.target.value);
    };

    const handleSelectPlace = (e: any) => {
        setIsSelect(true);
        setAddress(e.target.innerHTML);
        setTimeout(() => {
            setIsSelect(false);
            getGeocode(e.target.dataset.placeId);
            setIsFocused(false);
        }, 305);

    };

    React.useEffect(() => {
        const getTrip = async () => {
            const res = await API.get(endpoints["mapDirection"], {
                params: {
                    origin: origin,
                    destination: destination,
                    vehicle: 'bike',
                }
            })
            const data = await res.data;
            setDirection(data);
            setSteps(data.routes[0].legs[0].steps)
        }
        if (origin && destination) {
            getTrip();
        }
    }, [origin, destination]);

    const [destinationMarker, setDestinationMarker] = React.useState<any>(null);
    React.useEffect(() => {
        const addRouteToMap = (geoJSON: any) => {
            var originPoint = origin.split(',').map(Number);
            var destinationPoint = destination.split(',').map(Number);
            var bounds = [
                [Math.min(originPoint[1], destinationPoint[1]), Math.min(originPoint[0], destinationPoint[0])],
                [Math.max(originPoint[1], destinationPoint[1]), Math.max(originPoint[0], destinationPoint[0])]
            ];
            var id = origin + "," + destination;
            map?.addSource(id, {
                'type': 'geojson',
                'data': geoJSON
            });
            map?.addLayer({
                'id': id,
                'type': 'line',
                'source': id,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });
            map?.fitBounds(bounds);
            var el = document.createElement('img');
            el.className = 'rounded-full border-2 border-white ring-2 ring-gray-300 h-4 w-4 bg-cover hover:cursor-pointer hover:ring-secondary';
            el.src = 'https://upload.wikimedia.org/wikipedia/commons/b/be/Yellow_Circle.png?20180517184148'

            var marker = new goongJs.Marker(el)
                .setLngLat([originPoint[1], originPoint[0]])
                .addTo(map);
            setDestinationMarker(marker);

            setUniqueId(id);
        }

        if (direction && mapReady) {
            var route = direction.routes[0];
            var geometry_string = route.overview_polyline.points;
            var geoJSON = polyline.toGeoJSON(geometry_string);
            if (destinationMarker) destinationMarker.remove();
            if (uniqueId && map?.getSource(uniqueId)) {
                map.removeLayer(uniqueId);
                map.removeSource(uniqueId);
            }
            addRouteToMap(geoJSON);
        }

    }, [direction]);

    React.useEffect(() => {
        if (post) {
            setDestination(post.postRentDetail.motelId.locationLatitude + "," + post.postRentDetail.motelId.locationLongitude)

        }
    }, [post])

    return (
        <Card className="h-full">
            <Carousel slideInterval={5000} className="mb-5" style={{ height: "600px" }}>
                {images.map((image: any, index: number) => (
                    <div key={index} className='w-full h-full'>
                        <img
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="img"
                            src={image}
                        />
                    </div>
                ))}
            </Carousel>
            <h1 className="text-2xl font-bold text-primary">{post.title}</h1>
            <div className="flex">
                <h3 className="font-semibold text-gray-600 text-lg">{price}đ/tháng</h3>
                <div className="ml-auto flex gap-3 mr-3">
                    {currentUser ? <>
                        <div className="w-fit h-fit cursor-pointer" onClick={() => favour ? removeFavour() : addFavour()} onMouseEnter={() => setIsHeartHover(true)} onMouseLeave={() => setIsHeartHover(false)}>
                            {favour && !isHeartHover && <PiHeartFill size="25" className="text-red-500" />}
                            {!favour && !isHeartHover && <PiHeartBold size="25" className="text-red-500" />}
                            {favour && isHeartHover && <PiHeartBreakFill size="25" className="text-red-500" />}
                            {!favour && isHeartHover && <PiHeartFill size="25" className="text-red-500" />}
                        </div>
                    </> : <>
                        <Link to="/login">
                            <div className="w-fit h-fit cursor-pointer" onMouseEnter={() => setIsHeartHover(true)} onMouseLeave={() => setIsHeartHover(false)}>
                                {favour && !isHeartHover && <PiHeartFill size="25" className="text-red-500" />}
                                {!favour && !isHeartHover && <PiHeartBold size="25" className="text-red-500" />}
                                {favour && isHeartHover && <PiHeartBreakFill size="25" className="text-red-500" />}
                                {!favour && isHeartHover && <PiHeartFill size="25" className="text-red-500" />}
                            </div>
                        </Link>
                    </>}
                    <PiShareFat size="25" className="text-Dark mb-2" />
                </div>
            </div>
            <hr />
            <h2 className="font-semibold text-xl" >Thông tin phòng trọ</h2>
            <div className=" mb-2 flex flex-col gap-2">
                <div className="flex text-gray-700 items-center gap-1">
                    <HiOutlineHomeModern size="25" />
                    <div className="flex gap-3">
                        <h3>Tên nhà trọ:</h3>
                        <h3><Link to={`/motels/${post.postRentDetail.motelId.slug}/posts`} className="block  hover:underline">{post.postRentDetail.motelId.name}</Link></h3>
                    </div>
                </div>
                <div className="flex text-gray-700 items-center gap-1">
                    <LiaPhoneSolid size="25" />
                    <div className="flex gap-3">
                        <h3>Số diện thoại:</h3>
                        <h3>{post.postRentDetail.motelId.phoneNumber}</h3>
                    </div>
                </div>
                <div className="flex text-gray-700 items-center gap-1">
                    <GrLocation size="25" />
                    <div className="flex gap-3">
                        <h3>Địa Chỉ:</h3>
                        <h3><Link to={"/posts?location=" + post.postRentDetail.motelId.fullLocation + "&latitude=" + post.postRentDetail.motelId.locationLatitude + "&longitude=" + post.postRentDetail.motelId.locationLongitude}>{post.postRentDetail.motelId.fullLocation}</Link></h3>
                    </div>
                </div>
            </div>
            <hr />
            <h2 className="font-semibold text-xl" >Đặc điểm phòng trọ</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-2">
                <div className=" p-5 bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700 flex items-center">
                    <BiArea className="mr-3 text-primary" size="25"></BiArea>
                    <h3>{post.postRentDetail.area}m²</h3>
                </div>
                <div className=" p-5 bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700 flex items-center">
                    <LuBedSingle className="mr-3 text-primary" size="25"></LuBedSingle>
                    <h3>{post.postRentDetail.numOfBedrooms} Phòng ngủ</h3>
                </div>
                <div className=" p-5 bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700 flex items-center">
                    <BiBath className="mr-3 text-primary" size="25"></BiBath>
                    <h3>{post.postRentDetail.numOfBathrooms} Phòng tắm</h3>
                </div>
                <div className=" p-5 bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700 flex items-center">
                    <PiUsersThree className="mr-3 text-primary" size="25"></PiUsersThree>
                    <h3>{post.postRentDetail.minPeople} - {post.postRentDetail.maxPeople} người</h3>
                </div>
            </div>
            <hr />
            <h2 className="font-semibold text-xl" >Mô tả chi tiết</h2>
            <div className="whitespace-break-spaces">{post.description}</div>
            <hr />
            <h2 className="font-semibold text-xl" >Địa điểm trên bản đồ</h2>
            <div className="flex relative w-full h-[500px] rounded overflow-x-hidden">
                <div className={`absolute z-30 right-0 top-0 h-full w-2/3 md:w-1/3 transition-all duration-200 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="w-full h-full flex justify-center items-center bg-white relative shadow-lg overflow-y-auto p-5">
                        <button className="absolute bg-white right-2 top-2 ring-primary rounded z-100 hover:text-primary focus:ring-2" onClick={() => setIsSidebarOpen(false)}><IoClose></IoClose></button>
                        <div className="flex flex-col h-full w-full gap-2 text-center items-center justify-center">
                            <div className="h-fit">
                                <div className="w-20 h-20 mx-auto mb-2">
                                    <img
                                        src={motelImage && motelImage[0]}
                                        alt="Avatar"
                                        className="w-full h-full rounded-full ring-4 ring-gray-200 border-4 border-transparent rounded-full"
                                    />
                                </div>
                                <h3 className="font-medium text-primary">{post.postRentDetail.motelId.name}</h3>
                                <h3 className="text-gray-500">{post.postRentDetail.motelId.fullLocation}</h3>
                                <h3 className="font-semibold">{post.postRentDetail.motelId.phoneNumber}</h3>
                            </div>

                            {steps && (
                                <div className="overflow-y-auto w-full p-5 rounded-lg mt-3 bg-gray-50">
                                    <h2 className="mb-3 text-left">Chi tiết chỉ đường:</h2>
                                    <Timeline>
                                        {steps.map((step: any, index: number) =>
                                            <Timeline.Item key={index}>
                                                <Timeline.Point className="z-50 bg-primary" />
                                                <Timeline.Content>
                                                    <Timeline.Body className="text-left">
                                                        <h3 className="text-left font-medium text-secondary">
                                                            {step.html_instructions}
                                                        </h3>
                                                        <p className="text-sm">
                                                            Độ dài: {step.distance.text}
                                                        </p>
                                                        <p className="text-sm">
                                                            Thời gian dự tính: {step.duration.text}
                                                        </p>
                                                    </Timeline.Body>
                                                </Timeline.Content>
                                            </Timeline.Item>
                                        )}
                                    </Timeline>
                                </div>

                            )}

                        </div>
                    </div>
                </div>
                <div className="w-full h-full absolute z-10">
                    <div id="map" className="h-full" />
                </div>
                <div className="absolute flex gap-2 z-20 top-2 left-2">
                    <button className='bg-white shadow-lg text-dark px-5 py-3 font-semibold hover:bg-gray-100' onClick={() => setIsSidebarOpen(true)}>Xem chi tiết</button>
                    <div className="col-span-5 relative">
                        <label htmlFor="location-search" className="mb-2 text-sm font-medium sr-only text-gray-900">Search location</label>
                        <div className="relative h-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <GrLocation className="text-gray-900" size={20} />
                            </div>
                            <input value={address} type="search" id="location-search"
                                onChange={e => handleResult(e)}
                                onFocus={() => setIsFocused(true)}
                                className="h-full block w-full p-4 pl-10 text-gray-900 border-none shadow-lg bg-white focus:ring-primary focus:border-primary" placeholder="Nhập khu vực..." />
                        </div>
                        <ul className={isFocused ? "absolute bg-white z-50 shadow mt-1 w-full py-2 text-sm text-dark dark:text-gray-200" : "hidden"}>
                            {results.map((result, index) => (
                                <li key={index} onClick={(e) => handleSelectPlace(e)} className="cursor-pointer px-4 py-2 hover:bg-primary hover:text-white" data-place-id={result.place_id}>{result.description}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PostContent;
