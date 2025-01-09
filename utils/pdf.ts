import PDFDocument from "pdfkit";
import { Invoice, PurchasedDrug } from "@prisma/client";

export async function generateInvoicePDF(
  invoice: Invoice & {
    drugs: (PurchasedDrug & {
      drug: { name: string };
    })[];
  }
): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    // Header
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    // Invoice details
    doc
      .fontSize(12)
      .text(`Invoice #: ${invoice.id}`)
      .text(`Provider: ${invoice.providerName}`)
      .text(`Date: ${invoice.purchaseDate.toLocaleDateString()}`)
      .text(`Status: ${invoice.status}`)
      .moveDown();

    // Table header
    const tableTop = doc.y;
    doc
      .text("Drug", 50, tableTop)
      .text("Quantity", 250, tableTop)
      .text("Price/Unit", 350, tableTop)
      .text("Total", 450, tableTop)
      .moveDown();

    // Table rows
    let y = doc.y;
    invoice.drugs.forEach((item) => {
      doc
        .text(item.drug.name, 50, y)
        .text(item.quantity.toString(), 250, y)
        .text(`$${item.pricePerUnit.toFixed(2)}`, 350, y)
        .text(`$${(item.quantity * item.pricePerUnit).toFixed(2)}`, 450, y);
      y += 20;
    });

    // Total
    doc.moveDown().text(`Total Amount: $${invoice.totalCost.toFixed(2)}`, {
      align: "right",
    });

    doc.end();
  });
}
