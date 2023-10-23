import { User } from "firebase/auth";

export interface LandlordInfo {
    id: number, 
    userId: User,
    identityNumber: string,
    taxCode: string,
    businessLicense: string,
    status: string,
    frontOfIdentityCard: string,
    backOfIdentityCard: string
}