import db from "@/lib/db";
import { InvoiceTable } from "./invoices/inoice-table";

export const Invoices = async () => {
  const data = await db.invoice.findMany({
    take: 10,
    orderBy: { created_at: "desc" },
  });

  if (!data) return null;

  return <InvoiceTable data={data as any} />;
};
