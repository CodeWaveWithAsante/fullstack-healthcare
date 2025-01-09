import { Card } from "@/components/ui/card";

import { getLabDashboardStats } from "@/utils/services/lab";
import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";
import { RecentTests } from "./recent-test";
import { LabTestChart } from "../charts/lab-test-chart";

// const recentTests = [
//   {
//     id: 1,
//     patientName: "John Doe",
//     testName: "Blood Test",
//     date: "2024-03-20",
//     status: "Completed",
//   },
//   {
//     id: 2,
//     patientName: "Jane Smith",
//     testName: "Urinalysis",
//     date: "2024-03-19",
//     status: "Pending",
//   },
//   {
//     id: 3,
//     patientName: "Mike Johnson",
//     testName: "X-Ray",
//     date: "2024-03-18",
//     status: "Cancelled",
//   },
// ];

export const LabDashboardContainer = async () => {
  const { pending, completed, cancelled, recentRecords, totalTest, groupData } =
    await getLabDashboardStats();

  const stats = [
    {
      title: "Total Tests",
      value: totalTest || "0",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completed || "0",
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: pending || "0",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Cancelled",
      value: cancelled || "0",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat) => (
          <Card
            key={stat?.title}
            className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat?.title}
                </p>
                <h3 className="text-2xl font-bold">{stat?.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="h-[500px]">
        <LabTestChart data={groupData as any} />
      </div>
      <RecentTests data={recentRecords as any} />
    </div>
  );
};
