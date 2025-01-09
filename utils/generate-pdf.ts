import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface Drug {
  id: string;
  invoiceId: string;
  drugId: string;
  quantity: number;
  pricePerUnit: number;
  drug: {
    name: string;
  };
}

interface Data {
  id: string;
  providerName: string;
  purchaseDate: string;
  totalCost: number;
  status: string;
  created_at: string;
  drugs: Drug[];
}

export async function generatePdfReport(data: Data): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]); // Set custom page size

  // Set font and font size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;
  const headerFontSize = 24;
  const subtitleFontSize = 16;

  // Set initial y position for text
  let y = page.getHeight() - 50;

  // Function to add text to the page
  const addText = (
    text: string,
    x: number,
    y: number,
    size: number,
    bold = false,
    align: "left" | "center" | "right" = "left"
  ) => {
    const textWidth = bold
      ? boldFont.widthOfTextAtSize(text, size)
      : font.widthOfTextAtSize(text, size);
    let adjustedX = x;
    if (align === "center") {
      adjustedX = x - textWidth / 2;
    } else if (align === "right") {
      adjustedX = x - textWidth;
    }
    page.drawText(text, {
      x: adjustedX,
      y,
      size,
      font: bold ? boldFont : font,
      color: rgb(0, 0, 0),
    });
  };

  // Add header
  addText("Kinda Healthcare", 300, y, headerFontSize, true, "center");
  y -= 30;

  // Add subtitle
  addText("Invoice", 300, y, subtitleFontSize, true, "center");
  y -= 40;

  // Add border bottom to the header
  page.drawLine({
    start: { x: 50, y: y + 10 },
    end: { x: 550, y: y + 10 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  // Add provider name
  addText(`Provider Name: ${data.providerName}`, 50, y, fontSize);
  y -= 20;

  // Add purchase date and status (justified left and right)
  const purchaseDateText = `Purchase Date: ${new Date(
    data.purchaseDate
  ).toLocaleDateString()}`;
  const statusText = `Status: ${data.status}`;
  addText(purchaseDateText, 50, y, fontSize);
  addText(
    statusText,
    550 - font.widthOfTextAtSize(statusText, fontSize),
    y,
    fontSize
  );
  y -= 20;

  // Add created at date
  addText(
    `Created At: ${new Date(data.created_at).toLocaleDateString()}`,
    50,
    y,
    fontSize
  );
  y -= 40;

  // Add drugs table
  const tableX = 50;
  const tableY = y;
  const columnWidth = 120;
  const rowHeight = 25;

  // Draw table borders
  const drawTableBorder = (
    x: number,
    y: number,
    width: number,
    height: number,
    borderWidth = 1,
    color = rgb(0.7, 0.7, 0.7)
  ) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      borderColor: color,
      borderWidth,
    });
  };

  // Draw table headers
  const headers = ["Name", "Quantity", "Price Per Unit", "Total"];
  headers.forEach((header, index) => {
    const x = tableX + index * columnWidth;
    drawTableBorder(
      x,
      tableY - rowHeight,
      columnWidth,
      rowHeight,
      1,
      rgb(0, 0, 0)
    ); // Thicker border for header
    addText(
      header,
      x + columnWidth / 2,
      tableY - rowHeight + 7,
      fontSize,
      true,
      "center"
    );
  });

  // Draw table rows
  data.drugs.forEach((drug, rowIndex) => {
    const rowY = tableY - (rowIndex + 2) * rowHeight;
    const total = drug.quantity * drug.pricePerUnit;

    // Draw row borders
    drawTableBorder(tableX, rowY, columnWidth * headers.length, rowHeight);

    // Add drug data
    addText(drug.drug.name, tableX + 10, rowY + 7, fontSize);
    addText(
      drug.quantity.toString(),
      tableX + columnWidth + columnWidth / 2,
      rowY + 7,
      fontSize,
      false,
      "center"
    );
    addText(
      `$${drug.pricePerUnit.toFixed(2)}`,
      tableX + 2 * columnWidth + columnWidth - 10,
      rowY + 7,
      fontSize,
      false,
      "right"
    );
    addText(
      `$${total.toFixed(2)}`,
      tableX + 3 * columnWidth + columnWidth - 10,
      rowY + 7,
      fontSize,
      false,
      "right"
    );
  });

  // Draw table outer border
  drawTableBorder(
    tableX,
    tableY - (data.drugs.length + 1) * rowHeight,
    columnWidth * headers.length,
    (data.drugs.length + 1) * rowHeight,
    1,
    rgb(0, 0, 0)
  );

  // Add total cost at the bottom of the table
  const totalY = tableY - (data.drugs.length + 2) * rowHeight;
  addText(
    `Total Cost: $${data.totalCost.toFixed(2)}`,
    tableX + 3 * columnWidth + columnWidth - 10,
    totalY + 7,
    fontSize,
    true,
    "right"
  );

  // Add note at the bottom of the PDF
  const noteText = `This report was generated by the system on ${new Date().toLocaleString()}.`;
  addText(noteText, 50, 50, fontSize, false, "left");

  // Save the PDF to a file
  const pdfBytes = await pdfDoc.save();
  console.log("PDF report generated successfully.");

  return pdfBytes;
}
