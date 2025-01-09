import db from "@/lib/db";
import { daysOfWeek } from "..";
import { buildQuery } from "./appointment";
import { processAppointments } from "./patient";

export async function getBursesDashboardStatistics(search?: string) {
  try {
    const today = new Date().getDay();

    const todayDay = daysOfWeek[today];

    const [totalDoctors, appointments] = await Promise.all([
      db.doctor.count({
        where: {
          working_days: { some: { day: todayDay } },
        },
      }),
      db.appointment.findMany({
        where: {
          appointment_date: { gte: new Date() },
          ...buildQuery("", search),
        },

        select: {
          id: true,
          patient_id: true,
          doctor_id: true,
          type: true,
          appointment_date: true,
          time: true,
          status: true,

          patient: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              phone: true,
              gender: true,
              img: true,
              colorCode: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              img: true,
              specialization: true,
              colorCode: true,
            },
          },
          medical: {
            select: { id: true },
          },
        },
        orderBy: { appointment_date: "desc" },
      }),
    ]);

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );

    return {
      appointmentCounts,
      totalAppointments: appointments?.length,
      appointments,
      totalDoctors,
      monthlyData,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
