import { DoctorResponse } from "./doctor-response.model";

export interface DoctorSlotWithDoctorResponse
{
    id: number,
    doctorResponse: DoctorResponse,
    date: string,
    startTime: string,
    endTime: string
}