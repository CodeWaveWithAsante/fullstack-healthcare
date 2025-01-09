import db from "@/lib/db";

import { startOfYear, endOfMonth, getMonth, format } from "date-fns";
import { daysOfWeek } from "..";
import path from "path";

type AppointmentStatus = "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

interface Appointment {
  status: AppointmentStatus;
  appointment_date: Date;
}

function isValidStatus(status: string): status is AppointmentStatus {
  return ["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].includes(status);
}

const initializeMonthlyData = () => {
  const this_year = new Date().getFullYear();

  const months = Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, index) => ({
      name: format(new Date(this_year, index), "MMM"),
      appointment: 0,
      completed: 0,
    })
  );
  return months;
};

export const processAppointments = async (appointments: Appointment[]) => {
  const monthlyData = initializeMonthlyData();

  const appointmentCounts = appointments.reduce<
    Record<AppointmentStatus, number>
  >(
    (acc, appointment) => {
      const status = appointment.status;

      const appointmentDate = appointment?.appointment_date;

      const monthIndex = getMonth(appointmentDate);

      if (
        appointmentDate >= startOfYear(new Date()) &&
        appointmentDate <= endOfMonth(new Date())
      ) {
        monthlyData[monthIndex].appointment += 1;

        if (status === "COMPLETED") {
          monthlyData[monthIndex].completed += 1;
        }
      }

      // Grouping by status
      if (isValidStatus(status)) {
        acc[status] = (acc[status] || 0) + 1;
      }

      return acc;
    },
    {
      PENDING: 0,
      SCHEDULED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    }
  );

  return { appointmentCounts, monthlyData };
};

export async function getPatientFullDataById(id: string) {
  try {
    const patient = await db.patient.findFirst({
      where: {
        OR: [
          {
            id,
          },
          { email: id },
        ],
      },
      include: {
        _count: {
          select: {
            appointments: true,
          },
        },
        appointments: {
          select: {
            appointment_date: true,
          },
          orderBy: {
            appointment_date: "desc",
          },
          take: 1,
        },
      },
    });

    if (!patient) {
      return {
        success: false,
        message: "Patient data not found",
        status: 404,
      };
    }
    const lastVisit = patient.appointments[0]?.appointment_date || null;

    return {
      success: true,
      data: {
        ...patient,
        totalAppointments: patient._count.appointments,
        lastVisit,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getPatientDashboardStatistics(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Nodata found",
        data: null,
      };
    }

    const data = await db.patient.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        img: true,
        gender: true,
        colorCode: true,
      },
    });

    if (!data) {
      return {
        success: false,
        message: "Nodata found",
        data: null,
      };
    }
    const appointments = await db.appointment.findMany({
      where: { patient_id: data?.id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
            colorCode: true,
          },
        },
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            gender: true,
            phone: true,
            colorCode: true,
          },
        },
      },

      orderBy: { appointment_date: "desc" },
    });

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );

    const last5Records = appointments?.slice(0, 5);

    const today = daysOfWeek[new Date().getDay()];

    const availableDoctors = await db.doctor.findMany({
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
        working_days: true,
        colorCode: true,
      },
      take: 5,
    });
    return {
      data,
      appointmentCounts,
      last5Records,
      totalAppointments: appointments.length,
      availableDoctors,
      monthlyData,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getAllPatient({
  page,
  limit = 10,
  search,
}: {
  page: string | number;
  limit?: number | string;
  search?: string;
}) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [patients, total] = await Promise.all([
      db.patient.findMany({
        where: {
          OR: [
            { id: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { first_name: { contains: search, mode: "insensitive" } },
            { last_name: { contains: search, mode: "insensitive" } },
          ],
        },
        include: {
          appointments: {
            select: {
              medical: {
                select: {
                  created_at: true,
                  treatment_plan: true,
                },
                orderBy: { created_at: "desc" },
                take: 1,
              },
            },
            orderBy: { appointment_date: "desc" },
            take: 1,
          },
        },
        skip: SKIP,
        take: LIMIT,
        orderBy: { created_at: "desc" },
      }),
      db.patient.count(),
    ]);

    if (!patients) {
      return { success: false, message: "Data not found", status: 404 };
    }

    const totalPages = Math.ceil(total / LIMIT);
    // console.dir(patients, { depth: null });
    return {
      data: patients,
      totalRecord: total,
      totalPages,
      currentPage: PAGE_NUMBER,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getPatientDataByEmail(email: string) {
  try {
    const patient = await db.patient.findUnique({
      where: { email },
    });

    if (!patient) {
      return {
        success: false,
        message: "Patient not found",
        status: 404,
        data: null,
      };
    }
    return { success: true, data: patient, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getPatientDataById(id: string) {
  try {
    if (!id) return { success: false, error: true, message: "No patient Id" };
    const patient = await db.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return {
        success: false,
        message: "Patient data not found",
        status: 404,
        data: null,
      };
    }

    return { success: true, data: patient, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
