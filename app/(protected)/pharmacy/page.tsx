import { PharmacyDashboard } from "@/components/pharmacy/dashboard";
import { DrugIssuance } from "@/components/pharmacy/drug-issuance";
import { DrugStock } from "@/components/pharmacy/drug-stock";
import { ExpiringDrugs } from "@/components/pharmacy/expiring-drugs";
import { Invoices } from "@/components/pharmacy/invoices";
import { CsvImport } from "@/components/pharmacy/invoices/csv-import";
import { InvoiceGeneration } from "@/components/pharmacy/invoices/generate-inoice-card";
import { StockHistory } from "@/components/pharmacy/stock-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParamsProps } from "@/types";
import { getPharmacyDashboardStats } from "@/utils/services/pharmacy";
import {
  AlertCircle,
  Calendar,
  ClipboardList,
  FileText,
  Package,
} from "lucide-react";
import { SearchParams } from "next/dist/server/request/search-params";

const PharmacyHome = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const category = searchParams?.c || "ALL";
  const searchTerm = (searchParams?.q || "") as string;

  const {
    totalDrugs,
    totalLowStock,
    expiringSoonDrugs,
    totalIssuedDrugs,
    expiringDrugList,
  } = await getPharmacyDashboardStats();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <PharmacyDashboard
        totalDrugs={totalDrugs!}
        totalLowStock={totalLowStock!}
        expiringSoonDrugs={expiringSoonDrugs!}
        totalIssuedDrugs={totalIssuedDrugs!}
        expiringDrugList={expiringDrugList!}
      />

      <Tabs defaultValue="expiring" className="mt-8">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="expiring" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Expiring Drugs
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Drug Stock
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Stock History
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="issuance" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Drug Issuance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expiring">
          <ExpiringDrugs />
        </TabsContent>

        <TabsContent value="stock">
          <DrugStock category={category} searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="history">
          <StockHistory />
        </TabsContent>

        <TabsContent value="invoices">
          <Invoices />
        </TabsContent>

        <TabsContent value="issuance">
          <DrugIssuance />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-10 mt-20">
        <InvoiceGeneration />
        <CsvImport />
      </div>
    </div>
  );
};

export default PharmacyHome;
