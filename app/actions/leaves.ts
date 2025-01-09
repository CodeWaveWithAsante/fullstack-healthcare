"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LeaveStatus, LeaveType } from "@prisma/client";

interface LeaveTypes {
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
}
export const requestLeave = async (data: LeaveTypes) => {
  try {
    const { type, reason, startDate, endDate } = data;
    if (!reason || !type || !startDate || !endDate)
      return {
        success: false,
        error: true,
        message: "All fiends are required",
      };

    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const res = await db.leave.create({
      data: {
        ...data,
        userId: userId!,
      },
    });

    return {
      success: true,
      error: false,
      message: "Leave applied successfully.",
    };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, message: error?.message };
  }
};

export const leaveAction = async ({
  id,
  rejectionReason,
  status,
  modifiedStartDate,
  modifiedEndDate,
}: {
  rejectionReason?: string;
  status: LeaveStatus;
  id: number;
  modifiedStartDate?: Date;
  modifiedEndDate?: Date;
}) => {
  try {
    await db.leave.update({
      where: { id: Number(id) },
      data: {
        status,
        rejectionReason,
        modifiedStartDate,
        modifiedEndDate,
      },
    });
    return { success: true, error: false, message: `Leave has been ${status}` };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, msg: error?.message };
  }
};
