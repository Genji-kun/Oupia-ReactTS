import React from 'react';
import { Rate } from '../../../../../interfaces/Rate';
import { Rating } from 'flowbite-react';
import { PiDotBold } from 'react-icons/pi';
import moment from 'moment';

interface RateItemProps {
    rate: Rate
}

const RateItem: React.FC<RateItemProps> = (props) => {
    const { rate } = props;
    return (
        <>
            <div className="flex gap-5 items-start">
                <div>
                    <div className="w-16 h-16 border-4 border-white ring-2 ring-gray-200 rounded-full">
                        <img
                            src={rate.userId.avatar}
                            alt="Avatar"
                            className="rounded-full"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <h2 className="font-bold text-lg">{rate.userId.fullName}</h2>
                    <div className="p-5 rounded-lg border-gray-200 border-2 shadow w-full flex flex-col gap-4">
                        <div className="flex items-center">
                            <Rating size="md">
                                <Rating.Star filled={(rate.rateStars >= 1) ? true : false} />
                                <Rating.Star filled={(rate.rateStars >= 2) ? true : false} />
                                <Rating.Star filled={(rate.rateStars >= 3) ? true : false} />
                                <Rating.Star filled={(rate.rateStars >= 4) ? true : false} />
                                <Rating.Star filled={(rate.rateStars === 5) ? true : false} />
                            </Rating>
                            <PiDotBold size="24" className="mx-3 text-dark" />
                            <h3 className="text-lg">{moment(rate.updatedAt?.toString()).fromNow()}</h3>
                        </div>
                        <p>
                            {rate.content}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RateItem;
