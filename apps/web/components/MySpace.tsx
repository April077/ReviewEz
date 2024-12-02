"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import Loader from "./ui/loader";
import { SpaceType } from "@/zod/spaceSchema";

const MySpace = ({ spaces }: { spaces: SpaceType[] }) => {
  const router = useRouter();

  const copyLink = async (SpaceName: string) => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/${SpaceName}`
    );
    toast({
      title: "Link copied.",
      description: `${process.env.NEXT_PUBLIC_HOST_URL}/${SpaceName}`,
      className: "bg-black text-white border-none ",
    });
  };

  return (
    <div className=" grid grid-cols-3 gap-4 ">
      {spaces.length > 0 &&
        spaces.map((space, index) => {
          return (
            <div key={index} className="mt-4">
              <div className="max-w-sm  text-white p-6 bg-zinc-900 rounded-lg shadow-md ">
                <div className="flex cursor-pointer items-center justify-between space-x-4">
                  <div
                    onClick={() => [
                      router.push(
                        `${process.env.NEXT_PUBLIC_HOST_URL}/products/${space.spaceName}`
                      ),
                    ]}
                    className="flex items-center space-x-3"
                  >
                    {space.image ? (
                      <Image
                        height={1000}
                        width={1000}
                        alt="image"
                        src={space.image}
                        className="w-full h-auto rounded-full image-wrapper"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-gray-100 flex items-center justify-center rounded-md text-gray-500">
                        No Image Available
                      </div>
                    )}
                    <h2 className="text-xl font-bold ">{space.spaceName}</h2>
                  </div>
                  <div
                    onClick={() => copyLink(space.spaceName)}
                    className="flex justify-center cursor-pointer items-center p-2 bg-black  text-zinc-400 rounded-lg border border-transparent hover:border-gray-600"
                  >
                    <Copy />
                  </div>
                </div>
              </div>
            </div>
          );
        })}{" "}
      {spaces.length === 0 && (
        <div className="pt-8 grid grid-cols-3 w-screen">
          {(() => {
            const loaders = [];
            for (let i = 0; i < 5; i++) {
              loaders.push(<Loader key={i} />);
            }
            return loaders;
          })()}
        </div>
      )}
    </div>
  );
};

export default MySpace;
