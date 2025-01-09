import { Pagination } from "@/components/pagination";
import { ExpiringDrugsTable } from "@/components/pharmacy/drugs/expiring-drugs-table";
import { SearchByCategory } from "@/components/search-by-category";
import SearchInput from "@/components/search-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SearchParamsProps } from "@/types";
import { getExpiringDrugs } from "@/utils/services/pharmacy";
import { DATA_LIMIT } from "@/utils/settings";

const ExpiringSoonDrugs = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;
  const category = (searchParams?.c || "ALL") as string;

  const { data, totalPages, totalRecord, currentPage } = await getExpiringDrugs(
    {
      page: Number(page),
      search: searchQuery,
      category: category,
    }
  );

  if (!data) return null;

  return (
    <Card className="mb-8">
      <CardHeader className={cn("flex flex-row items-center justify-between")}>
        <CardTitle>Expiring Soon</CardTitle>
        <div className="flex items-center gap-3">
          <SearchInput />
          <SearchByCategory />
        </div>
      </CardHeader>
      <CardContent>
        <ExpiringDrugsTable data={data} />

        {data?.length > 0 && (
          <Pagination
            totalRecords={totalRecord!}
            currentPage={currentPage!}
            totalPages={totalPages!}
            limit={DATA_LIMIT}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringSoonDrugs;
