"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const CsvImport = () => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // This would be connected to the backend later
      toast.success("The inventory list has been successfully imported.");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          <p className="text-sm text-muted-foreground">
            Upload a CSV file containing your inventory list. The file should
            include columns for drug name, batch number, manufacturer, expiry
            date, quantity, price per unit, category, and description.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
