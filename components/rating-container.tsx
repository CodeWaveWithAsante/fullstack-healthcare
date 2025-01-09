import { getRatingById } from "@/utils/services/doctor";
import React from "react";
import RatingsChart from "./charts/ratings-chart";
import { RatingList } from "./rating-list";
import { Rating } from "@prisma/client";

export const RatingContainer = async ({ id }: { id: string }) => {
  const { ratings, totalRatings, averageRating } = await getRatingById(id);

  return (
    <div className="space-y-4">
      <RatingsChart
        totalRatings={totalRatings!}
        averageRating={Number(averageRating)}
      />

      <RatingList data={ratings} />
    </div>
  );
};
