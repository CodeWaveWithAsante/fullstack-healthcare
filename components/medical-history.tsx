import { Diagnosis, LabTest, MedicalRecords, Patient } from "@prisma/client";
import React from "react";
import { ProfileImage } from "./profile-image";
import { formatDate, formatDateTime } from "@/utils";
import { Table } from "./tables/table";
import { BriefcaseBusiness } from "lucide-react";
import { MedicalHistoryCard } from "./cards/medical-history-card";
import { MedicalHistoryDialog } from "./dialogs/medical-history-dialog";
import { ViewAction } from "./action-options";
import { Card } from "./ui/card";

export interface ExtendedMedicalHistory extends MedicalRecords {
  patient?: Patient;
  diagnosis: Diagnosis[];
  lab_test: LabTest[];
  index?: number;
}

interface DataProps {
  data: ExtendedMedicalHistory[];
  isShowProfile?: boolean;
}

export const MedicalHistory = ({ data, isShowProfile }: DataProps) => {
  const columns = [
    {
      header: "No",
      key: "no",
    },
    {
      header: "Info",
      key: "name",
      className: isShowProfile ? "table-cell" : "hidden",
    },
    {
      header: "Date & Time",
      key: "medical_date",
      className: "",
    },
    {
      header: "Doctor",
      key: "doctor",
      className: "hidden xl:table-cell",
    },
    {
      header: "Diagnosis",
      key: "diagnosis",
      className: "hidden md:table-cell",
    },
    {
      header: "Lab Test",
      key: "lab_test",
      className: "hidden 2xl:table-cell",
    },
  ];

  const renderRow = (item: ExtendedMedicalHistory) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900"
      >
        <td className="py-2 xl:py-6"># {item?.id}</td>

        {isShowProfile && (
          <td className="flex items-center gap-2 2xl:gap-4 py-2 xl:py-4">
            <ProfileImage
              url={item?.patient?.img!}
              name={item?.patient?.first_name + " " + item?.patient?.last_name}
            />
            <div>
              <h3 className="font-semibold">
                {item?.patient?.first_name + " " + item?.patient?.last_name}
              </h3>
              <span className="text-xs capitalize hidden md:flex">
                {item?.patient?.gender.toLowerCase()}
              </span>
            </div>
          </td>
        )}

        <td className="">{formatDateTime(item?.created_at.toString())}</td>

        <td className="hidden  items-center py-2  xl:table-cell">
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
          {" "}
          {item?.lab_test?.length === 0 ? (
            <span className="text-sm italic text-gray-500">
              No lab test found
            </span>
          ) : (
            <div className="flex gap-x-2 items-center text-lg">
              {item?.lab_test?.length}

              <span className="text-sm">Found</span>
            </div>
          )}
        </td>

        <td>
          <ViewAction href={`/record/appointments/${item?.appointment_id}`} />
        </td>
      </tr>
    );
  };

  return (
    <>
      <Card className="rounded-xl p-2 2xl:p-6">
        <div className="">
          <h1 className="font-semibold text-xl">Medical History (All)</h1>
          <div className="hidden lg:flex items-center gap-1">
            <BriefcaseBusiness size={20} className="text-gray-500" />
            <p className="text-2xl font-semibold">{data?.length}</p>
            <span className="text-gray-600 text-sm xl:text-base">
              total records
            </span>
          </div>
        </div>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </Card>
    </>
  );
};
