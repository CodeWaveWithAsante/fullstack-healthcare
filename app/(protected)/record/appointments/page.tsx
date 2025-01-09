import { auth } from "@clerk/nextjs/server";
import { BriefcaseBusiness } from "lucide-react";

import { AppointmentActionOptions } from "@/components/appointment-actions";
import { ViewAppointment } from "@/components/dialogs/view-appointment";
import { AppointmentContainer } from "@/components/forms/appointment-container";
import { Pagination } from "@/components/pagination";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { AppointmentStatusIndicator } from "@/components/status";
import { Table } from "@/components/tables/table";
import { SearchParamsProps } from "@/types";
import { formatDate } from "@/utils";
import { checkRole, getRole } from "@/utils/roles";
import { getPatientAppointments } from "@/utils/services/appointment";
import { DATA_LIMIT } from "@/utils/settings";
import { Appointment, Doctor, Patient } from "@prisma/client";
import { Card } from "@/components/ui/card";

export const columns = [
  {
    header: "Info",
    key: "name",
  },
  {
    header: "Date",
    key: "appointment_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    key: "time",
    className: "hidden md:table-cell",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "Status",
    key: "status",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];

export interface DataProps extends Appointment {
  patient: Patient;
  doctor: Doctor;
  medical?: { id: string };
}

const Appointments = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const userRole = await getRole();
  const { userId } = await auth();

  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;
  const id = (searchParams?.id || undefined) as string;
  let queryId = undefined;

  if (
    userRole === "admin" ||
    (userRole === "doctor" && id) ||
    (userRole === "nurse" && id)
  ) {
    queryId = id;
  } else if (userRole === "doctor") {
    queryId = userId;
  } else if (userRole === "patient") {
    queryId = userId;
  } else if (userRole === "nurse") {
    queryId = undefined;
  }

  const { data, totalRecord, totalPages, currentPage } =
    await getPatientAppointments({
      page,
      limit: DATA_LIMIT,
      search: searchQuery,
      id: queryId!,
    });

  if (!data) return null;

  const renderRow = (item: DataProps) => {
    const patient_name = `${item?.patient?.first_name} ${item?.patient?.last_name}`;

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900 cursor-pointer"
      >
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item?.patient?.img!}
            name={patient_name}
            bgColor={item?.patient?.colorCode!}
          />
          <div>
            <h3 className="font-semibold uppercase">{patient_name}</h3>
            <span className="text-xs md:text-sm capitalize">
              {item?.patient?.gender.toLowerCase()}
            </span>
          </div>
        </td>

        <td className="hidden md:table-cell">
          {formatDate(item?.appointment_date)}
        </td>
        <td className="hidden md:table-cell">{item.time}</td>
        <td className="hidden  items-center py-2  md:table-cell">
          <div className="flex items-center  gap-2 md:gap-4">
            <ProfileImage
              url={item.doctor?.img!}
              name={item.doctor?.name}
              bgColor={item?.doctor?.colorCode!}
              textClassName="text-black"
            />

            <div>
              <h3 className="font-semibold uppercase">{item.doctor?.name}</h3>
              <span className="text-xs md:text-sm capitalize">
                {item.doctor?.specialization}
              </span>
            </div>
          </div>
        </td>
        <td className="hidden xl:table-cell">
          <AppointmentStatusIndicator status={item.status!} />
        </td>
        <td>
          <div className="flex items-center gap-2">
            <ViewAppointment id={item?.id.toString()} />
            <AppointmentActionOptions
              userId={userId!}
              patientId={item?.patient_id}
              doctorId={item?.doctor_id}
              status={item?.status}
              appointmentId={item.id}
            />
          </div>
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
            total appointments
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />

          {(await checkRole("PATIENT")) && (
            <AppointmentContainer id={userId!} />
          )}
        </div>
      </div>

      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={data} />

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
  );
};

export default Appointments;
