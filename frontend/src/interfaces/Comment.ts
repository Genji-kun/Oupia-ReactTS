import { Post } from "./Post";
import { User } from "./User";

export interface Comment {
    id: number,
    content?: string,
    createdAt?: Date,
    postId?: Post,
    userId: User
}