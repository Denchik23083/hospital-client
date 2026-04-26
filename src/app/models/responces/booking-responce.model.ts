import { DoctorSlotWithDoctorResponce } from "./doctor-slot-with-doctor.model"

export interface BookingResponce {
    id: number,
    doctorSlotWithDoctorResponce: DoctorSlotWithDoctorResponce
    bookingStatus: string
}