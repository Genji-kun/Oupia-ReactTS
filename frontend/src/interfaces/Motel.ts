import { User } from "./User";

export interface Motel {
    id: number,
    name?: string,
    fullLocation?: string,
    createdAt?: string,
    status: string,
    slug: string,
    phoneNumber: string,
    locationLongitude: number,
    locationLatitude: number,
    image: string,
    userId: User,
    distance? : number | null;
}