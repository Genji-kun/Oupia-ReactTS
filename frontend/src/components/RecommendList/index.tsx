import React from 'react';
import RecommendItem from '../RecommendItem';

interface RecommendListProps {
    recommendList: any,
}

const RecommendList: React.FC<RecommendListProps> = (props) => {
    const { recommendList } = props;
    if (recommendList)
        return (
            <div className="flex flex-row gap-4 overflow-y-auto py-3">
                {recommendList.map((recommend: any, index: number) => <RecommendItem key={index} recommend={recommend}></RecommendItem>)}
            </div>
        );
};

export default RecommendList;
