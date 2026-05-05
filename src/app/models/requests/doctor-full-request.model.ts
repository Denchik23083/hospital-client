export interface DoctorFullRequest {
    firstName: string,
    lastName: string,
    genderType: number,
    experienceYears: number,
    workDayStart: string,
    workDayEnd: string,
    specialtyId: number,
    email: string,
    password: string
}