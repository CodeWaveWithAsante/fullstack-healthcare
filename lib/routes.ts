type RouteAccessProps = {
  [key: string]: string[];
};

export const routeAccess: RouteAccessProps = {
  "/admin(.*)": ["admin"],
  "/patient/registration": ["patient"],
  "/patient(.*)": ["patient", "admin", "doctor", "nurse", "pharmacy"],
  "/record/doctors(.*)": ["admin", "doctor", "nurse"],
  "/doctor(.*)": ["doctor"],
  "/diagnosis(.*)": ["doctor"],
  "/pharmacy(.*)": ["pharmacy", "admin"],
  "/laboratory(.*)": ["laboratory"],
  "/staff(.*)": ["nurse", "cashier"],
  "/record/users": ["admin"],
  "/record/doctors": ["admin"],
  "/record/staffs": ["admin", "doctor"],
  "/record/patients": ["admin", "doctor", "nurse", "laboratory", "pharmacy"],
  "/record/leaves": ["doctor", "nurse", "laboratory", "pharmacy"],
  // "/pharmacy/drugs": ["admin"],
};
