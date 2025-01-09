import ActionDialog from "@/components/dialogs/action-dialog";
import { Pagination } from "@/components/pagination";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getFormatTime } from "@/utils";
import { checkRole } from "@/utils/roles";
import { getAuditLogs } from "@/utils/services/audit-logs";
import { DATA_LIMIT } from "@/utils/settings";
import { AuditLog } from "@prisma/client";
import { BriefcaseBusiness, ListFilter, Search } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    header: "User ID",
    key: "user_id",
    className: "hidden md:table-cell",
  },
  {
    header: "Action",
    key: "action",
    className: "hidden md:table-cell",
  },
  {
    header: "Timestamp",
    key: "timestamp",
    className: "hidden md:table-cell",
  },
  {
    header: "details",
    key: "details",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action1",
  },
];

const AuditLogPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const isAdmin = await checkRole("ADMIN");

  const { data, totalRecord, currentPage, totalPages } = await getAuditLogs({
    page,
    limit: DATA_LIMIT,
  });

  const renderRow = (item: AuditLog) => (
    <tr
      key={item?.id}
      className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900 cursor-pointer"
    >
      <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
        {item?.user_id}
      </td>

      <td className="hidden md:table-cell">{item?.action}</td>
      <td className="hidden md:table-cell capitalize">
        {getFormatTime(item?.created_at)}
      </td>

      <td className="hidden xl:table-cell w-[50%]">
        <p className="line-clamp-1">{item?.details!}</p>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item?.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              View
            </button>
          </Link>

          {isAdmin && (
            <ActionDialog
              type="delete"
              id={item?.id.toString()}
              deleteType="auditLog"
            />
          )}
        </div>
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
            total appointments
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />
        </div>
      </div>

      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={data!} />
        <Pagination
          totalRecords={totalRecord!}
          currentPage={currentPage!}
          totalPages={totalPages!}
          limit={DATA_LIMIT}
        />
      </div>
    </Card>
  );
};

export default AuditLogPage;
