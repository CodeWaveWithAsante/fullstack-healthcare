import db from "@/lib/db";
import { LabTest, Prisma, TestStatus } from "@prisma/client";
import { endOfMonth, format, getMonth, startOfYear } from "date-fns";

const buildQuery = (id?: string, search?: string) => {
  // Base conditions for search if it exists
  const searchConditions: Prisma.LabTestWhereInput = search
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
          // {
          //   record_id: Number(search),
          // },
          {
            services: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }
    : {};

  const idConditions: Prisma.LabTestWhereInput = id
    ? {
        OR: [{ patient_id: id }, { service_id: Number(id) }],
      }
    : {};

  // Combine both conditions with AND if both exist
  const combinedQuery: Prisma.LabTestWhereInput =
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

const initializeMonthlyData = () => {
  const this_year = new Date().getFullYear();

  const months = Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, index) => ({
      name: format(new Date(this_year, index), "MMM"),
      completed: 0,
      pending: 0,
      cancelled: 0,
      total: 0,
    })
  );
  return months;
};

function isValidStatus(status: string): status is TestStatus {
  return ["PENDING", "COMPLETED", "CANCELLED"].includes(status);
}
export const processAppointments = async (data: LabTest[]) => {
  const monthlyData = initializeMonthlyData();

  const testCounts = data?.reduce<Record<TestStatus, number>>(
    (acc, el) => {
      const status = el.status;

      const testDate = el?.created_at;

      const monthIndex = getMonth(testDate);

      if (
        testDate >= startOfYear(new Date()) &&
        testDate <= endOfMonth(new Date())
      ) {
        monthlyData[monthIndex].total += 1;

        if (status === "COMPLETED") {
          monthlyData[monthIndex].completed += 1;
        }
        if (status === "PENDING") {
          monthlyData[monthIndex].pending += 1;
        }
        if (status === "CANCELLED") {
          monthlyData[monthIndex].cancelled += 1;
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
      COMPLETED: 0,
      CANCELLED: 0,
    }
  );

  return { testCounts, monthlyData };
};

export async function getLabDashboardStats() {
  try {
    const currentYear = new Date().getFullYear();

    // Fetch data grouped by month and include counts for each status
    const results = await db.labTest.findMany({
      where: {
        created_at: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    });

    const { testCounts, monthlyData } = await processAppointments(results!);

    const [completed, pending, cancelled, recentRecords] = await Promise.all([
      db.labTest.count({
        where: { status: "COMPLETED" },
      }),
      db.labTest.count({
        where: { status: "PENDING" },
      }),
      db.labTest.count({
        where: { status: "CANCELLED" },
      }),

      db.labTest.findMany({
        take: 5,
        include: {
          patient: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
          services: {
            select: { name: true },
          },
        },
        orderBy: { created_at: "desc" },
      }),
    ]);

    return {
      success: true,
      completed,
      pending,
      cancelled,
      recentRecords,
      groupData: monthlyData,
      totalTest: pending + completed + cancelled,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getLabTestRecords({
  page,
  limit,
  search,
  id,
}: {
  page: number;
  limit?: number;
  search?: string;
  id?: string;
}) {
  console.log(page, search, limit, id);
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [data, totalRecord] = await Promise.all([
      db.labTest.findMany({
        where: buildQuery(id, search),
        skip: SKIP,
        take: LIMIT,
        select: {
          id: true,
          patient_id: true,
          record_id: true,
          service_id: true,
          status: true,
          created_at: true,

          patient: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
          services: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      db.labTest.count({
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
