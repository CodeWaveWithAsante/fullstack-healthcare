import { AvailableDoctors } from "@/components/available-doctors";
import { StatCard } from "@/components/cards/stat-card";
import { AppointmentChart } from "@/components/charts/appointment-chart";
import { StaffStats } from "@/components/charts/staff-stats";
import { StaffChartContainer } from "@/components/charts/stat-chart-container";
import { StatSummary } from "@/components/charts/stat-summary";
import { RecentAppointments } from "@/components/tables/recent-appointment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminDashboardStatistics } from "@/utils/services/admin";
import { BriefcaseBusiness, BriefcaseMedical, User, Users } from "lucide-react";

const AdminPage = async () => {
  const data = await getAdminDashboardStatistics();

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
    totalDoctors,
  } = data;

  const cardData = [
    {
      title: "Patients",
      value: totalPatient,
      icon: Users,
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total patients",
      link: "/manage-patients",
    },
    {
      title: "Doctors",
      value: totalDoctors,
      icon: User,
      className: "bg-rose-600/15",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Total doctors",
      link: "/manage-doctors",
    },
    {
      title: "Appointments",
      value: totalAppointments,
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Total appointments",
      link: "/manage-appointments",
    },
    {
      title: "Consultation",
      value: appointmentCounts?.COMPLETED,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Total consultation",
      link: "/manage-appointments",
    },
  ];

  return (
    <Card>
      <div className="rounded-xl flex flex-col xl:flex-row gap-6">
        {/* LEFT */}
        <div className="w-full xl:w-[69%]">
          <div className="bg-background rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold">Statistics</h1>
              <div className="space-x-2">
                <Button size="sm" variant="outline">
                  {new Date().getFullYear()}
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
          <div className="bg-background rounded-xl p-4 mt-8">
            <RecentAppointments data={last5Records as any} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-[30%] mt-4">
          <div className="w-full h-[300px] mb-8">
            <StatSummary data={appointmentCounts} total={totalAppointments!} />
          </div>

          <StaffChartContainer />

          <AvailableDoctors data={availableDoctors as any} />
        </div>
      </div>
    </Card>
  );
};

export default AdminPage;
