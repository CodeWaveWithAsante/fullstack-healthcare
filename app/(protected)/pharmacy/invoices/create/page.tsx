import { CreateInvoiceForm } from "@/components/pharmacy/invoices/create-invoice-form";
import { DrugSelectionTable } from "@/components/pharmacy/invoices/drug-selection-table";
import { InvoicePreview } from "@/components/pharmacy/invoices/invoice-preview";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/lib/db";

const CreateInvoicePage = async () => {
  const drugs = await db.drug.findMany({ orderBy: { name: "asc" } });

  if (!drugs) return null;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <CreateInvoiceForm />
        </Card>

        <Tabs defaultValue="select">
          <TabsList>
            <TabsTrigger value="select">Select Drugs</TabsTrigger>
            <TabsTrigger value="preview">Preview Invoice</TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <Card className="p-6">
              <DrugSelectionTable drugs={drugs} />
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card className="p-6">
              <InvoicePreview />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateInvoicePage;
