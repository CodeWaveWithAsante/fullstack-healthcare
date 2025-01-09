import { getVitalSignsData } from "@/utils/services/medical-records";
import React from "react";
import { BloodPressureChart } from "./blood-sugar-cgart";
import { HeartRateChart } from "./heart-rate-chart";
import { HeartRateChart2 } from "./heart-ratechart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const BloodChartContainer = async ({ id }: { id: string }) => {
  const { data, average, heartRateData, averageHeartRate } =
    await getVitalSignsData(id);

  return (
    <>
      {/* Blood Pressure chart */}
      <BloodPressureChart data={data} average={average} />

      {/* Heart Rate Card */}
      <Tabs defaultValue="area-chart">
        <TabsList>
          <TabsTrigger value="area-chart">Area Chart</TabsTrigger>
          <TabsTrigger value="line-chart">Line Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="area-chart">
          <HeartRateChart2 data={heartRateData!} average={averageHeartRate} />
        </TabsContent>
        <TabsContent value="line-chart">
          <HeartRateChart data={heartRateData!} average={averageHeartRate} />
        </TabsContent>
      </Tabs>
    </>
  );
};
