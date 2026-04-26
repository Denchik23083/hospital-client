import { DoctorSlotWithDoctorResponse } from "./doctor-slot-with-doctor-response.model"

export interface BookingResponse {
    id: number,
    doctorSlotWithDoctorResponse: DoctorSlotWithDoctorResponse
    bookingStatus: string
}