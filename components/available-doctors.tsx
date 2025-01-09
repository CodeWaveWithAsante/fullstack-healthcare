import { daysOfWeek } from "@/utils";
import { checkRole } from "@/utils/roles";
import { Doctor, WorkingDays } from "@prisma/client";
import Link from "next/link";
import { ProfileImage } from "./profile-image";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export interface AvailableDoctorsProps extends Doctor {
  working_days: WorkingDays[];
}
const getToday = () => {
  const today = new Date().getDay();
  return daysOfWeek[today];
};

const todayDay = getToday();

export const availableDays = ({ data }: { data: WorkingDays[] }) => {
  const todayWorkingDay = data?.find(
    (dayObj) => dayObj?.day?.toLowerCase() === todayDay
  );

  return todayWorkingDay
    ? `${todayWorkingDay?.start_time} - ${todayWorkingDay?.close_time}`
    : "Not Available";
};

export const AvailableDoctors = async ({
  data,
}: {
  data: AvailableDoctorsProps[];
}) => {
  return (
    <Card className="rounded-xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Available Doctors</h1>
        {(await checkRole("ADMIN")) && (
          <Button
            asChild
            variant="outline"
            className="disabled:cursor-not-allowed disabled:text-gray-200"
            disabled={data?.length === 0}
          >
            <Link href="/record/doctors">View all</Link>
          </Button>
        )}
      </div>
      <div className="w-full space-y-6 md:space-y-0 md:gap-6 flex flex-col md:flex-row md:flex-wrap">
        {data?.map((doc, id) => (
          <Card
            key={id}
            className=" border-none w-full md:w-[300px] min-h-28 xl:w-full p-4 flex  gap-4 odd:bg-emerald-600/5 even:bg-yellow-600/5"
          >
            <ProfileImage
              url={doc?.img!}
              name={doc?.name}
              className="md:flex min-w-14 min-h-14 md:min-w-16 md:min-h-16"
              textClassName="text-2xl font-semibold text-black"
              bgColor={doc?.colorCode!}
            />
            <div>
              <h2 className="font-medium text-lg md:text-xl">{doc?.name}</h2>
              <p className="text-base capitalize text-gray-600">
                {doc?.specialization}
              </p>
              <p className="text-sm flex items-center">
                <span className="hidden lg:flex">Available Time:</span>{" "}
                {availableDays({ data: doc?.working_days })}
              </p>
            </div>
          </Card>
        ))}

        {data?.length < 1 && (
          <div>
            <p className="text-sm md:text-base text-gray-400 mb-10">
              No doctor found
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
