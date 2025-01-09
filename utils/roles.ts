import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";
import { USER_ROLES } from ".";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();

  const user_role = (
    sessionClaims?.metadata.role || USER_ROLES.PATIENT
  ).toUpperCase();

  return user_role === role;
};

export const getRole = async () => {
  const { sessionClaims } = await auth();

  const userRole = sessionClaims?.metadata.role;

  const role = (
    sessionClaims?.metadata.role || USER_ROLES.PATIENT
  ).toLowerCase();

  return role;
};
