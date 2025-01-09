import { Pagination } from "@/components/pagination";
import { DrugList } from "@/components/pharmacy/drugs/drug-list";
import { Button } from "@/components/ui/button";
import { SearchParamsProps } from "@/types";
import { getDrugs } from "@/utils/services/pharmacy";
import { DATA_LIMIT } from "@/utils/settings";
import { Plus } from "lucide-react";
import Link from "next/link";

const DrugsPage = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;
  const category = (searchParams?.c || "") as string;

  const { data, totalPages, currentPage, totalRecord } = await getDrugs({
    page: Number(page),
    search: searchQuery,
    category: category ? category : "ALL",
  });

  if (!data) return null;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Drugs Inventory</h1>
          <p>
            <strong>{totalRecord}</strong> drugs available
          </p>
        </div>
        <Link href="/pharmacy/drugs/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Drug
          </Button>
        </Link>
      </div>

      <div>
        <DrugList data={data} />

        {data?.length > 0 && (
          <Pagination
            totalRecords={totalRecord!}
            currentPage={currentPage!}
            totalPages={totalPages!}
            limit={DATA_LIMIT}
          />
        )}
      </div>
    </div>
  );
};

export default DrugsPage;
