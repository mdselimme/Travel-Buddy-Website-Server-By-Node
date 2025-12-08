import { Types } from "mongoose"


export interface IJwtTokenPayload {
    userId: Types.ObjectId
    role: string
    email: string
    fullName: string
    iat: number
    exp: number
}
