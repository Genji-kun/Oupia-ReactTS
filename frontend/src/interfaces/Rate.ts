import { Motel } from "./Motel";
import { User } from "./User";

export interface Rate{
    id?: number,
    rateStars: number,
    content: string,
    createdAt?: Date,
    updatedAt?: Date,

    userId: User,
    motelId: Motel,
}