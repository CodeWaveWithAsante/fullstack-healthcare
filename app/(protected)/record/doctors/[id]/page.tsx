import { availableDays } from "@/components/available-doctor";
import { PatientRatingContainer } from "@/components/patient-rating-container";
import { ProfileImage } from "@/components/profile-image";
import { RatingContainer } from "@/components/rating-container";
import { RecentAppointments } from "@/components/tables/recent-appointment";
import { getDoctorById } from "@/utils/services/doctor";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";

import { BsCalendarDateFill, BsPersonWorkspace } from "react-icons/bs";
import { FaBriefcaseMedical, FaCalendarDays } from "react-icons/fa6";
import { IoTimeSharp } from "react-icons/io5";
import { MdEmail, MdLocalPhone } from "react-icons/md";

const DoctorProfile = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const { data, totalAppointment } = await getDoctorById(params?.id);

  if (!data) return null;

  return (
    <div className="bg-gray-100/60 h-full rounded-xl py-6 px-3 2xl:px-5 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[70%]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-blue-50 py-6 px-4 rounded-md flex-1 flex gap-4">
            <ProfileImage
              url={data?.img!}
              name={data?.name}
              className="size-20"
              bgColor={data?.colorCode!}
              textClassName="text-4xl text-black"
            />

            <div className="w-2/3 flex flex-col justify-between gap-x-4">
              <div className="flex items-center gap-4">
                <h1 className="text=xl font-semibold uppercase">
                  {data?.name}
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                {data?.address || "No address information"}
              </p>

              <div className="mt-4 flex items-center justify-between gap-2 flex-wrap text-sm font-medium">
                <div className="w-full flex text-base">
                  <span>License #:</span>
                  <p className="font-semibold">{data?.license_number}</p>
                </div>

                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <FaBriefcaseMedical className="text-lg" />
                  <span className="capitalize">{data?.specialization}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <BsPersonWorkspace className="text-lg" />
                  <span className="capitalize">{data?.type}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <MdEmail className="text-lg" />
                  <span className="capitalize">{data?.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <MdLocalPhone className="text-lg" />
                  <span className="capitalize">{data?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SATS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="doctorCard">
              <FaBriefcaseMedical className="size-5" />
              <div>
                <h1 className="text-xl font-serif">{totalAppointment}</h1>
                <span className="text-sm text-gray-500">Appointments</span>
              </div>
            </div>
            <div className="doctorCard">
              <FaCalendarDays className="size-5" />
              <div>
                <h1 className="text-xl font-serif">
                  {data?.working_days?.length}
                </h1>
                <span className="text-sm text-gray-500">Working Days</span>
              </div>
            </div>

            <div className="doctorCard">
              <IoTimeSharp className="size-5" />
              <div>
                <h1 className="text-xl font-serif">
                  {availableDays({ data: data.working_days })}
                </h1>
                <span className="text-sm text-gray-500">Working Hours</span>
              </div>
            </div>
            <div className="doctorCard">
              <BsCalendarDateFill className="size-5" />
              <div>
                <h1 className="text-xl font-serif">
                  {format(data?.created_at, "yyyy-MM-dd")}
                </h1>
                <span className="text-sm text-gray-500">Joined Date</span>
              </div>
            </div>
          </div>
        </div>
        {/* recent appointment */}

        <div className="bg-white rounded-e-xl p-4 mt-6">
          <RecentAppointments data={data?.appointments} />
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="w-full lg:w-[30%] flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Quick Links</h1>

          <div className="mt-8 flex gap-4 flex-wrap text-sm text-gray-500">
            <Link
              href={`/record/appointments?id=${data?.id}`}
              className="p-3 rounded-md bg-yellow-60 hover:underline"
            >
              Doctor Appointments
            </Link>

            <Link
              href="#"
              className="p-3 rounded-md bg-purple-50 hover:underline"
            >
              Apply for Leave
            </Link>
          </div>
        </div>

        <RatingContainer id={params?.id} />
      </div>
    </div>
  );
};

export default DoctorProfile;
