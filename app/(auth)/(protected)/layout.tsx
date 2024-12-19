import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default ProtectedLayout;
