import { Loader } from "@/components/loader";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <Loader size={40} />
    </div>
  );
};

export default Loading;
