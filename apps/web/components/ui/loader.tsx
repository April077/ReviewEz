import React from "react";

const Loader = () => {
  return (
    <div>
      <div className="relative flex w-64 animate-pulse gap-2 p-4">
        <div className="h-12 w-12 rounded-full bg-zinc-800"></div>
        <div className="flex-1">
          <div className="mb-1 h-5 w-3/5 rounded-lg bg-zinc-800 text-lg"></div>
          <div className="h-5 w-[90%] rounded-lg bg-zinc-800 text-sm"></div>
        </div>
        <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-zinc-800"></div>
      </div>
    </div>
  );
};

export default Loader;
