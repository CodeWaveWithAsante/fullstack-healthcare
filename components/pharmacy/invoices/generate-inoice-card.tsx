"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const InvoiceGeneration = () => {
  const [providerName, setProviderName] = useState("");

  const handleGenerateInvoice = () => {
    // This would be connected to the backend later
    toast.success("The invoice has been generated and sent to the provider.");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Invoice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="providerName">Provider Name</Label>
            <Input
              id="providerName"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Enter provider name"
            />
          </div>
          <Button onClick={handleGenerateInvoice} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Generate and Send Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
