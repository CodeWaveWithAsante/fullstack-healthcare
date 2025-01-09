import db from "@/lib/db";

export async function getAllStaffs({
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

    const [staffs, totalRecord] = await Promise.all([
      db.staff.findMany({
        where: {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        },
        skip: SKIP,
        take: LIMIT,
      }),
      db.staff.count(),
    ]);

    if (!staffs) {
      return { success: false, message: "Data not found", status: 404 };
    }

    const totalPages = Math.ceil(totalRecord / LIMIT);

    return {
      data: staffs,
      totalRecord,
      totalPages,
      currentPage: PAGE_NUMBER,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
