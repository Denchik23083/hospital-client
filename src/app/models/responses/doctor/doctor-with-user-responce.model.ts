import { SpecialtyResponse } from "../others/specialty-response.model"
import { UserResponse } from "../others/user-response.model"

export interface DoctorWithUserResponse {
    id: number,
    firstName: string,
    lastName: string,
    experienceYears: number
    genderType: number,
    specialty: SpecialtyResponse,
    user: UserResponse
}