import { ListFilter, Users } from "lucide-react";

import ActionDialog from "@/components/dialogs/action-dialog";
import { StaffForm } from "@/components/forms/staff-form";
import { Pagination } from "@/components/pagination";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { SearchParamsProps } from "@/types";
import { formatDate } from "@/utils";
import { checkRole } from "@/utils/roles";
import { getAllStaffs } from "@/utils/services/staffs";
import { DATA_LIMIT } from "@/utils/settings";
import { Staff } from "@prisma/client";
import { Card } from "@/components/ui/card";

const columns = [
  {
    header: "Info",
    key: "name",
  },
  {
    header: "Role",
    key: "role",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    key: "contact",
    className: "hidden md:table-cell",
  },
  {
    header: "Email",
    key: "email",
    className: "hidden lg:table-cell",
  },
  {
    header: "Joined Date",
    key: "created_at",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];
const ManageStaffs = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;
  const isAdmin = await checkRole("ADMIN");

  const { data, totalRecord, totalPages, currentPage } = await getAllStaffs({
    page,
    limit: DATA_LIMIT,
    search: searchQuery,
  });

  if (!data) {
    return null;
  }
  const renderRow = (item: Staff) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900 cursor-pointer"
    >
      <td className="flex items-center gap-4 p-4">
        <ProfileImage url={item?.img!} name={item.name} />

        <div>
          <h3 className="font-semibold uppercase">{item.name}</h3>
          <span className="text-sm capitalize">{item?.department}</span>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.role}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.email}</td>
      <td className="hidden xl:table-cell">{formatDate(item?.created_at)}</td>
      <td>
        <div className="flex items-center gap-2">
          <ActionDialog type="staff" data={item} />

          {isAdmin && (
            <ActionDialog type="delete" id={item.id} deleteType="staff" />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <Card className="rounded-xl py-6 px-3 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <Users size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecord}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total staffs
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />

          {isAdmin && <StaffForm />}
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <Table columns={columns} renderRow={renderRow} data={data} />

        <Pagination
          totalRecords={totalRecord}
          currentPage={currentPage}
          totalPages={totalPages}
          limit={DATA_LIMIT}
        />
      </div>
    </Card>
  );
};

export default ManageStaffs;
