import { Timestamp } from "firebase/firestore";
import { User } from "./User";

export interface Message {
    id: string,
    content: any,
    createdAt?: Timestamp,
    sender: User,
    type?: string
}