"use client";

import { deleteDataById } from "@/app/actions/general-actions";
import { DeleteType } from "@/types";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaQuestion } from "react-icons/fa6";
import { toast } from "sonner";
import { SmallCard } from "../cards/small-card";
import { ProfileImage } from "../profile-image";
import { Table } from "../tables/table";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface BaseActionDialogProps {
  data?: any;
  id?: string;
  showText?: boolean;
}

type ActionDialogProps =
  | (BaseActionDialogProps & { type: "doctor" | "staff"; deleteType?: never })
  | (BaseActionDialogProps & { type: "delete"; deleteType: DeleteType });

const columns = [
  {
    header: "No.",
    key: "info",
  },
  {
    header: "Day",
    key: "Day",
    className: "",
  },
  {
    header: "Time",
    key: "time",
    className: "",
  },
];

const ActionDialog = ({
  type,
  data,
  id,
  deleteType,
  showText = false,
}: ActionDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (type === "doctor") {
    const renderRow = (item: {
      id: number;
      index: number;
      day: string;
      start_time: string;
      close_time: string;
    }) => (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="py-4">#{item?.index + 1}</td>
        <td className="uppercase">{item?.day}</td>
        <td className="font-semibold">
          {item?.start_time} - {item?.close_time}
        </td>
      </tr>
    );

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-center rounded-full bg-blue-600/10 hover:underline text-blue-600 px-1.5 py-1 text-xs md:text-sm"
          >
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[425px] md:max-w-2xl xl:max-w-4xl max-h-[90%] p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6">Doctor Information</h1>

          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <ProfileImage
                url={data?.img!}
                name={data?.name}
                className="xl:size-20"
                textClassName="xl:text-2xl"
              />
              <div className="flex flex-col">
                <p className="text-xl font-semibold">{data?.name}</p>
                <span className="text-gray-600 text-sm md:text-base capitalize">
                  {data?.specialization}
                </span>
                <span className="capitalize text-blue-500 text-sm">
                  {data?.type?.toLowerCase()}-Time
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-3xl">10</p>
              <span>Appointments</span>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Full Name" value={data?.name} />
              <SmallCard label="Email Address" value={data?.email} />
              <SmallCard label="Phone number" value={data?.phone} />
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Address" value={data?.address} />
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard
                label="Specialization"
                value={data?.specialization}
                className="capitalize"
              />
              <SmallCard label="Department" value={data?.department} />
              <SmallCard label="License Number" value={data?.license_number} />
            </div>
          </div>

          <div className="mt-10">
            <p className="text-base font-semibold">Work Schedule</p>
            <Table
              columns={columns}
              renderRow={renderRow}
              data={data?.working_days}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (type === "staff") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-center rounded-full bg-blue-600/10 hover:underline text-blue-600 px-1.5 py-1 text-xs md:text-sm"
          >
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[300px] md:max-w-2xl max-h-[90%] p-8 overflow-y-auto">
          <DialogTitle className="text-lg text-gray-500 font-semibold mb-6">
            Staff Information
          </DialogTitle>

          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <ProfileImage
                url={data?.img!}
                name={data?.name}
                className="xl:size-20"
                textClassName="xl:text-2xl"
              />
              <div className="flex flex-col">
                <p className="text-xl font-semibold">{data?.name}</p>
                <span className="text-gray-600 text-sm md:text-base capitalize">
                  {data?.role.toLowerCase()}
                </span>
                <span className="capitalize text-blue-500 text-sm">
                  Full-Time
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Full Name" value={data?.name} />
              <SmallCard label="Email Address" value={data?.email} />
              <SmallCard label="Phone number" value={data?.phone} />
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Address" value={data?.address} />
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard
                label="Role"
                value={data?.role}
                className="capitalize"
              />
              <SmallCard label="Department" value={data?.department} />
              <SmallCard label="License Number" value={data?.license_number} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (type === "delete") {
    const handleDelete = async () => {
      try {
        setLoading(true);
        const res = await deleteDataById(id!, deleteType!);

        if (res.success === true) {
          toast.success("Record deleted successfully");
          router.refresh();
        } else {
          toast.error(
            res?.message || "Failed to delete record. Try again later."
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong. Try again");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="size-4  text-red-500">
            <Trash2 size={16} className="text-sm text-red-500" />

            {showText && "Delete"}
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <div className="flex flex-col items-center justify-center py-6">
            <DialogTitle>
              <div className="bg-red-200 p-4 rounded-full mb-2">
                <FaQuestion size={50} className="text-red-500" />
              </div>
            </DialogTitle>
            <span className="text-xl text-black">Delete Confirmation</span>
            <p className="text-sm">
              Are you sure you want to delete the selected record?
            </p>

            <div className="flex justify-center mt-6 items-center gap-x-3">
              <DialogClose asChild>
                <Button variant="outline" className="px-4 py-2">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={loading}
                onClick={() => handleDelete()}
                variant="outline"
                className="px-4 py-2 text-sm font-medium bg-destructive text-white hover:bg-destructive hover:text-white hover:underline"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return null;
};

export default ActionDialog;
