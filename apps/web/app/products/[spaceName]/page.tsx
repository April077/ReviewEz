"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { AppSidebar } from "@/components/Sidebar";
import { useParams } from "next/navigation";
import { Heart, Star } from "lucide-react";

type ReviewData = {
  image: string;
  headerName: string;
  reviews: Review[];
};

type Review = {
  id: string;
  name: string;
  email: string;
  rating: number;
  liked: boolean;
  videoUrl?: string;
  text?: string;
};

const TestPages = () => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [data, setData] = useState<ReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [embedCode, setEmbedCode] = useState<string>("");

  const { spaceName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!spaceName) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST_URL}/api/getReviews/${spaceName}`,
          {
            headers: {
              "Cache-Control": "no-store",
            },
          }
        );

        setData(response.data);
        const initialLikes = response.data.reviews.reduce(
          (acc: Record<string, boolean>, review: Review) => {
            acc[review.id] = review.liked; // Set initial liked state
            return acc;
          },
          {}
        );
        setLikedReviews(initialLikes);

        // Generate embed code
        const embedUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/api/embed/${spaceName}`;
        const embedScript = `
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/iframe-resizer/js/iframeResizer.min.js" ></script>
          <iframe id='embed' src="${embedUrl}" frameborder="0" scrolling="no" width="100%"></iframe>
          <script type="text/javascript">iframeResize({log: false, checkOrigin: false,  license: "GPLv3"}, '#embed');</script>
        `;
        setEmbedCode(embedScript);
      } catch (err) {
        console.error(err);
        setError("Error fetching space data");
      }
    };

    fetchData();
  }, [spaceName]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star className="pr-1" key={i} fill={"#FFD700"} stroke="#FFD700" />
    ));
  };

  const toggleHeart = async (reviewId: string) => {
    const isLiked = likedReviews[reviewId];

    // Optimistically update UI
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: !isLiked,
    }));

    try {
      // Update like status in the DB
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/updateLikeStatus`,
        {
          reviewId,
          liked: !isLiked, // Toggle the like status
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error("Error updating like status:", err);

      // Revert UI change on failure
      setLikedReviews((prev) => ({
        ...prev,
        [reviewId]: isLiked,
      }));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      alert("Embed code copied to clipboard!");
    });
  };

  // Filter reviews based on the selected option
  const filteredReviews =
    selectedOption === "wall"
      ? data.reviews.filter((review) => likedReviews[review.id])
      : data.reviews;

  return (
    <div className="flex w-full bg-black h-full">
      <div className="h-full w-full bg-black bg-grid-white/[0.1] relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <AppSidebar selectedOption={(option) => setSelectedOption(option)} />
        <div className="flex w-full overflow-hidden relative z-50 flex-col gap-4 p-8">
          <div className="flex flex-row pb-8 gap-4">
            <div className="image-wrapper">
              <Image
                src={data.image}
                width={1000}
                height={1000}
                alt="logo"
                className="logo"
              />
            </div>
            <div className="text-5xl font-thin text-white">
              {data.headerName}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className=" w-full p-4 rounded-lg shadow-md"
                >
                  {review.videoUrl && (
                    <video
                      className="rounded-lg w-full"
                      src={review.videoUrl}
                      controls
                      preload="auto"
                    />
                  )}
                  <div className="font-semibold  text-lg">
                    {review.name}
                  </div>
                  <div className="font-thin text-sm">{review.email}</div>
                  <div className="flex pt-1">{renderStars(review.rating)}</div>
                  <div>{review.text}</div>
                  <div>
                    <Heart
                      className={`cursor-pointer pt-1 ${
                        likedReviews[review.id]
                          ? "fill-red-700 text-red-700"
                          : "text-red-700"
                      }`}
                      onClick={() => toggleHeart(review.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center bg-zinc-800 rounded items-center w-full h-[400px] text-white">
                <div className="text-6xl p-4 font-semibold">No Reviews Yet</div>
              </div>
            )}
          </div>
          {selectedOption === "wall" && (
            <div className="mt-8 bg-zinc-800 p-6 rounded-lg shadow-lg">
              <div className="font-semibold text-lg text-white mb-4">
                Embed Code
              </div>
              <textarea
                value={embedCode}
                readOnly
                rows={3}
                className="w-full overflow-auto p-3 bg-black text-gray-300  rounded-lg focus:outline-none "
              />
              <button
                onClick={copyToClipboard}
                className="mt-4 w-full p-2 bg-blue-600 text-wrap hover:bg-blue-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPages;
