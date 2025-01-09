import { Pagination } from "@/components/pagination";
import { SearchByFilters } from "@/components/search-by-category";
import SearchInput from "@/components/search-input";
import { UserStatus } from "@/components/status";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchParamsProps } from "@/types";
import { formatDateTime } from "@/utils";
import { getUsers } from "@/utils/services/admin";
import { DATA_LIMIT } from "@/utils/settings";
import { User } from "@prisma/client";
import { BriefcaseBusiness, ListFilter } from "lucide-react";

const columns = [
  {
    header: "user ID",
    key: "id",
    className: "hidden lg:table-cell",
  },
  {
    header: "Name",
    key: "name",
  },
  {
    header: "Email",
    key: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Role",
    key: "role",
  },
  {
    header: "Status",
    key: "status",
  },
  {
    header: "Last Login",
    key: "last_login",
    className: "hidden xl:table-cell",
  },
];

const ManageUsers = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;

  const page = searchParams?.p || "1";
  const searchQuery = (searchParams?.q || "") as string;
  const category = (searchParams?.c || "") as string;

  const { data, totalRecord, totalPages, currentPage } = await getUsers({
    page: Number(page),
    search: searchQuery,
    role: category,
  });

  if (!data) {
    return null;
  }

  const renderRow = (item: User) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900 cursor-pointer"
    >
      <td className="hidden lg:table-cell items-center gap-2 md:gap-4 ">
        {item.id}
      </td>

      <td className="table-cell py-2 xl:py-4">{item?.name}</td>
      <td className="hidden md:table-cell">{item?.email}</td>
      <td className="table-cell capitalize">{item?.role}</td>
      <td className="items-center py-2 peer">
        <UserStatus status={"ACTIVE"} />
      </td>
      <td className="hidden xl:table-cell">
        {formatDateTime(new Date(item?.lastLogin).toString())}
      </td>
    </tr>
  );

  return (
    <Card className="rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <BriefcaseBusiness size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecord}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total users
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />
          <SearchByFilters
            data={[
              "ADMIN",
              "DOCTOR",
              "LABORATORY",
              "NURSE",
              "PHARMACY",
              "PATIENT",
            ]}
          />
        </div>
      </div>

      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={data} />

        {totalPages && (
          <Pagination
            totalRecords={totalRecord}
            currentPage={currentPage}
            totalPages={totalPages}
            limit={DATA_LIMIT}
          />
        )}
      </div>
    </Card>
  );
};

export default ManageUsers;
