import { StatCard } from "@/components/cards/stat-card";
import { StatSummary } from "@/components/charts/stat-summary";
import { ViewAppointment } from "@/components/dialogs/view-appointment";
import { ProfileImage } from "@/components/profile-image";
import { AppointmentStatusIndicator } from "@/components/status";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchParamsProps } from "@/types";
import { getBursesDashboardStatistics } from "@/utils/services/nurses";
import { format } from "date-fns";
import { BriefcaseBusiness, BriefcaseMedical, User, Users } from "lucide-react";
import { columns, DataProps } from "../record/appointments/page";
import SearchInput from "@/components/search-input";
import { AddVitalSigns } from "@/components/dialogs/add-vital-signs";

const NursePage = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const searchQuery = (searchParams?.q || "") as string;

  const data = await getBursesDashboardStatistics(searchQuery);

  if (!data) {
    return null;
  }

  const {
    appointmentCounts,
    totalAppointments,
    appointments,
    monthlyData,
    totalDoctors,
  } = data;

  const cardData = [
    {
      title: "Appointments",
      value: totalAppointments,
      icon: Users,
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Today's appointment",
      link: "/manage-patients",
    },
    {
      title: "Doctors",
      value: totalDoctors,
      icon: User,
      className: "bg-rose-600/15",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Available doctors",
      link: "/manage-doctors",
    },
    {
      title: "Appointments",
      value: appointmentCounts?.PENDING,
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Pending appointments",
      link: "/manage-appointments",
    },
    {
      title: "Consultation",
      value: appointmentCounts?.COMPLETED,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Completed appointments",
      link: "/manage-appointments",
    },
  ];

  const renderRow = (item: DataProps) => {
    const patient_name = `${item?.patient?.first_name} ${item?.patient?.last_name}`;

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900"
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
          {format(item?.appointment_date, "yyyy-MM-dd")}
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

            <AddVitalSigns
              key={new Date().getTime()}
              patientId={item?.patient_id}
              doctor_id={item?.doctor_id}
              appointment_id={item?.id}
              medicalId={item?.medical?.id || ""}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="">
      <Card className="rounded-xl flex flex-col xl:flex-row gap-6 cursor-pointer">
        {/* LEFT */}
        <div className="w-full xl:w-[69%]">
          <div className="rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold">Statistics</h1>
              <div className="space-x-2">
                <Button variant="outline">
                  {format(new Date(), "dd-MMM-yyyy")}
                </Button>
              </div>
            </div>
            <div className="w-full flex flex-wrap gap-5">
              {cardData?.map((i, id) => (
                <StatCard
                  key={id}
                  title={i.title}
                  value={i.value!}
                  icon={i.icon}
                  className={i.className}
                  note={i.note}
                  iconClassName={i.iconClassName}
                  link={i.link}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-[30%] h-[300px] mb-8">
          <StatSummary data={appointmentCounts} total={totalAppointments!} />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Appointments scheduled for today, {new Date().toDateString()}
              </CardDescription>
            </div>
            <SearchInput />
          </div>
        </CardHeader>

        <CardContent>
          <div className="p-2 2xl:p-4">
            <Table
              columns={columns}
              renderRow={renderRow}
              data={appointments!}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NursePage;
