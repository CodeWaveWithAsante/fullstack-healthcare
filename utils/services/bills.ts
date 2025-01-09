import db from "@/lib/db";
import { Prisma } from "@prisma/client";

interface PaymentRecordProps {
  page: number | string;
  limit: number;
  search: string;
  id?: string | number;
}

export async function getPaymentRecords({
  page,
  limit,
  search,
  id,
}: PaymentRecordProps) {
  const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
  const LIMIT = Number(limit) || 10;

  const SKIP = (PAGE_NUMBER - 1) * LIMIT;

  const query: Prisma.PaymentWhereInput = {
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

  try {
    const [data, totalRecord] = await Promise.all([
      db.payment.findMany({
        where: query,
        skip: SKIP,
        take: LIMIT,
        include: {
          patient: {
            select: {
              first_name: true,
              last_name: true,
              phone: true,
              gender: true,
              img: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      db.payment.count({
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
