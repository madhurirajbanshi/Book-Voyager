import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-2 text-blue-700 font-semibold">Loading books...</p>
    </div>
  );
};

export default Loader;
