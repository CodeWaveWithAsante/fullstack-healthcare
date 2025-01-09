"use client";

import Image from "next/image";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { Card } from "../ui/card";

interface RatingPorps {
  totalRatings: number;
  averageRating: number;
}
const RatingsChart = ({ totalRatings, averageRating }: RatingPorps) => {
  const negative = 5 - averageRating;

  const data = [
    { name: "Positive", value: Math.ceil(averageRating), fill: "#93c5fd" },
    { name: "Negative", value: negative, fill: "#FAE27C" },
  ];

  return (
    <Card className="p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ratings</h1>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">{averageRating?.toFixed(1)}</h1>
        <p className="text-xs text-gray-400">of 5 max ratings</p>
      </div>
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
        Rated by {totalRatings} patients
      </h2>
    </Card>
  );
};

export default RatingsChart;
