import db from "@/lib/db";
import { Prisma } from "@prisma/client";

interface AllAppointmentProps {
  page: number | string;
  limit?: number | string;
  search: string;
  id?: string;
}

export const buildQuery = (id?: string, search?: string) => {
  // Base conditions for search if it exists
  const searchConditions: Prisma.AppointmentWhereInput = search
    ? {
        OR: [
          {
            patient: {
              first_name: { contains: search, mode: "insensitive" },
            },
          },
          {
            patient: {
              last_name: { contains: search, mode: "insensitive" },
            },
          },
          {
            doctor: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }
    : {};

  // ID filtering conditions if ID exists
  const idConditions: Prisma.AppointmentWhereInput = id
    ? {
        OR: [{ patient_id: id }, { doctor_id: id }],
      }
    : {};

  // Combine both conditions with AND if both exist
  const combinedQuery: Prisma.AppointmentWhereInput =
    id || search
      ? {
          AND: [
            ...(Object.keys(searchConditions).length > 0
              ? [searchConditions]
              : []),
            ...(Object.keys(idConditions).length > 0 ? [idConditions] : []),
          ],
        }
      : {};

  return combinedQuery;
};

export async function getPatientAppointmentsById(patientId: string) {
  try {
    if (!patientId) {
      return {
        success: false,
        message: "Appointment id does not exist.",
        status: 404,
      };
    }
    const data = await db.appointment.findMany({
      where: { patient_id: patientId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
          },
        },
        // patient: {
        //   select: {
        //     id: true,
        //     first_name: true,
        //     phone: true,
        //     last_name: true,
        //     gender: true,
        //     img: true,
        //     date_of_birth: true,
        //     address: true,
        //   },
        // },
      },
    });

    if (!data) {
      return {
        success: false,
        message: "Appointment information not found",
        status: 404,
      };
    }

    return { success: true, data, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getAppointmentById(id: number) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Appointment id does not exist.",
        status: 404,
      };
    }
    const data = await db.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
          },
        },
        patient: {
          select: {
            id: true,
            first_name: true,
            phone: true,
            last_name: true,
            gender: true,
            img: true,
            date_of_birth: true,
            address: true,
          },
        },
      },
    });
    if (!data) {
      return {
        success: false,
        message: "Appointment information not found",
        status: 404,
      };
    }
    return { success: true, data, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getAppointmentWithMedicalRecordById(id: number) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Appointment id does not exist.",
        status: 404,
      };
    }
    const data = await db.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            primaryPhysician: { select: { name: true, specialization: true } },
          },
        },
        doctor: true,
        medical: {
          include: {
            diagnosis: true,
            lab_test: true,
            vital_signs: true,
          },
        },
        bills: true,
      },
    });

    if (!data) {
      return {
        success: false,
        message: "Appointment information not found",
        status: 404,
      };
    }
    return { success: true, data, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getPatientAppointments({
  page,
  limit,
  search,
  id,
}: AllAppointmentProps) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [data, totalRecord] = await Promise.all([
      db.appointment.findMany({
        where: buildQuery(id, search),
        skip: SKIP,
        take: LIMIT,
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
        },
        orderBy: { appointment_date: "desc" },
      }),
      db.appointment.count({
        where: buildQuery(id, search),
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
