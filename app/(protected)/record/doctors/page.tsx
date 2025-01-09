import { ViewAction } from "@/components/action-options";
import ActionDialog from "@/components/dialogs/action-dialog";
import { DoctorForm } from "@/components/forms/doctor-form";
import { Pagination } from "@/components/pagination";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { Card } from "@/components/ui/card";
import { SearchParamsProps } from "@/types";
import { formatDate, formatPhoneNumber } from "@/utils";
import { checkRole } from "@/utils/roles";
import { getAllDoctors } from "@/utils/services/doctor";
import { DATA_LIMIT } from "@/utils/settings";
import { Doctor } from "@prisma/client";
import { Users } from "lucide-react";

const columns = [
  {
    header: "Info",
    key: "name",
  },
  {
    header: "License #",
    key: "license",
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

const ManageDoctor = async (props: SearchParamsProps) => {
  const isAdmin = await checkRole("ADMIN");
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;

  const { data, totalRecord, totalPages, currentPage } = await getAllDoctors({
    page,
    limit: DATA_LIMIT,
    search: searchQuery,
  });

  if (!data) {
    return null;
  }

  const renderRow = (item: Doctor) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900"
      >
        <td className="flex items-center gap-4 p-4">
          <ProfileImage
            url={item?.img!}
            name={item?.name}
            bgColor={item?.colorCode!}
            textClassName="text-black"
          />

          <div>
            <h3 className="font-semibold uppercase">{item?.name}</h3>
            <span className="text-sm capitalize text-gray-500">
              {item?.specialization}
            </span>
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.license_number}</td>
        <td className="hidden md:table-cell">
          {formatPhoneNumber(item?.phone)}
        </td>
        <td className="hidden lg:table-cell lowercase">{item?.email}</td>
        <td className="hidden xl:table-cell">{formatDate(item?.created_at)}</td>
        <td>
          <div className="flex items-center gap-2">
            {/* <ActionDialog type="doctor" data={item!} /> */}
            <ViewAction href={`doctors/${item.id}`} />
            {isAdmin && (
              <ActionDialog type="delete" id={item.id} deleteType="doctor" />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <Users size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecord}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total doctors
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />

          {isAdmin && <DoctorForm />}
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

export default ManageDoctor;
