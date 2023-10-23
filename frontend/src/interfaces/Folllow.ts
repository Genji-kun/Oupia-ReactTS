import { User } from "./User";

export interface Follow {
   id: number,
   createAt?: Date,
   followUserId? : User,
   beFollowedUserId: User
}