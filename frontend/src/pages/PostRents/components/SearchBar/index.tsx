import React from 'react'
import { useDebounce } from 'use-debounce'
import { ParamsContext, ParamsContextType } from '../..'
import API, { endpoints } from '../../../../configs/API'
import { GrLocation } from 'react-icons/gr'
import { Button } from 'flowbite-react'
import { LuFilter } from 'react-icons/lu'
import { LiaBedSolid, LiaCoinsSolid } from 'react-icons/lia'
import { PiBathtub, PiUsers, PiUsersThree } from 'react-icons/pi'
import { RiSearch2Line } from 'react-icons/ri'
import CurrencyInput from 'react-currency-input-field';


const SearchBar: React.FC = () => {
    const [isExtraFilter, setIsExtraFilter] = React.useState<boolean>(false);
    const [results, setResults] = React.useState<any[]>([]);

    const paramsContext = React.useContext<ParamsContextType | undefined>(ParamsContext);

    if (!paramsContext) {
        throw new Error("ParamsContext must be used within a ParamsContextProvider");
    }


    const { params, setParams } = paramsContext;
    const [address, setAddress] = React.useState(params.location);
    const [isSelect, setIsSelect] = React.useState<boolean>(false);
    const myQuery = useDebounce(address, 300);
    const [isFocused, setIsFocused] = React.useState<boolean>(false);



    const handleResult = (e: any) => {
        setAddress(e.target.value);
    };

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

    const geteocode = async (placeId: any) => {
        const res = await API.get(endpoints["mapDetail"], {
            params: {
                placeId: placeId,
            }
        })
        const data = await res.data;
        changeParams(data.result.formatted_address, "location");
        changeParams(data.result.geometry.location.lat, "latitude");
        changeParams(data.result.geometry.location.lng, "longitude");
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

    React.useEffect(() => {
        if (!myQuery[0]) {
            setResults([]);
            if (params.location) {
                changeParams("", "location");
                changeParams("", "latitude");
                changeParams("", "longitude");
            }
        }
        else if (myQuery[0] && isSelect === false) {
            getDatas(myQuery[0]);
        }
    }, [myQuery[0]])

    const handleFilterClick = () => {
        setIsExtraFilter(!isExtraFilter);
    };


    const changeParams = (value: any, field: any) => {
        setParams((current: any) => {
            return { ...current, [field]: value, page: 1 };
        });
    }
    
    return (<>
        <div className="grid grid-cols-12 gap-5 items-stretch">
            <div className="col-span-5 relative">
                <label htmlFor="location-search" className="mb-2 text-sm font-medium sr-only text-gray-900">Search location</label>
                <div className="relative h-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <GrLocation className="text-gray-900" size={20} />
                    </div>
                    <input value={address} type="search" id="location-search"
                        onChange={e => handleResult(e)}
                        onFocus={() => setIsFocused(true)}
                        className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Nhập khu vực..." />
                </div>
                <ul className={isFocused ? "absolute bg-white z-50 shadow mt-1 rounded-lg w-full py-2 text-sm text-dark dark:text-gray-200" : "hidden"}>
                    {results.map((result) => (
                        <li onClick={(e) => handleSelectPlace(e)} className="cursor-pointer px-4 py-2 hover:bg-primary hover:text-white" data-place-id={result.place_id}>{result.description}</li>
                    ))}
                </ul>
            </div>
            <div className="col-span-5">
                <label htmlFor="keyword-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search keyword</label>
                <div className="relative h-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <RiSearch2Line className="text-gray-900" size={20} />
                    </div>
                    <input value={params.kw} type="search" id="keyword-search"
                        onChange={e => changeParams(e.target.value, "kw")}
                        className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Nhập từ khóa..." />
                </div>
            </div>
            <div className="col-span-2">
                <Button className="bg-primary enabled:hover:bg-secondary h-full w-full" onClick={() => handleFilterClick()}>
                    <LuFilter size={20} /> <p className="text-base ms-2 font-bold">Lọc</p>
                </Button>
            </div>

            <div id="extra-filter" className={isExtraFilter ? "col-span-12 grid grid-cols-12 gap-5" : "hidden"}>
                <div className="col-span-2">
                    <label htmlFor="min-price-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search min price</label>
                    <div className="relative  h-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <LiaCoinsSolid className="text-gray-900" size={20} />
                        </div>
                        <CurrencyInput
                            id="max-price-search"
                            name="minPrice"
                            placeholder="Giá tối thiểu..."
                            decimalsLimit={0}
                            groupSeparator=","
                            value={params.minPrice}
                            onValueChange={(value: string | undefined) => {
                                changeParams(value, "minPrice");
                            }}
                            type="search"
                            className="h-full block w-full pr-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="max-price-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search max price</label>
                    <div className="relative  h-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <LiaCoinsSolid className="text-gray-900" size={20} />
                        </div>
                        <CurrencyInput
                            id="max-price-search"
                            name="maxPrice"
                            placeholder="Giá tối đa..."
                            decimalsLimit={0}
                            groupSeparator=","
                            value={params.maxPrice}
                            onValueChange={(value: string | undefined) => {
                                changeParams(value, "maxPrice");
                            }}
                            type="search"
                            className="h-full block w-full pr-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="min-people-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search min people</label>
                    <div className="relative  h-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <PiUsers className="text-gray-900" size={20} />
                        </div>
                        <input value={params.minPeople} type="search" id="min-people-search"
                            onChange={e => changeParams(e.target.value, "minPeople")}
                            className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Số người tối thiểu..." />
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="max-people-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search max people</label>
                    <div className="relative  h-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <PiUsersThree className="text-gray-900" size={20} />
                        </div>
                        <input value={params.maxPeople} type="search" id="max-people-search"
                            onChange={e => changeParams(e.target.value, "maxPeople")}
                            className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Số người tối đa..." />
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="num-beds-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search num beds</label>
                    <div className="relative  h-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <LiaBedSolid className="text-gray-900" size={20} />
                        </div>
                        <input value={params.numOfBedrooms} type="search" id="num-beds-search"
                            onChange={e => changeParams(e.target.value, "numOfBedrooms")}
                            className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Số phòng ngủ..." />
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="num-baths-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search num baths</label>
                    <div className="relative  h-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <PiBathtub className="text-gray-900" size={20} />
                        </div>
                        <input value={params.numOfBathrooms} type="search" id="num-baths-search"
                            onChange={e => changeParams(e.target.value, "numOfBathrooms")}
                            className="h-full block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" placeholder="Số phòng tắm..." />
                    </div>
                </div>

            </div>

        </div>
    </>)
};

export default SearchBar;
