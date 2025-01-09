import { AvailableDoctors } from "@/components/available-doctors";
import { StatCard } from "@/components/cards/stat-card";
import { AppointmentChart } from "@/components/charts/appointment-chart";
import { StatSummary } from "@/components/charts/stat-summary";
import { RecentAppointments } from "@/components/tables/recent-appointment";
import { Button } from "@/components/ui/button";
import { getDoctorDashboardStatistics } from "@/utils/services/doctor";
import { currentUser } from "@clerk/nextjs/server";
import { BriefcaseBusiness, BriefcaseMedical, User, Users } from "lucide-react";
import Link from "next/link";

const DoctorDashboard = async () => {
  const user = await currentUser();
  const data = await getDoctorDashboardStatistics();

  if (!data) {
    return null;
  }

  const {
    totalPatient,
    appointmentCounts,
    last5Records,
    totalAppointments,
    availableDoctors,
    monthlyData,
    totalNurses,
  } = data;

  const cardData = [
    {
      title: "Patients",
      value: totalPatient,
      icon: Users,
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total patients",
      link: "/record/patients",
    },
    {
      title: "Nurses",
      value: totalNurses,
      icon: User,
      className: "bg-rose-600/15",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Total nurses",
      link: "",
    },
    {
      title: "Appointments",
      value: totalAppointments,
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Total appointments",
      link: "/record/appointments",
    },
    {
      title: "Consultation",
      value: appointmentCounts?.COMPLETED,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Total consultation",
      link: "/record/appointments",
    },
  ];

  return (
    <div className="rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
      {/* LEFT */}
      <div className="w-full xl:w-[69%]">
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg xl:text-2xl font-semibold">
              Welcome, Dr. {user?.firstName}
            </h1>
            <div className="space-x-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/record/doctors/${user?.id}`}>View Profile</Link>
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

        <div className="h-[500px]">
          <AppointmentChart data={monthlyData!} />
        </div>
        <div className="bg-white rounded-xl p-4 mt-8">
          <RecentAppointments data={last5Records as any} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-[30%]">
        <div className="w-full h-[450px] mb-8">
          <StatSummary data={appointmentCounts} total={totalAppointments!} />
        </div>

        <AvailableDoctors data={availableDoctors as any} />
      </div>
    </div>
  );
};

export default DoctorDashboard;
