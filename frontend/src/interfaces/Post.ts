import { PostFindDetail } from "./PostFindDetal";
import { PostRentDetail } from "./PostRentDetail";
import { User } from "./User";

export interface Post{
    id: number,
    title: string,
    description: string,
    createdAt?: Date,
    isDelete?: number,
    slug: string,
    image: string,

    userId: User,
    postRentDetail: PostRentDetail,
    postFindDetail: PostFindDetail,

}