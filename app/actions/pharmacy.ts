"use server";

import db from "@/lib/db";
import { generateInvoicePDF } from "@/utils/pdf";
import { auth } from "@clerk/nextjs/server";
import { Drug } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createDrug(
  data: Omit<Drug, "id" | "created_at" | "updatedAt">
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized user");
    }
    const drug = await db.drug.create({
      data,
    });
    revalidatePath("/pharmacy/drugs");
    return { drug, success: true, message: "Drug added successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, error: true, message: "Failed to create drug" };
  }
}

export async function updateDrug(id: string, data: Partial<Drug>) {
  try {
    const drug = await db.drug.update({
      where: { id },
      data,
    });
    //   revalidatePath('/pharmacy/drugs');
    return { drug, success: true, message: "Drug updated successfully" };
  } catch (error) {
    return { error: "Failed to update drug" };
  }
}

export async function deleteDrug(id: string) {
  try {
    await db.drug.delete({
      where: { id },
    });
    //   revalidatePath('/pharmacy/drugs');
    return { success: true, message: "Drug deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete drug" };
  }
}

// Stock Management
export async function updateStock(
  drugId: string,
  quantity: number,
  type: "RESTOCK" | "ISSUANCE",
  notes?: string
) {
  try {
    const drug = await db.drug.findUnique({
      where: { id: drugId },
    });

    if (!drug) {
      return { error: true, message: "Drug not found" };
    }

    const previousQuantity = drug.quantity;
    const newQuantity =
      type === "RESTOCK"
        ? previousQuantity + quantity
        : previousQuantity - quantity;

    if (newQuantity < 0) {
      return { error: true, message: "Insufficient stock" };
    }
    const { userId } = await auth();

    await db.$transaction([
      db.drug.update({
        where: { id: drugId },
        data: { quantity: newQuantity },
      }),
      db.stockUpdate.create({
        data: {
          drugId,
          previousQuantity,
          newQuantity,
          type,
          userId: userId!,
          notes: notes!,
        },
      }),
    ]);

    //   revalidatePath('/pharmacy/drugs');
    return { success: true, message: "Stock updated successfully" };
  } catch (error) {
    return { error: "Failed to update stock" };
  }
}

export type CreateInvoiceData = {
  providerName: string;
  purchaseDate: Date;
  drugs: {
    drugId: string;
    quantity: number;
    pricePerUnit: number;
  }[];
};

export async function createInvoice(data: CreateInvoiceData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized user");
    }

    const totalCost = data.drugs.reduce(
      (acc, drug) => acc + drug.quantity * drug.pricePerUnit,
      0
    );

    const invoice = await db.invoice.create({
      data: {
        providerName: data.providerName,
        purchaseDate: data.purchaseDate,
        totalCost,
        status: "PENDING",
        drugs: {
          create: data.drugs,
        },
      },
      include: {
        drugs: {
          include: {
            drug: true,
          },
        },
      },
    });

    // Generate PDF
    // const pdf = await generateInvoicePDF(invoice);

    revalidatePath("/pharmacy/invoices");
    return { invoice };
  } catch (error) {
    return { error: "Failed to create invoice" };
  }
}

export async function updateInvoiceStatus(
  id: string,
  status: "PENDING" | "RECEIVED" | "CANCELLED" | "PAID"
) {
  try {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        drugs: true,
      },
    });

    if (!invoice) {
      return { message: "Invoice not found" };
    }

    const { userId } = await auth();

    // If status is changing to RECEIVED, update stock
    if (status === "RECEIVED" && invoice.status !== "RECEIVED") {
      await db.$transaction(async (tx) => {
        // Update invoice status
        await tx.invoice.update({
          where: { id },
          data: { status },
        });

        // Update stock for each drug
        for (const item of invoice.drugs) {
          const drug = await tx.drug.findUnique({
            where: { id: item.drugId },
          });

          if (drug) {
            await tx.drug.update({
              where: { id: item.drugId },
              data: {
                quantity: drug.quantity + item.quantity,
              },
            });

            // Create stock update record
            await tx.stockUpdate.create({
              data: {
                drugId: item.drugId,
                previousQuantity: drug.quantity,
                newQuantity: drug.quantity + item.quantity,
                type: "RESTOCK",
                userId: userId!,
                notes: `Stock updated from Invoice #${invoice.id}`,
              },
            });
          }
        }
      });
    } else {
      // Just update status if not RECEIVED
      await db.invoice.update({
        where: { id },
        data: { status },
      });
    }

    revalidatePath("/pharmacy/invoices");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update invoice status" };
  }
}

export async function issueDrugs(data: {
  prescriptionId: string;
  patientId: string;
  drugs: {
    drugId: string;
    quantity: number;
    pricePerUnit: number;
  }[];
}) {
  try {
    const totalCost = data.drugs.reduce(
      (acc, drug) => acc + drug.quantity * drug.pricePerUnit,
      0
    );

    const { userId } = await auth();

    await db.$transaction(async (tx) => {
      // Create drug issuance record
      const issuance = await tx.drugIssuance.create({
        data: {
          prescriptionId: Number(data.prescriptionId),
          patientId: data.patientId,
          pharmacistId: "system", // Replace with actual user ID
          totalCost,
          drugs: {
            create: data.drugs,
          },
        },
      });

      // Update prescription status
      await tx.prescription.update({
        where: { id: Number(data.prescriptionId) },
        data: { status: "COMPLETED" },
      });

      // Update drug stock
      for (const drug of data.drugs) {
        const currentDrug = await tx.drug.findUnique({
          where: { id: drug.drugId },
        });

        if (!currentDrug) continue;

        await tx.drug.update({
          where: { id: drug.drugId },
          data: {
            quantity: currentDrug.quantity - drug.quantity,
          },
        });

        // Create stock update record
        await tx.stockUpdate.create({
          data: {
            drugId: drug.drugId,
            previousQuantity: currentDrug.quantity,
            newQuantity: currentDrug.quantity - drug.quantity,
            type: "ISSUANCE",
            userId: userId!, // Replace with actual user ID
            notes: `Issued for prescription #${data.prescriptionId}`,
          },
        });
      }
    });

    revalidatePath("/pharmacy/drug-issuance");
    return { success: true };
  } catch (error) {
    return { error: "Failed to issue drugs" };
  }
}
