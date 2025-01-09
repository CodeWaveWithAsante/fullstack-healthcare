import db from "@/lib/db";

export async function getAuditLogs({
  page,
  limit,
}: {
  page?: number | string;
  limit?: number | string;
}) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [data, totalRecord] = await Promise.all([
      db.auditLog.findMany({
        skip: SKIP,
        take: LIMIT,
        orderBy: { created_at: "desc" },
      }),
      db.auditLog.count(),
    ]);

    if (!data) {
      return {
        success: false,
        message: "Data not found",
        status: 404,
        data: [],
      };
    }

    const totalPages = Math.ceil(totalRecord / LIMIT);

    return {
      success: true,
      data,
      totalRecord,
      currentPage: PAGE_NUMBER,
      totalPages,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
