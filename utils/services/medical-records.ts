import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";

export async function getVitalSignsData(id: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const vitalSigns = await db.vitalSigns.findMany({
    where: {
      patient_id: id,
      created_at: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      created_at: true,
      systolic: true,
      diastolic: true,
      heartRate: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });

  // Format data to match the output structure
  const formattedData = vitalSigns.map((record) => ({
    label: format(new Date(record.created_at), "MMM d"),
    systolic: record.systolic,
    diastolic: record.diastolic,
  }));

  // Format heart rate data
  const heartRateData = vitalSigns.map((record) => {
    const heartRates = record.heartRate
      .split("-")
      .map((rate) => parseInt(rate.trim())); // Split and parse heartRate
    return {
      label: format(new Date(record.created_at), "MMM d"), // Formatting the date
      value1: heartRates[0],
      value2: heartRates[1],
    };
  });

  // Calculate average systolic and diastolic
  const totalSystolic = vitalSigns.reduce(
    (sum, record) => sum + record.systolic,
    0
  );
  const totalDiastolic = vitalSigns.reduce(
    (sum, record) => sum + record.diastolic,
    0
  );
  const totalValue1 = heartRateData.reduce((sum, item) => sum + item.value1, 0);
  const totalValue2 = heartRateData.reduce((sum, item) => sum + item.value2, 0);

  const count = vitalSigns.length;

  const averageSystolic = (totalSystolic / count).toFixed(0);
  const averageDiastolic = (totalDiastolic / count).toFixed(0);
  const averageValue1 = totalValue1 / count;
  const averageValue2 = totalValue2 / count;

  const average = `${averageSystolic}/${averageDiastolic} mg/dL`;

  return {
    data: formattedData,
    average,
    heartRateData,
    averageHeartRate: `${averageValue1} - ${averageValue2} BPM`,
  };
}

interface MedicalRecordProps {
  page: number | string;
  limit: number;
  search: string;
  id?: string | number;
}
export async function getMedicalRecords({
  page,
  limit,
  search,
  id,
}: MedicalRecordProps) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const query: Prisma.MedicalRecordsWhereInput = {
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
          patient_id: { contains: search, mode: "insensitive" },
        },
      ],
    };

    if (id) {
      query: {
        id: id;
      }
    }

    const [data, totalRecord] = await Promise.all([
      db.medicalRecords.findMany({
        where: query,
        skip: SKIP,
        take: LIMIT,
        include: {
          patient: {
            select: {
              first_name: true,
              last_name: true,
              date_of_birth: true,
              gender: true,
            },
          },
          diagnosis: {
            include: {
              doctor: {
                select: {
                  name: true,
                  img: true,
                  specialization: true,
                },
              },
            },
          },
          lab_test: true,
        },

        orderBy: { created_at: "desc" },
      }),
      db.medicalRecords.count({
        where: query,
      }),
    ]);

    if (!data) {
      return { success: false, message: "Data not found", status: 404 };
    }
    const totalPages = Math.ceil(totalRecord / LIMIT);

    return { data, totalRecord, totalPages, currentPage: PAGE_NUMBER };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
