import db from "@/lib/db";
import { Prisma, Role } from "@prisma/client";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";

export async function getAdminDashboardStatistics() {
  try {
    const today = new Date().getDay();

    const todayDay = daysOfWeek[today];

    const [totalPatient, totalDoctors, appointments, doctors] =
      await Promise.all([
        db.patient.count(),
        db.doctor.count(),
        db.appointment.findMany({
          include: {
            patient: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                img: true,
                gender: true,
                colorCode: true,
              },
            },
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
                img: true,
                colorCode: true,
              },
            },
          },
          orderBy: { appointment_date: "desc" },
        }),
        db.doctor.findMany({
          where: {
            working_days: { some: { day: todayDay } },
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
        }),
      ]);

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );

    const last5Records = appointments?.slice(0, 5);

    return {
      totalPatient,
      appointmentCounts,
      last5Records,
      totalAppointments: appointments?.length,
      availableDoctors: doctors,
      totalDoctors,
      monthlyData,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getServices() {
  try {
    const data = await db.services.findMany({
      orderBy: { name: "asc" },
    });

    if (!data) {
      return {
        success: false,
        message: "Data not found",
        status: 404,
        data: [],
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getUsers({
  page,
  limit,
  search,
  role,
}: {
  page: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
          { id: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && role !== "ALL" && { role: role as Role }),
    };

    const [data, totalRecord] = await Promise.all([
      db.user.findMany({
        where: where,
        skip: SKIP,
        take: LIMIT,

        orderBy: { name: "asc" },
      }),
      db.user.count({
        where: where,
      }),
    ]);

    if (!data) {
      return {
        success: false,
        data: [],
        message: "Data not found",
        status: 404,
      };
    }
    const totalPages = Math.ceil(totalRecord / LIMIT);

    return { data, totalRecord, totalPages, currentPage: PAGE_NUMBER };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
