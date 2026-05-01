import { PatientResponse } from "../patient/patient-response.model"

export interface BookingPatientResponse {
    id: number,
    patientResponse: PatientResponse
    bookingStatus: string
}