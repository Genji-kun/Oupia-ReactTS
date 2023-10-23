import React from 'react';
import { Motel } from '../../../../interfaces/Motel';
import { Link } from 'react-router-dom';

interface MotelMessageProps {
    motel: Motel
}

const MotelMessage: React.FC<MotelMessageProps> = (props) => {
    const { motel } = props;

    return (
        <>
            <Link to={`/motels/${motel.slug}`}>
            <div className="w-[48rem] ml-auto">
                <div className="grid grid-cols-10 gap-2 bg-white shadow-sm h-fit border rounded-lg">
                    <div className="col-span-4 lg:col-span-3 h-40 md:h-52 lg:h-60">
                        <img src={motel.image} className="object-cover h-full w-full rounded-l" />
                    </div>
                    <div className="col-span-6 lg:col-span-7 p-3">
                        <h1 className="font-bold text-lg">{motel.name}</h1>
                    </div>
                </div>
            </div>
        </Link>
        </>
    );
};

export default MotelMessage;
