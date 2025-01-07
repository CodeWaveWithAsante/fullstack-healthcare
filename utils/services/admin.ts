import db from "@/lib/db";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";

export async function getAdminDashboardStats() {
  try {
    const todayDate = new Date().getDay();
    const today = daysOfWeek[todayDate];

    const [totalPatient, totalDoctors, appointments, doctors] =
      await Promise.all([
        db.patient.count(),
        db.doctor.count(),
        db.appointment.findMany({
          include: {
            patient: {
              select: {
                id: true,
                last_name: true,
                first_name: true,
                img: true,
                colorCode: true,
                gender: true,
                date_of_birth: true,
              },
            },
            doctor: {
              select: {
                name: true,
                img: true,
                colorCode: true,
                specialization: true,
              },
            },
          },
          orderBy: { appointment_date: "desc" },
        }),
        db.doctor.findMany({
          where: {
            working_days: {
              some: { day: { equals: today, mode: "insensitive" } },
            },
          },
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
            colorCode: true,
          },
          take: 5,
        }),
      ]);

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );

    const last5Records = appointments.slice(0, 5);

    return {
      success: true,
      totalPatient,
      totalDoctors,
      appointmentCounts,
      availableDoctors: doctors,
      monthlyData,
      last5Records,
      totalAppointments: appointments.length,
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return { error: true, message: "Something went wrong" };
  }
}
