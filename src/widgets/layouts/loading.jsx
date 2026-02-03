import React from "react";
import logo from '../../../public/logo.png'
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-background">
      <img
        src={logo}
        alt="Loading"
        className="w-30 lg:w-50"
      />
      <h1 className="text-emerald-700 font-bold text-3xl">Rent a room </h1>
    </div>
  );
};

export default Loading;
