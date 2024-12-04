import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import RecordVideo from "@/components/RecordVideo";
import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { Spotlight } from "@/components/ui/Spotlight";

type Props = {
  params: Promise<{
    spaceName: string;
  }>;
};

const TestPages = async ({ params }: Props) => {
  const { spaceName } = await params;

  if (!spaceName) {
    console.error("No spaceName provided.");
    return notFound(); // Show 404 if no spaceName is available
  }

  // Fetch data from the API
  const response = await fetch(
    `api/spaces/${spaceName}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch data:", response.status);
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error fetching space data
      </div>
    );
  }

  const data = await response.json();

  // Ensure required fields are present in the response
  if (!data || !data.image || !data.headerName || !data.msg) {
    console.error("Incomplete data received from API:", data);
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Invalid data from server
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex  justify-center items-center">
      <Spotlight className="h-fit" />
      <div className="h-full w-full bg-black bg-grid-white/[0.1] relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="flex flex-col items-center space-y-4  h-3/4 gap-4 rounded w-1/3 p-4">
          <div className="w-36">
            <Image
              src={data.image || "/default-logo.png"}
              width={1000}
              height={1000}
              alt="logo"
              className="rounded"
            />
          </div>
          <div className="text-6xl font-bold text-white">{data.headerName}</div>
          <div className="text-center   text-3xl text-white">{data.msg}</div>
          <div className="flex gap-4 pt-3">
            {data.id && <RecordVideo id={data.id} />}
            <Button className="bg-purple-900 px-12 py-6 w-full flex items-center justify-center">
              <Pencil className="mr-2" />
              Send in text
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPages;
