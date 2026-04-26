import { DoctorResponce } from "./doctor-responce.model";

export interface DoctorSlotWithDoctorResponce
{
    id: number,
    doctorResponce: DoctorResponce,
    date: string,
    startTime: string,
    endTime: string
}