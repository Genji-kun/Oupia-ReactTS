import { Spinner } from 'flowbite-react';
import React from 'react';

const MySpinner:React.FC = () => {
    return (
        <>
            <Spinner size="xl" className=" fill-primary mt-20" />
            <h1 className="text-lg font-bold text-primary mt-2">Đang tải</h1>
        </>
    );
};

export default MySpinner;