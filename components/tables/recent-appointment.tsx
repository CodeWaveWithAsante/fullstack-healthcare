import Link from "next/link";

import { Appointment } from "@/types/appointments";
import { formatDate } from "@/utils";

import { ViewAppointment } from "../dialogs/view-appointment";
import { ProfileImage } from "../profile-image";
import { AppointmentStatusIndicator } from "../status";
import { Button } from "../ui/button";
import { Table } from "./table";

const columns = [
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

interface RecentAppointmentProps {
  data: Appointment[];
}

export const RecentAppointments = ({ data }: RecentAppointmentProps) => {
  const renderRow = (item: Appointment) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900 cursor-pointer"
    >
      <td className="flex items-center gap-2 2xl:gap-4 py-2 xl:py-4">
        <ProfileImage
          className="hidden md:flex"
          url={item?.patient?.img!}
          name={item?.patient?.first_name + " " + item?.patient?.last_name}
          bgColor={item?.patient?.colorCode!}
        />
        <div>
          <h3 className="text-sm md:text-base md:font-medium uppercase">
            {item?.patient?.first_name + " " + item?.patient?.last_name}
          </h3>
          <span className="text-xs capitalize">
            {item?.patient?.gender.toLowerCase()}
          </span>
        </div>
      </td>

      <td className="hidden md:table-cell">
        {formatDate(item.appointment_date)}
      </td>
      <td className="hidden md:table-cell">{item.time}</td>
      <td className="hidden  items-center py-2  md:table-cell">
        <div className="flex items-center  gap-2 2xl:gap-4">
          <ProfileImage
            url={item.doctor?.img!}
            name={item.doctor?.name}
            bgColor={item?.doctor?.colorCode!}
            textClassName="text-black"
          />

          <div>
            <h3 className="font-medium uppercase">{item.doctor?.name}</h3>
            <span className="text-xs capitalize">
              {item.doctor?.specialization}
            </span>
          </div>
        </div>
      </td>
      <td className="hidden xl:table-cell">
        <AppointmentStatusIndicator status={item.status!} />
      </td>
      <td>
        <div className="flex items-center gap-x-2">
          <ViewAppointment id={item?.id} />

          <Link
            href={`/record/appointments/${item.id}`}
            className="hover:underline text-xs md:text-sm"
          >
            See All
          </Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-background rounded-xl p-2 2xl:p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Recent Appointments</h1>
        <Button asChild variant="outline" className="">
          <Link href="/record/appointments">View all</Link>
        </Button>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};
