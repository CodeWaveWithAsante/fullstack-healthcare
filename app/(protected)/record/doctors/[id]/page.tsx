import { availableDays } from "@/components/available-doctors";
import { ProfileImage } from "@/components/profile-image";
import { RatingContainer } from "@/components/rating-container";
import { RecentAppointments } from "@/components/tables/recent-appointment";
import { Card } from "@/components/ui/card";
import { getDoctorById } from "@/utils/services/doctor";
import Link from "next/link";
import { BsCalendarDateFill, BsPersonWorkspace } from "react-icons/bs";
import { FaBriefcaseMedical, FaCalendarDays } from "react-icons/fa6";
import { IoTimeSharp } from "react-icons/io5";
import { MdEmail, MdLocalPhone } from "react-icons/md";

const DoctorDetails = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const { data, totalAppointment } = await getDoctorById(params.id);

  if (!data) return null;

  return (
    <Card className="h-full rounded-xl py-6 px-3 2xl:p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[70%]">
        {/* TOP*/}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* DOCTOR INFO */}
          <Card className="py-6 px-4 rounded-md flex-1 flex gap-4">
            <ProfileImage
              url={data?.img!}
              name={data?.name}
              className="size-24"
              textClassName="text-4xl"
            />

            <div className="w-2/3 flex flex-col justify-between gap-x-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold uppercase">{data.name}</h1>
              </div>
              <p className="text-sm text-gray-500">
                {data?.address || "No address information"}
              </p>
              <div className="mt-4 flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full flex text-base">
                  <span>License #: </span>
                  <p className="font-semibold flex-1">{data?.license_number}</p>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <FaBriefcaseMedical className="text-lg" />
                  <span className="capitalize">{data?.specialization}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <BsPersonWorkspace className="text-lg" />
                  <span>{data.type}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <MdEmail className="text-lg" />
                  <span>{data?.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <MdLocalPhone className="text-lg" />
                  <span className="flex-1">{data?.phone || "-"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* DOCTOR STATS */}
          <Card className="grid grid-cols-2 gap-4 flex-1 p-6">
            <div className="doctorCard">
              <FaBriefcaseMedical className="size-5" />
              <div className="">
                <h1 className="text-xl font-semibold">{totalAppointment}</h1>
                <span className="text-sm text-gray-400">Appointments</span>
              </div>
            </div>
            <div className="doctorCard">
              <FaCalendarDays className="size-5" />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {data?.working_days?.length}
                </h1>
                <span className="text-sm text-gray-400">Working Days</span>
              </div>
            </div>
            <div className="doctorCard">
              <IoTimeSharp className="size-5" />
              <div className="">
                <h1 className="text-lg font-semibold">
                  {availableDays({ data: data?.working_days })}
                </h1>
                <span className="text-sm text-gray-400">Working Hours</span>
              </div>
            </div>
            <div className="doctorCard">
              <BsCalendarDateFill className="size-5" />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {new Intl.DateTimeFormat("en-GB").format(data?.created_at)}
                </h1>
                <span className="text-sm text-gray-400">Date Joined</span>
              </div>
            </div>
          </Card>
        </div>
        {/* RECENT APPOINTMENTS */}
        <div className="bg-background rounded-xl p-4 mt-8">
          <RecentAppointments data={data?.appointments as any} />
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="w-full lg:w-[30%] flex flex-col gap-4">
        <Card className="p-4 rounded-md">
          <h1 className="text-xl font-semibold">Quick Links</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-600/10 text-yellow-600 hover:underline"
              href={`/record/appointments?id=${data.id}`}
            >
              Doctor&apos;s Appointments
            </Link>
            <Link
              className="p-3 rounded-md bg-purple-50 dark:bg-purple-600/10 text-purple-600 hover:underline"
              href={`/record/leaves`}
            >
              Apply for Leave
            </Link>
          </div>
        </Card>
        <RatingContainer id={params?.id} />
      </div>
    </Card>
  );
};

export default DoctorDetails;
