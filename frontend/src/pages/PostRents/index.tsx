import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import API, { endpoints } from '../../configs/API';
import MyBreadCrumb from '../../components/MyBreadCumb';
import PostRentList from '../../components/Post/PostRent/PostList';
import { Pagination } from 'flowbite-react';
import { Post } from '../../interfaces/Post';
import SearchBar from './components/SearchBar';
import { LuSearchX } from 'react-icons/lu';
import MySpinner from '../../components/MySpinner';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import MapModal from './components/MapModal';

export interface ParamsContextType {
  params: {
    pages: number,
    location: string,
    kw: string,
    minPrice: number,
    maxPrice: number,
    minPeople: number,
    maxPeople: number,
    numOfBedrooms: number,
    numOfBathrooms: number
  }
  setParams: any
}

export const ParamsContext = React.createContext<ParamsContextType | undefined>(undefined);


const PostRents: React.FC = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [params, setParams] = React.useState<any>(Object.fromEntries(searchParams));


  const [posts, setPosts] = React.useState<Post[] | null>(null);
  const [totalPages, setTotalPages] = React.useState(null);
  const [debouncedParams] = useDebounce(params, 500);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState<string | undefined>();


  const [currentPage, setCurrentPage] = React.useState(params.page || 1);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setParams({ ...params, page: page });
  }

  const navigate = useNavigate();
  const getPost = async () => {
    setLoading(true);
    setPosts(null);
    navigate({ search: new URLSearchParams(debouncedParams).toString() });
    try {
      let res = await API.get(endpoints['posts'], {
        params: {
          type: "landlordPost",
          page: currentPage,
          ...debouncedParams,
        }
      });
      if (res.status === 200) {
        setPosts(res.data.posts);

        if (!posts) {
          setLoading(false);
        }
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    if (params.page && params.page !== currentPage)
      setCurrentPage(params.page);
  }, [params.page, currentPage])

  React.useEffect(() => {
    getPost();
  }, [debouncedParams])

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (posts) {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [posts]);


  const handleClick = () => {
    setOpenModal("open");
  };


  return (
    <>
      <ParamsContext.Provider value={{ params, setParams }}>
        <div className="mx-20">
          <MyBreadCrumb BreadCrumbName="Tìm nhà trọ" />
          <SearchBar />
          {loading === true ?
            <>
              <div className=" w-full h-[30rem] flex flex-col items-center">
                <MySpinner></MySpinner>
              </div>
            </>
            : <>
              {(posts) ? <>
                <PostRentList posts={posts} />
                {(Number(posts?.length) >= 8 || currentPage > 1) &&
                  <>
                    {totalPages != null && currentPage != null ? (<>
                      <div className="flex items-center justify-center text-center">
                        <Pagination
                          currentPage={currentPage}
                          layout="pagination"
                          nextLabel=""
                          previousLabel=""
                          onPageChange={page => { onPageChange(page) }}
                          showIcons
                          totalPages={totalPages}
                          className="mb-5"
                        />
                      </div>
                    </>) : <></>}
                  </>
                }
              </>
                : <></>
              }
            </>}
          {(Number(posts?.length) === 0 && loading === false) ? <>
            <div className="p-10 flex items-center h-[30rem]">
              <div className="flex w-full flex-col gap-5 items-center text-gray-400">
                <LuSearchX size="60"></LuSearchX>
                <h3 className="text-xl font-semibold">Không tìm thấy kết quả phù hợp</h3>
              </div>
            </div>
          </> : <></>}
        </div>

      </ParamsContext.Provider>
      <button onClick={handleClick} className="h-12 w-12 rounded-full flex items-center justify-center fixed right-6 bottom-6 bg-primary cursor-pointer hover:bg-secondary">
        <LiaMapMarkedAltSolid size="25" className="text-white"></LiaMapMarkedAltSolid>
      </button>
      <MapModal openModal={openModal} setOpenModal={setOpenModal}></MapModal>

    </>
  );
};

export default PostRents;
