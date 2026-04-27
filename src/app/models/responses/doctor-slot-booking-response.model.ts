import { BookingPatientResponse } from "./booking-patient-response.model";

export interface DoctorSlotBookingResponse {
    id: number,
    date: string,
    startTime: string,
    endTime: string,
    lastBooking: BookingPatientResponse | null
}