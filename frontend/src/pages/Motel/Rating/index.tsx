import { Rating } from 'flowbite-react';
import React, { useContext } from 'react';
import { RateContext, RateContextType } from '../../../layouts/MotelLayout';
import { UserContext, UserContextType } from '../../../App';
import { Rate } from '../../../interfaces/Rate';
import RateItem from './components/RateItem';


const MotelRating: React.FC = () => {

    const rateContext = useContext<RateContextType | undefined>(RateContext);
    if (!rateContext) {
        throw new Error("Lỗi");
    }

    const { rateStats, rateTotal, rates } = rateContext;

    const userContext = useContext<UserContextType | undefined>(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider");
    }

    return (
        <>
            <div className="w-full p-10">
                <Rating className="mb-2">
                    { }
                    <Rating.Star filled={(rateStats?.avg && rateStats?.avg >= 1) ? true : false} />
                    <Rating.Star filled={(rateStats?.avg && rateStats?.avg >= 2) ? true : false} />
                    <Rating.Star filled={(rateStats?.avg && rateStats?.avg >= 3) ? true : false} />
                    <Rating.Star filled={(rateStats?.avg && rateStats?.avg >= 4) ? true : false} />
                    <Rating.Star filled={(rateStats?.avg && rateStats?.avg >= 5) ? true : false} />
                    <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {rateStats?.avg ? rateStats?.avg : 0} trên 5
                    </p>
                </Rating>
                <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {rateTotal} người đánh giá
                </p>
                <Rating.Advanced
                    className="mb-2"
                    percentFilled={rateTotal != 0 ? Number(parseFloat(((rateStats.details[5] / rateTotal) * 100).toString()).toFixed(2)) : 0}
                >
                    <p>
                        5 sao
                    </p>
                </Rating.Advanced>
                <Rating.Advanced
                    className="mb-2"
                    percentFilled={rateTotal != 0 ?  Number(parseFloat(((rateStats.details[4] / rateTotal) * 100).toString()).toFixed(2)) : 0}
                >
                    <p>
                        4 sao
                    </p>
                </Rating.Advanced>
                <Rating.Advanced
                    className="mb-2"
                    percentFilled={rateTotal != 0 ?  Number(parseFloat(((rateStats.details[3] / rateTotal) * 100).toString()).toFixed(2)) : 0}
                >
                    <p>
                        3 sao
                    </p>
                </Rating.Advanced>
                <Rating.Advanced
                    className="mb-2"
                    percentFilled={rateTotal != 0 ?  Number(parseFloat(((rateStats.details[2] / rateTotal) * 100).toString()).toFixed(2)) : 0}
                >
                    <p>
                        2 sao
                    </p>
                </Rating.Advanced>
                <Rating.Advanced
                    percentFilled={rateTotal != 0 ?  Number(parseFloat(((rateStats.details[1] / rateTotal) * 100).toString()).toFixed(2)) : 0}
                >
                    1 sao
                </Rating.Advanced>
                <h3 className="font-bold text-primary text-xl my-5">Danh sách người đã đánh giá</h3>
                <div className="w-full flex flex-col gap-5 test">
                    <>
                        {rates?.map((rate: Rate, index: number) => {
                            return (
                                <div key={index}>
                                    <RateItem rate={rate}></RateItem>
                                </div>
                            )
                        })}
                    </>
                </div>
            </div >
        </>
    );
};

export default MotelRating;
