import { useContext, useEffect, useState } from 'react'
import { UserContext, UserContextType } from '../../App'
import './style.scss'
import { GrLocation } from 'react-icons/gr';
import { RiSearch2Line } from 'react-icons/ri';
import { Button } from 'flowbite-react';
import API, { endpoints } from '../../configs/API';
import RecommendList from '../../components/RecommendList';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {
    const [posts, setPosts] = useState([]);
    const [, setIsScrolled] = useState(false);
    const context = useContext<UserContextType | undefined>(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { currentUser } = context;

    const [params, setParams] = useState({});
    const [paramString, setParamString] = useState("");

    const [results, setResults] = useState<any[]>([]);

    const [address, setAddress] = useState("");

    const [isSelect, setIsSelect] = useState<boolean>(false);
    const myQuery = useDebounce(address, 300);
    const [isFocused, setIsFocused] = useState<boolean>(false);

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

    useEffect(() => {
        if (!myQuery[0]) {
            setResults([]);
        }
        else if (myQuery[0] && isSelect === false) {
            getDatas(myQuery[0]);
        }
    }, [myQuery[0]])

    const handleResult = (e: any) => {
        setAddress(e.target.value);
    };

    const geteocode = async (placeId: any) => {
        const res = await API.get(endpoints["mapDetail"], {
            params: {
                placeId: placeId,
            }
        })
        const data = await res.data;
        const pr = {
            "location": data.result.formatted_address,
            "latitude": data.result.geometry.location.lat,
            "longitude": data.result.geometry.location.lng
        }
        setParams((current: any) => {
            return { ...current, ...pr };
        });

    }

    const handleSelectPlace = (e: any) => {
        setIsSelect(true);
        setAddress(e.target.innerHTML);
        setTimeout(() => {
            setIsSelect(false);
            geteocode(e.target.dataset.placeId);
            setIsFocused(false);
        }, 305);

    };

    useEffect(() => {
        let str = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
        setParamString(str);
    }, [params]);


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const getPosts = async () => {
            try {
                let res = await API.get(endpoints['posts'], {
                    params: {
                        page: 1,
                        type: "landlordPost",
                    }
                });
                if (res.status === 200) {
                    setPosts(res.data.posts);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getPosts();

    }, []);

    return (
        <>
            <section className="relative mx-12 mt-4 rounded-[15px] h-[800px] flex items-center bg-no-repeat bg-[url('https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg')] bg-cover bg-right md:bg-center bg-primary/10 bg-blend-multiply">
                <div className="flex h-full items-center">
                    <div className="text-center h-fit w-full grid grid-cols-1 md:grid-cols-2 gap-3 px-12 justify-center">
                        <div className="col-span-1">
                            <h1 className="font-bold drop-shadow-lg leading-snug text-5xl text-white text-left">Tìm nhà trọ an toàn và phù hợp nhất cho bạn</h1>
                            <div className="shadow-lg bg-white/10 rounded-lg p-8 grid grid-cols-1 md:grid-cols-5 gap-x-3 gap-y-5 mt-8 backdrop-blur-sm">
                                <div className="col-span-full md:col-span-2 relative">
                                    <label htmlFor="location-search" className="mb-2 text-sm font-medium sr-only text-gray-900">Search location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <GrLocation className="text-gray-900" size={20} />
                                        </div>
                                        <input type="search" id="location-search" value={address}
                                            onChange={e => handleResult(e)}
                                            onFocus={() => setIsFocused(true)}
                                            className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary/25 focus:border-primary" placeholder="Nhập khu vực..." />
                                    </div>
                                    <ul className={isFocused ? "absolute bg-white z-50 shadow mt-1 rounded-lg w-full py-2 text-sm text-dark dark:text-gray-200" : "hidden"}>
                                        {results.map((result) => (
                                            <li onClick={(e) => handleSelectPlace(e)} className="cursor-pointer px-4 py-2 hover:bg-primary hover:text-white" data-place-id={result.place_id}>{result.description}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-span-full md:col-span-2">
                                    <label htmlFor="keyword-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search keyword</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <RiSearch2Line className="text-gray-900" size={20} />
                                        </div>
                                        <input type="search" id="keyword-search"
                                            onChange={e => {
                                                setParams((current: any) => {
                                                    return { ...current, "kw": e.target.value };
                                                });
                                            }}
                                            className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary/25 focus:border-primary" placeholder="Nhập từ khóa..." />
                                    </div>
                                </div>
                                <div className="col-span-full md:col-span-1">
                                    <Link to={'/posts' + '?' + paramString}>
                                        <Button className="bg-primary shadow-lg enabled:hover:bg-secondary h-full w-full"
                                        //  onClick={() => handleFilterClick()}
                                        >
                                            <p className="text-base ms-2 font-bold">Tìm</p>
                                        </Button>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <section className="py-12">
                <h1 className="text-center text-3xl font-bold text-primary">Tin cho thuê mới</h1>
                <div className="container mx-auto mt-4">
                    <RecommendList recommendList={posts}></RecommendList>

                </div>
            </section>

        </>
    );
};

export default Home;