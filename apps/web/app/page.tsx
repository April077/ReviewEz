"use client";

import MySpace from "@/components/MySpace";
import Popup from "@/components/Popup";
import React, { useEffect, useState } from "react";
import { SpaceType } from "@/zod/spaceSchema";
import axios from "axios";

const Page = () => {
  const [spaces, setSpace] = useState<SpaceType[]>([]);

  async function fetchSpaces() {
    try {
      const res = await axios.get(`api/getSpace`);
      console.log(res.data);
      setSpace(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <div className="min-h-screen  w-full bg-black bg-dot-white/[0.2] relative flex flex-col">
      {/* Expand the background to fit the entire content */}
      <div className="absolute pointer-events-none inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="relative z-10 px-12 py-8 flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-center w-full">
          <div className="font-bold text-4xl text-white">ReviewEz</div>
          <div>
            <Popup onSpaceCreated={fetchSpaces} />
          </div>
        </div>

        {/* MySpace Component */}
        <div className="mt-8 overflow-x-hidden">
          <MySpace spaces={spaces} />
        </div>
      </div>
    </div>
  );
};

export default Page;
