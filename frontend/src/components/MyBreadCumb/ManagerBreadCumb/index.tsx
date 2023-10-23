import { Breadcrumb } from 'flowbite-react';
import React from 'react';
import { LiaHomeSolid } from 'react-icons/lia';
import { Link, useLocation } from 'react-router-dom';

type BreadcrumbProps = {
    BreadCrumbName: string,
}

const ManagerBreadCumb: React.FC<BreadcrumbProps> = (props) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    const datas = pathnames.slice(1);
 
    return (
        <Breadcrumb className="p-5 w-full border-b-2 border-gray-200">
            {datas.length > 0 && (
                <Breadcrumb.Item>
                    <div className="text-darker font-medium text-lg dark:text-white flex gap-2 items-center">
                        <LiaHomeSolid size="23" className="mb-1" />
                        <Link to="/manager">
                            Quản lý
                        </Link>
                    </div>
                </Breadcrumb.Item>
            )}
            {datas.map((name, index) => {
                const routeTo = `/manager/${datas.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 2;

                return (
                    <Breadcrumb.Item key={index}>
                        {isLast ? (
                            <p className="font-medium text-gray-500 text-lg dark:text-white">
                                {props.BreadCrumbName}
                            </p>
                        ) : (
                            <Link to={routeTo} className="text-darker font-medium text-lg dark:text-white">
                                {name === "motels" ? "Nhà trọ" : (name === "posts" ? "Bài viết" : name)}
                            </Link>
                        )}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export default ManagerBreadCumb;
