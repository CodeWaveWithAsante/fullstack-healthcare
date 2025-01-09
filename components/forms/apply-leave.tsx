"use client";

import { requestLeave } from "@/app/actions/leaves";
import { useUser } from "@clerk/nextjs";
import { LeaveType } from "@prisma/client";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

export const ApplyLeave = () => {
  const { user } = useUser();
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (!selectedDates?.from || !selectedDates?.to || !leaveType || !reason) {
        toast.error("Please fill in all fields");
        return;
      }

      setIsLoading(true);
      const formData = {
        type: leaveType.toUpperCase() as LeaveType,
        startDate: new Date(selectedDates?.from),
        endDate: new Date(selectedDates?.to),
        reason,
      };
      const res = await requestLeave(formData);

      if (res.success) {
        toast.success("Leave request submitted successfully");
        router.refresh();
        setSelectedDates(undefined);
        setLeaveType("");
        setReason("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit leave request. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Request Leave</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Leave Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Dates</label>
              <Calendar
                mode="range"
                selected={selectedDates}
                onSelect={setSelectedDates}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Leave Type</label>
              <Select onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SICK">Sick Leave</SelectItem>
                  <SelectItem value="VACATION">Vacation</SelectItem>
                  <SelectItem value="PERSONAL">Personal Leave</SelectItem>
                  <SelectItem value="OTHER">Other Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for leave"
                required
              />
            </div>
            <Button disabled={isLoading} onClick={handleSubmit}>
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
