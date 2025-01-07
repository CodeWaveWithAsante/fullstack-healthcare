import { getRatingById } from "@/utils/services/doctor";
import React from "react";
import { RatingList } from "./rating-list";
import { RatingChart } from "./charts/rating-chart";

export const RatingContainer = async ({ id }: { id: string }) => {
  const { ratings, totalRatings, averageRating } = await getRatingById(id);

  return (
    <div className="space-y-4">
      <RatingChart
        totalRatings={totalRatings!}
        averageRating={Number(averageRating!)}
      />
      <RatingList data={ratings!} />
    </div>
  );
};
