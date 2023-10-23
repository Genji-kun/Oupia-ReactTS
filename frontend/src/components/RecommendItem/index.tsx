import React from 'react'
import { Link, useParams } from 'react-router-dom'
import formatCurrency from '../../utils/priceUtils'
import { GrLocation } from 'react-icons/gr'
import './style.scss'

interface RecommendItemProps {
  recommend: any
}

const RecommendItem: React.FC<RecommendItemProps> = (props) => {
  const { recommend } = props;
  const { slugPost } = useParams();

  const price = formatCurrency(recommend.postRentDetail.price)

  if (recommend.slug !== slugPost)
    return (
      <Link to={`/posts/${recommend.slug}`} className="shrink-0 w-96 post-item block bg-white rounded-md border shadow-md dark:bg-gray-800 dark:border-gray-700 flex items-center flex-col items-stretch gap-2">
        <img className="rounded-t-md h-48 object-cover" src={recommend.image} alt="Hình ảnh" />
        <h2 className="font-medium text-lg text-Dark line-clamp-2 px-5 mt-3"> {recommend.title}</h2>
        <div className="text-primary px-5 font-medium"><h2 className="text-left">Giá: {price} VNĐ</h2></div>
        <div className="p-5 flex gap-1 text-sm text-gray-600">
          <GrLocation size={16} className="mt-1"/> <p className="w-11/12 truncate">{recommend.postRentDetail.motelId.fullLocation}</p>
        </div>
      </Link>
    );
};

export default RecommendItem;
