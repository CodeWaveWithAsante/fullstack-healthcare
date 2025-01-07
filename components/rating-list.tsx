import { Star } from "lucide-react";
import React from "react";

interface DataProps {
  id: number;
  staff_id: string;
  rating: number;
  comment?: string;
  created_at: Date | string;
  patient: { last_name: string; first_name: string };
}

export const RatingList = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold">Patient Reviews</h1>
      </div>

      <div className="space-y-2 p-2">
        {data?.map((rate, id) => (
          <div key={rate?.id} className="even:bg-gray-50 p-3 rounded">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <p className="text-base font-medium">
                  {rate?.patient?.first_name + " " + rate?.patient?.last_name}
                </p>
                <span className="text-sm text-gray-500">
                  {new Date(rate?.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center text-yellow-600">
                  {Array.from({ length: rate.rating }, (_, index) => (
                    <Star key={index} className="text-lg" />
                  ))}

                  {/* <div className="flex items-center">
                    <Star className="text-lg" />
                    <span>{rate.rating}</span>
                  </div> */}
                </div>
                <span className="">{rate.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}

        {data?.length === 0 && (
          <div className="px-2 text-gray-600">
            <p>No Reviews</p>
          </div>
        )}
      </div>
    </div>
  );
};
