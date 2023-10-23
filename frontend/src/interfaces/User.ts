import { LandlordInfo } from "./LandlordInfo";

export interface User {
    id: number;
    username?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: number;
    gender?: string;
    dob?: Date;
    createdAt?: Date;
    userRole: string;
    avatar?: string;
    isConfirm: boolean;
    status?: string;
    follows?: number;

    landlordInfo?: LandlordInfo | null;
    [key: string]: any;
}