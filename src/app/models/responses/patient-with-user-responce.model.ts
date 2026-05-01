import { UserResponse } from "./user-response.model";

export interface PatientWithUserResponse {
    id: number,
    firstName: string,
    lastName: string,
    birthDate: string,
    genderType: number,
    phone: string,
    user: UserResponse
}