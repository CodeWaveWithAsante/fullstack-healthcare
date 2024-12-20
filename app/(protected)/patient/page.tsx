import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const PatientDashboard = async () => {
  const user = await currentUser();

  const data = null;

  if (user && !data) {
    redirect("/patient/registration");
  }

  return (
    <div>
      PatientDashboard
      <UserButton />
    </div>
  );
};

export default PatientDashboard;
