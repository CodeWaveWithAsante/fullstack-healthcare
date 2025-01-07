"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { FaQuestion } from "react-icons/fa6";
import { toast } from "sonner";
import { deleteDataById } from "@/app/actions/general";

interface ActionDialogProps {
  type: "doctor" | "staff" | "delete";
  id: string;
  data?: any;
  deleteType: "doctor" | "staff" | "patient";
}
export const ActionDialog = ({
  id,
  data,
  type,
  deleteType,
}: ActionDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (type === "delete") {
    const handleDelete = async () => {
      try {
        setLoading(true);

        const res = await deleteDataById(id, deleteType);

        if (res.success) {
          toast.success("Record deleted successfully");
          router.refresh();
        } else {
          toast.error("Failed to delete record");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="flex items-center justify-center rounded-full text-red-500"
          >
            <Trash2 size={16} className="text-red-500" />
            {deleteType === "patient" && "Delete"}
          </Button>
        </DialogTrigger>

        <DialogContent>
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
                <Button variant={"outline"} className="px-4 py-2">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                disabled={loading}
                variant="outline"
                className="px-4 py-2 text-sm font-medium bg-destructive text-white hover:bg-destructive hover:text-white"
                onClick={handleDelete}
              >
                Yes. Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return null;
};
