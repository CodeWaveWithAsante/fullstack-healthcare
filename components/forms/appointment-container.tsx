import { getDoctors } from "@/utils/services/doctor";
import { getPatientDataById } from "@/utils/services/patient";
import React from "react";
import { AddAppointment } from "./add-appointment";

export const AppointmentContainer = async ({ id }: { id: string }) => {
  const { data } = await getPatientDataById(id);

  const { data: doctors } = await getDoctors();

  return (
    <>
      <AddAppointment data={data!} doctors={doctors!} />
    </>
  );
};
