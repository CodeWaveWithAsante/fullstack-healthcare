import db from "@/lib/db";
import { DrugCategory, PrescriptionStatus, Prisma } from "@prisma/client";
import { sub } from "date-fns";

export async function getDrugs({
  page,
  limit,
  search,
  category,
}: {
  page: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  try {
    const PAGE_NUMBER = search ? 1 : Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const where: Prisma.DrugWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { manufacturer: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category &&
        category !== "ALL" && { category: category as DrugCategory }),
    };

    const [drugs, total] = await Promise.all([
      db.drug.findMany({
        where,
        take: LIMIT,
        skip: SKIP,
        orderBy: { name: "asc" },
      }),
      db.drug.count({ where }),
    ]);

    const totalPages = Math.ceil(total / LIMIT);

    return {
      data: drugs,
      totalRecord: total,
      totalPages,
      currentPage: PAGE_NUMBER,
    };
  } catch (error) {
    return { error: "Failed to fetch drugs" };
  }
}

export async function getDrug(id: string) {
  try {
    const drug = await db.drug.findUnique({
      where: { id },
    });
    return { drug };
  } catch (error) {
    return { error: "Failed to fetch drug" };
  }
}

export async function getInvoices({
  page,
  limit,
  search,
}: {
  page: number;
  limit?: number;
  search?: string;
}) {
  try {
    const PAGE_NUMBER = search ? 1 : Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        include: {
          drugs: {
            include: {
              drug: { select: { name: true } },
            },
          },
        },
        orderBy: { purchaseDate: "desc" },
      }),
      db.invoice.count(),
    ]);

    const totalPages = Math.ceil(total / LIMIT);

    return {
      data: invoices,
      totalRecord: total,
      totalPages,
      currentPage: PAGE_NUMBER,
    };
    return { invoices };
  } catch (error) {
    return { error: "Failed to fetch invoices" };
  }
}

export async function getPrescriptions({
  page,
  limit,
  search,
  category,
}: {
  page: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  try {
    const PAGE_NUMBER = search ? 1 : Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const where: Prisma.PrescriptionWhereInput = {
      ...(search && {
        OR: [
          {
            patient: { first_name: { contains: search, mode: "insensitive" } },
          },
          { patient: { last_name: { contains: search, mode: "insensitive" } } },
          { patientId: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category &&
        category !== "ALL" && { status: category as PrescriptionStatus }),

      drugs: { some: {} },
    };

    const [prescriptions, total] = await Promise.all([
      db.prescription.findMany({
        where: where,
        include: {
          patient: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              date_of_birth: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
            },
          },
          drugs: {
            include: {
              drug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.prescription.count({ where }),
    ]);

    const totalPages = Math.ceil(total / LIMIT);

    return {
      data: prescriptions,
      totalRecord: total,
      totalPages,
      currentPage: PAGE_NUMBER,
    };
  } catch (error) {
    return { error: "Failed to fetch prescriptions" };
  }
}

export async function getAvailableDrugs() {
  try {
    const drugs = await db.drug.findMany({
      where: {
        quantity: {
          gt: 0,
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return { drugs };
  } catch (error) {
    return { error: "Failed to fetch available drugs" };
  }
}

export async function getPatients(search?: string) {
  try {
    const where: Prisma.PatientWhereInput = search
      ? {
          OR: [
            { first_name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const patients = await db.patient.findMany({
      where,
      orderBy: {
        first_name: "asc",
        last_name: "desc",
      },
    });
    return { patients };
  } catch (error) {
    return { error: "Failed to fetch patients" };
  }
}

export async function getPharmacyDashboardStats(search?: string) {
  try {
    const LOW_STOCK_THRESHOLD = 10;
    const EXPIRING_SOON_DAYS = 30;

    const expiringSoonDate = sub(new Date(), { days: -EXPIRING_SOON_DAYS });

    const [
      totalDrugs,
      totalLowStock,
      expiringSoonDrugs,
      totalIssuedDrugs,
      expiringDrugList,
    ] = await db.$transaction([
      db.drug.count(),
      db.drug.count({
        where: {
          quantity: {
            lte: LOW_STOCK_THRESHOLD,
          },
        },
      }),
      db.drug.count({
        where: {
          expiryDate: {
            lte: expiringSoonDate,
          },
        },
      }),
      db.issuedDrug.count(),
      db.drug.findMany({
        where: {
          expiryDate: {
            lte: expiringSoonDate,
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalDrugs,
      totalLowStock,
      expiringSoonDrugs,
      totalIssuedDrugs,
      expiringDrugList,
    };
  } catch (error) {
    return { error: "Failed to fetch stats" };
  }
}

export async function getExpiringDrugs({
  page,
  limit,
  search,
  category,
}: {
  page: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  try {
    const LOW_STOCK_THRESHOLD = 10;
    const EXPIRING_SOON_DAYS = 30;

    const expiringSoonDate = sub(new Date(), { days: -EXPIRING_SOON_DAYS });

    const PAGE_NUMBER = search ? 1 : Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const where: Prisma.DrugWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { manufacturer: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category &&
        category !== "ALL" && { category: category as DrugCategory }),
      expiryDate: {
        lte: expiringSoonDate,
      },
    };

    const [drugs, total] = await Promise.all([
      db.drug.findMany({
        where,
        take: LIMIT,
        skip: SKIP,
        orderBy: { name: "asc" },
      }),
      db.drug.count({ where }),
    ]);

    const totalPages = Math.ceil(total / LIMIT);

    return {
      data: drugs,
      totalRecord: total,
      totalPages,
      currentPage: PAGE_NUMBER,
    };
  } catch (error) {
    return { error: "Failed to fetch drugs" };
  }
}

export async function getPrescriptionById(id: string) {
  try {
    if (!id) return { error: true, message: "Please provide prescription id" };

    const data = await db.prescription.findUnique({
      where: { id: Number(id) },
      include: {
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            date_of_birth: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
        drugs: {
          include: {
            drug: true,
          },
        },
      },
    });

    return { data };
  } catch (error) {
    return { error: "Failed to fetch prescriptions" };
  }
}
