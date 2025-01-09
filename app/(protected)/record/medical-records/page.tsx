import { ViewAction } from "@/components/action-options";
import { MedicalHistoryDialog } from "@/components/dialogs/medical-history-dialog";
import { ExtendedMedicalHistory } from "@/components/medical-history";
import { Pagination } from "@/components/pagination";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchParamsProps } from "@/types";
import { formatDateTime } from "@/utils";
import { getMedicalRecords } from "@/utils/services/medical-records";
import { DATA_LIMIT } from "@/utils/settings";
import { BriefcaseBusiness, ListFilter } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    header: "No",
    key: "no",
    // className: "hidden md:table-cell",
  },
  {
    header: "Info",
    key: "name",
  },
  {
    header: "Date & Time",
    key: "medical_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "hidden 2xl:table-cell",
  },
  {
    header: "Diagnosis",
    key: "diagnosis",
    className: "hidden lg:table-cell",
  },
  {
    header: "Lab Test",
    key: "lab_test",
    className: "hidden 2xl:table-cell",
  },
  {
    header: "Action",
    key: "action",
    className: "",
  },
];

const MedicalRecordsPage = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;

  const { data, totalRecord, totalPages, currentPage } =
    await getMedicalRecords({
      page,
      limit: DATA_LIMIT,
      search: searchQuery,
    });

  const renderRow = (item: ExtendedMedicalHistory) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900 cursor-pointer"
      >
        <td className="py-2 xl:py-6"># {item?.id}</td>

        <td className="flex items-center gap-2 2xl:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item?.patient?.img!}
            name={item?.patient?.first_name + " " + item?.patient?.last_name}
          />
          <div>
            <h3 className="md:font-semibold uppercase">
              {item?.patient?.first_name + " " + item?.patient?.last_name}
            </h3>
            <span className="text-xs capitalize">
              {item?.patient?.gender.toLowerCase()}
            </span>
          </div>
        </td>

        <td className="hidden md:table-cell">
          {formatDateTime(item?.created_at.toString())}
        </td>

        <td className="hidden  items-center py-2  2xl:table-cell">
          {item?.doctor_id}
        </td>
        <td className="hidden lg:table-cell">
          {item?.diagnosis?.length === 0 ? (
            <span className="text-sm italic text-gray-500">
              No diagnosis found
            </span>
          ) : (
            <>
              <MedicalHistoryDialog
                id={item?.appointment_id}
                patientId={item?.patient_id}
                doctor_id={item?.doctor_id}
                label={
                  <div className="flex gap-x-2 items-center text-lg">
                    {item?.diagnosis?.length}

                    <span className="text-sm">Found</span>
                  </div>
                }
              />
            </>
          )}
        </td>
        <td className="hidden 2xl:table-cell">
          {item?.lab_test?.length === 0 ? (
            <span className="text-sm italic text-gray-500">
              No lab test found
            </span>
          ) : (
            <Link
              href={`/record/appointments/${item?.appointment_id}?cat=lab-test`}
            >
              <div className="flex gap-x-2 items-center text-lg">
                {item?.lab_test?.length}

                <span className="text-sm">Found</span>
              </div>
            </Link>
          )}
        </td>

        <td>
          <ViewAction href={`appointments/${item?.appointment_id}`} />
        </td>
      </tr>
    );
  };

  return (
    <Card className="rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <BriefcaseBusiness size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecord ?? 0}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total records
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <ListFilter size={20} />
            Filter
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={data!} />
        {data?.length !== 0 && (
          <Pagination
            totalRecords={totalRecord!}
            currentPage={currentPage!}
            totalPages={totalPages!}
            limit={DATA_LIMIT}
          />
        )}
      </div>
    </Card>
  );
};

export default MedicalRecordsPage;
