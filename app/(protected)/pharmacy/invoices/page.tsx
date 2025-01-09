import { Pagination } from "@/components/pagination";
import { InvoiceTable } from "@/components/pharmacy/invoices/inoice-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchParamsProps } from "@/types";
import { getInvoices } from "@/utils/services/pharmacy";
import { DATA_LIMIT } from "@/utils/settings";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const InvoicesPage = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;
  const category = (searchParams?.c || "") as string;

  const { data, totalPages, currentPage, totalRecord } = await getInvoices({
    page: Number(page),
    search: searchQuery,
  });

  if (!data) return null;
  //   console.dir(data, { depth: null });
  return (
    <div className="container mx-auto py-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p>
              <strong>{totalRecord}</strong> invoices created
            </p>
          </div>
          <Link href="/pharmacy/invoices/create">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
          </Link>
        </div>

        <div>
          <InvoiceTable data={data! as any} />

          {data?.length > 0 && (
            <Pagination
              totalRecords={totalRecord!}
              currentPage={currentPage!}
              totalPages={totalPages!}
              limit={DATA_LIMIT}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default InvoicesPage;
