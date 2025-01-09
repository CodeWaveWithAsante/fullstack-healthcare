"use client";

import { updateInvoiceStatus } from "@/app/actions/pharmacy";
import { Button } from "@/components/ui/button";
import { InvoiceType } from "@/lib/types/pharmacy";
import { generatePdfReport } from "@/utils/generate-pdf";

import { Check, FileText, X } from "lucide-react";
import { toast } from "sonner";

type InvoiceActionsProps = {
  id: string;
  status: string;
  data: InvoiceType;
};

export function InvoiceActions({ id, status, data }: InvoiceActionsProps) {
  const handleStatusUpdate = async (newStatus: "RECEIVED" | "CANCELLED") => {
    const result = await updateInvoiceStatus(id, newStatus);
    if (result.success) {
      toast.success(`Invoice marked as ${newStatus.toLowerCase()}`);
    } else {
      toast.error(result.error);
    }
  };

  const handleDownloadPDF = async () => {
    const pdfBytes = await generatePdfReport(data as any);

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.pdf";
    link.click();
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" onClick={handleDownloadPDF}>
        <FileText className="w-4 h-4" />
      </Button>
      {status === "PENDING" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600"
            onClick={() => handleStatusUpdate("RECEIVED")}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => handleStatusUpdate("CANCELLED")}
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
}
