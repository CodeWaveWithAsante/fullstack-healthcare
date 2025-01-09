import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { processAppointments } from "./patient";
import { daysOfWeek } from "..";

export async function getAllDoctors({
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

    const [doctors, totalRecord] = await Promise.all([
      db.doctor.findMany({
        where: {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
            { specialization: { contains: search, mode: "insensitive" } },
          ],
        },
        include: {
          working_days: true,
        },
        skip: SKIP,
        take: LIMIT,
        orderBy: { name: "asc" },
      }),
      db.doctor.count(),
    ]);

    if (!doctors) {
      return { success: false, message: "Data not found", status: 404 };
    }

    const totalPages = Math.ceil(totalRecord / LIMIT);

    return {
      data: doctors,
      totalRecord,
      totalPages,
      currentPage: PAGE_NUMBER,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getDoctorById(id: string) {
  try {
    const [doctor, totalAppointment] = await Promise.all([
      db.doctor.findUnique({
        where: { id },
        include: {
          working_days: true,
          appointments: {
            include: {
              patient: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  gender: true,
                  img: true,
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
            take: 10,
          },
        },
      }),
      db.appointment.count({ where: { doctor_id: id } }),
    ]);

    if (!doctor) {
      return { success: false, message: "Doctor not found", status: 404 };
    }

    return { success: true, error: false, data: doctor, totalAppointment };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getRatingById(id: string) {
  try {
    const ratings = await db.rating.findMany({
      where: { staff_id: id },
      include: {
        patient: {
          select: { last_name: true, first_name: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    if (!ratings) {
      return {
        success: false,
        message: "Ratings not found",
        status: 404,

        totalRatings: 0,
        averageRating: 0,
        ratings: [],
      };
    }
    const totalRatings = ratings?.length;
    const sumRatings = ratings?.reduce((sum, rating) => sum + rating.rating, 0);

    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    const formattedAverageRating = (
      Math.round(averageRating * 10) / 10
    ).toFixed(1);

    return {
      totalRatings,
      averageRating: formattedAverageRating,
      ratings,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getDoctorDashboardStatistics() {
  try {
    const { userId } = await auth();

    const today = new Date().getDay();

    const todayDay = daysOfWeek[today];

    const [totalPatient, totalNurses, appointments, doctors] =
      await Promise.all([
        db.patient.count(),
        db.staff.count({ where: { role: "NURSE" } }),
        db.appointment.findMany({
          where: { doctor_id: userId!, appointment_date: { lte: new Date() } },
          include: {
            patient: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                img: true,
                gender: true,
              },
            },
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
                img: true,
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
          },
          take: 5,
        }),
      ]);

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );

    const last5Records = appointments?.slice(0, 5);
    // const availableDoctors = doctors.slice(0, 5);

    return {
      totalPatient,
      appointmentCounts,
      last5Records,
      totalAppointments: appointments?.length,
      availableDoctors: doctors,
      totalNurses,
      monthlyData,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getDoctors() {
  try {
    const doctors = await db.doctor.findMany();

    if (!doctors) {
      return { success: false, message: "Data not found", status: 404 };
    }

    return { data: doctors };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
