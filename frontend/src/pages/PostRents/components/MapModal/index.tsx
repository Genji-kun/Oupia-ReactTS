import { Modal } from 'flowbite-react'
import React from 'react'
import goongJs from '@goongmaps/goong-js'
import { Motel } from '../../../../interfaces/Motel'
import API, { endpoints } from '../../../../configs/API'
import { MdLocationPin } from 'react-icons/md'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import geoJson2 from '../../../../data/geoJson2.json'
import geoJson1 from '../../../../data/geoJson1.json'

import axios from 'axios'
import { useDebounce } from 'use-debounce'

interface MapModalProps {
    openModal: string | undefined,
    setOpenModal: any
}

const MapModal: React.FC<MapModalProps> = (props) => {
    const { openModal, setOpenModal } = props;
    const [motels, setMotels] = React.useState<Motel[]>([]);
    const [motel, setMotel] = React.useState<Motel>();
    const [motelDescription, setMotelDescription] = React.useState<boolean>(false);

    const [provs, setProvs] = React.useState<any[]>([]);
    const [dists, setDists] = React.useState<any[]>([]);
    const [,setWs] = React.useState<any[]>([]);

    const [keyword, setKeyword] = React.useState<string>();
    const [,setResults] = React.useState<Motel[] | undefined>(undefined);
    const [markers, setMarkers] = React.useState<any[]>([]);

    const finalKw = useDebounce(keyword, 300);

    const mapRef = React.useRef<HTMLDivElement | null>(null);
    const map = React.useRef<any>(null);
    const [polygon, setPolygon] = React.useState<String[]>();

    const [provSelect, setProvSelect] = React.useState(null);
    const [distSelect, setDistSelect] = React.useState(null);
    const numberDist = ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12"]


    const key = import.meta.env.VITE_GOONG_MAPS_MAPTILES_KEY;
    goongJs.accessToken = key;

    React.useEffect(() => {
        if (mapRef.current && map.current) {
            if (map.current.getLayer("line") != null)
                map.current.removeLayer("line");
            if (map.current.getLayer("fill"))
                map.current.removeLayer("fill");
        }

        if (provSelect) {
            const feature = geoJson1.features.find((f: any) => f.properties.NAME_1 === provSelect);
            if (!feature) {
                alert("Chưa có thông tin địa điểm này");

            } else {
                if (mapRef.current && map.current) {

                    map.current.addLayer({
                        'id': 'line',
                        'type': 'line',
                        'source': 'geoData1',
                        'paint': {
                            'line-color': '#FF0000',
                            'line-width': 2
                        },
                        filter: ['==', ['get', 'NAME_1'], provSelect]
                    }).addLayer({
                        'id': 'fill',
                        'type': 'fill',
                        'source': 'geoData1',
                        'paint': {
                            'fill-color': '#FF0000',
                            'fill-opacity': 0.1
                        },
                        filter: ['==', ['get', 'NAME_1'], provSelect]
                    })

                    let listPolygon = [];
                    const array = feature?.geometry.coordinates;

                    for (let i = 0; i < array.length; i++) {
                        let subArray = array[i][0];
                        const coordinatesString = subArray.map(c => c.toString().replace(",", " "));
                        if (coordinatesString)
                            listPolygon.push(coordinatesString.join(', '));
                    }

                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

                    for (let i = 0; i < array.length; i++) {
                        for (let j = 0; j < array[i][0].length; j++) {
                            let point = array[i][0][j];
                            minX = Math.min(minX, point[0]);
                            minY = Math.min(minY, point[1]);
                            maxX = Math.max(maxX, point[0]);
                            maxY = Math.max(maxY, point[1]);
                        }
                    }
                    var bounds = [
                        [minX, minY],
                        [maxX, maxY]
                    ];
                    map.current?.fitBounds(bounds);
                    setPolygon(listPolygon);
                }
            }
        }


    }, [provSelect])




    React.useEffect(() => {
        if (mapRef.current && map.current) {
            if (map.current.getLayer("line") != null)
                map.current.removeLayer("line");
            if (map.current.getLayer("fill"))
                map.current.removeLayer("fill");
        }
        if (distSelect) {
            const feature = geoJson2.features.find((f: any) => f.properties.NAME_2 === distSelect);
            if (!feature) {
                alert("Chưa có thông tin địa điểm này");
            } else {
                if (mapRef.current && map.current) {
                    map.current.addLayer({
                        'id': 'line',
                        'type': 'line',
                        'source': 'geoData2',
                        'paint': {
                            'line-color': '#FF0000',
                            'line-width': 2
                        },
                        filter: ['==', ['get', 'NAME_2'], distSelect]
                    }).addLayer({
                        'id': 'fill',
                        'type': 'fill',
                        'source': 'geoData2',
                        'paint': {
                            'fill-color': '#FF0000',
                            'fill-opacity': 0.1
                        },
                        filter: ['==', ['get', 'NAME_2'], distSelect]
                    })

                    let listPolygon = [];
                    const array = feature?.geometry.coordinates;

                    for (let i = 0; i < array.length; i++) {
                        let subArray = array[i][0];
                        const coordinatesString = subArray.map(c => c.toString().replace(",", " "));
                        if (coordinatesString)
                            listPolygon.push(coordinatesString.join(', '));
                    }

                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

                    for (let i = 0; i < array.length; i++) {
                        for (let j = 0; j < array[i][0].length; j++) {
                            let point = array[i][0][j];
                            minX = Math.min(minX, point[0]);
                            minY = Math.min(minY, point[1]);
                            maxX = Math.max(maxX, point[0]);
                            maxY = Math.max(maxY, point[1]);
                        }
                    }
                    var bounds = [
                        [minX, minY],
                        [maxX, maxY]
                    ];
                    map.current?.fitBounds(bounds);
                    setPolygon(listPolygon);
                }
            }

        }
    }, [distSelect])

    React.useEffect(() => {
        const getMotel = async () => {
            try {
                let res = await API.post(endpoints['motels-polygon'], polygon);
                if (res.status === 200) {
                    setMotels(res.data);
                }
            } catch (ex: any) {
                throw new Error("Xảy ra lỗi khi truy xuất");
            }
        }
        getMotel();
    }, [polygon])

    const handleProvince = async (evt: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedValue = evt.target.value;
        // setProvVal(selectedValue);


        if (selectedValue) {
            const listValue = selectedValue.split('-');

            const selectedProvCode = listValue[1];
            const index: number = Number(listValue[0]);
            var provName = provs[index].name;
            var provPrefix = provs[index].division_type;

            if (provPrefix == "thành phố trung ương") provPrefix = "Thành phố"
            else {
                provPrefix = provPrefix.charAt(0).toUpperCase() + provPrefix.substr(1);
            }

            provName = provName.replace(provPrefix, "").replaceAll(" ", "");
            setProvSelect(provName);
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
    }


    const handleDistrict = async (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = evt.target.value;

        if (selectedValue) {
            const listValue = selectedValue.split('-');

            const selectedDistCode = listValue[1];
            const index: number = Number(listValue[0]);

            var distName = dists[index].name;
            if (numberDist.includes(distName)) distName = distName.replaceAll(" ", "");
            else {
                var distPrefix = dists[index].division_type;
                distPrefix = distPrefix.charAt(0).toUpperCase() + distPrefix.substr(1);
                distName = distName.replace(distPrefix, "").replaceAll(" ", "");
            }
            setDistSelect(distName);
            try {
                const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistCode}?depth=2`);
                const resWard = res.data.wards;
                setWs(resWard);

            } catch (ex) {
                console.error('Error fetching districts: ', ex);
            }
        } else setWs([]);
    }

    React.useEffect(() => {
        if (openModal == 'open') {
            setTimeout(() => {
                if (mapRef.current) {
                    map.current = new goongJs.Map({
                        container: mapRef.current,
                        style: 'https://tiles.goong.io/assets/goong_map_web.json',
                        center: [106.633, 10.8141],
                        zoom: 12
                    });

                    map.current.on('load', function () {
                        map.current.addSource("geoData1", {
                            type: 'geojson',
                            data: geoJson1
                        }).addSource("geoData2", {
                            type: 'geojson',
                            data: geoJson2
                        })
                    });
                }
            }, 0);
        }
    }, [openModal]);

    React.useEffect(() => {
        markers.forEach((marker: any) => marker.remove());
        const newMarkers: any[] = [];

        const initMarker = (motel: Motel) => {
            if (map.current) {
                var el = document.createElement('div');
                el.id = "model-" + motel.id;
                el.className = 'rounded-full border-2 border-white ring-2 ring-gray-300 h-10 w-10 bg-cover hover:cursor-pointer hover:ring-secondary';
                el.style.backgroundImage = `url(${motel.image})`;
                el.addEventListener('click', () => {
                    setMotel(motel);
                    setMotelDescription(true);
                    map.current.flyTo({
                        center: [motel.locationLongitude, motel.locationLatitude]
                    });
                });

                const marker = new goongJs.Marker(el)
                    .setLngLat([motel.locationLongitude, motel.locationLatitude])
                    .addTo(map.current);

                newMarkers.push(marker);
            }
        }

        motels.forEach(motel => {
            initMarker(motel);
        })
        setMarkers(newMarkers);
    }, [motels]);

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

    React.useEffect(() => {
        if (keyword !== "") {
            const getResult = async () => {
                try {
                    let res = await API.get(endpoints['motels'], {
                        params: {
                            kw: finalKw[0],
                            page: 1,
                            userStatus: "ACCEPTED"
                        }
                    });
                    if (res.status === 200) {
                        setResults(res.data);
                    }
                } catch (ex: any) {
                    throw new Error("Xảy ra lỗi khi truy xuất");
                }
            }
            getResult();
        }
    }, [finalKw[0], keyword])

    // const updateResult = (evt: any) => {
    //     setKeyword(evt.target.value);
    // }

    // React.useEffect(() => {
    //     const getDetail = async (placeId: any) => {
    //         const res = await API.get(endpoints["mapDetail"], {
    //             params: {
    //                 placeId: placeId,
    //             }
    //         })
    //         const data = await res.data;
    //         if (res.data) {
    //             map.current?.flyTo({ center: [data.result.geometry.location.lng, data.result.geometry.location.lat] })
    //         }

    //     }
    //     const getDatas = async (queryInput: any) => {
    //         const res = await API.get(endpoints["mapAutocomplate"], {
    //             params: {
    //                 input: queryInput,
    //                 sessionToken: localStorage.getItem("sessionToken")
    //             }
    //         })
    //         const data = await res.data;
    //         if (data.predictions) {
    //             const rs = data.predictions[0];
    //             const placeId = rs.place_id;
    //             getDetail(placeId)
    //         }
    //     }
    //     if (query) {
    //         getDatas(query);
    //     }
    // }, [query])

    return (
        <>
            <Modal className="pt-20" size="7xl" show={openModal === "open"} onClose={() => setOpenModal(undefined)}>
                <Modal.Header>Tìm kiếm bằng bản đồ</Modal.Header>
                <Modal.Body>
                    <div className="w-full h-[70vh] relative" >
                        <div ref={mapRef} id="map" className="h-full" />
                        {motelDescription === true ? <>
                            <div className="absolute h-full bg-white right-0 top-0 w-1/3">
                                <div className="relative h-full flex-col flex border-l-[1px] border-gray-300 ">
                                    <div className="h-full relative">
                                        <img src={motel?.image} alt="motel image" className="w-full h-1/3 object-cover" />
                                        <div className="p-5 flex flex-col gap-2">
                                            <h1 className="font-semibold text-lg">{motel?.name}</h1>
                                            <hr />
                                            <div className="flex grid grid-cols-10 gap-2">
                                                <MdLocationPin className="text-primary col-span-1" size="24" ></MdLocationPin>
                                                <h2 className="col-span-9">{motel?.fullLocation}</h2>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-5"></div>
                                    </div>
                                    <div className="h-full absolute -left-6 items-center flex">
                                        <button onClick={() => setMotelDescription(false)} className="py-7 bg-white border-r-[1px] shadow-xl rounded-l-xl"><FiChevronRight size="22"></FiChevronRight></button>
                                    </div>
                                </div>
                            </div>

                        </> : <>
                            {motel && <div className="absolute right-0 top-0 flex  items-center h-full">
                                <button onClick={() => setMotelDescription(true)} className="py-7 bg-white border-r-[1px] shadow-xl rounded-l-xl"><FiChevronLeft size="22"></FiChevronLeft></button>
                            </div>
                            }
                        </>}
                        <div className="absolute top-3 left-3">
                            <div className="grid grid-cols-12 gap-2 relative">
                                {/* <div>
                                    <Dropdown
                                        arrowIcon={false}
                                        inline
                                        dismissOnClick={false}
                                        label={<button aria-hidden="true" className="bg-primary rounded-lg text-white flex items-center border border-primary/25 px-2 py-2.5 shadow-md">
                                            Lọc khu vực
                                        </button>}
                                    >
                                        <div className="p-4">
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
                                                            <option key={index} value={index + '-' + resProv.code}>
                                                                {resProv.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4">
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
                                                            <option key={index} value={index + '-' + resDist.code}>
                                                                {resDist.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                    </Dropdown>
                                </div> */}
                                {/* <div>
                                    <button data-dropdown-toggle="dropdownInformation" aria-hidden="true" className="bg-primary rounded-lg text-white flex items-center border border-primary/25 px-2 py-2.5 shadow-md">
                                        Lọc khu vực
                                    </button>

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
                                </div> */}
                                {/* <div className="col-span-5 grow">
                                    <label htmlFor="location-search" className="mb-2 tex>t-sm font-medium sr-only text-gray-900">Search location</label>
                                    <div className="relative h-full">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <RiSearch2Line className="text-gray-900" size={20} />
                                        </div>
                                        <input type="search" id="location-search"

                                            onChange={(evt) => updateResult(evt)}
                                            className="h-full block w-full py-2.5 pr-2 pl-10 text-gray-900 border border-gray-200 rounded-lg bg-white shadow-md focus:ring-2 focus:ring-primary/10 focus:border-primary/50" placeholder="Nhập nhà trọ..." />
                                    </div>
                                    {keyword ? <>
                                        <ul className={"absolute bg-white z-50 shadow mt-1 rounded-lg w-full py-2 text-sm text-dark dark:text-gray-200"}>
                                            {results && results.map((result: Motel, index: number) => (
                                                <li key={index}
                                                    className="cursor-pointer px-4 py-2 hover:bg-primary hover:text-white"
                                                    onClick={() => {
                                                        map.current.flyTo({
                                                            center: [result.locationLongitude, result.locationLatitude]
                                                        });
                                                    }}>{result.name}</li>
                                            ))}
                                        </ul>
                                    </> : <></>}
                                </div> */}

                                <div className="col-span-full md:col-span-5 lg:col-span-4">
                                    <div className="w-full">
                                        <div className="flex gap-0.5 items-center">
                                            <label htmlFor="province" className="block mb-2 sr-only text-lg text-gray-900 ">Tỉnh / Thành phố</label>
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
                                                    <option key={index} value={index + '-' + resProv.code}>
                                                        {resProv.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-full md:col-span-5 lg:col-span-4">
                                    <div className="w-full">
                                        <div className="flex gap-0.5 items-center">
                                            <label htmlFor="district" className="block mb-2 sr-only text-lg text-gray-900 ">Quận / Huyện</label>
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
                                                    <option key={index} value={index + '-' + resDist.code}>
                                                        {resDist.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MapModal;