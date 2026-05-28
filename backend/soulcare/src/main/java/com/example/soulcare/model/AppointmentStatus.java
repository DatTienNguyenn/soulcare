package com.example.soulcare.model;

public enum AppointmentStatus {
    PENDING,      // Booking requested, awaiting specialist confirmation
    CONFIRMED,    // Specialist confirmed the appointment
    COMPLETED,    // Session completed successfully
    CANCELLED,    // Appointment cancelled
    NO_SHOW       // Patient/Specialist didn't show up
}
