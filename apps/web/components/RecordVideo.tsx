"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import Modal from "./ui/Modal";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Star, Video } from "lucide-react";
import { supabase } from "@/lib/supabaseclient";
import Confetti from "react-confetti";

const RecordVideo = ({ id }: { id: string }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(120);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const TimeRef = useRef<NodeJS.Timeout | null>(null);
  const [rating, setRating] = useState(5);

  const [confetti, setConfetti] = useState(false);

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        setRecordedVideoURL(url);

        if (TimeRef.current) {
          clearInterval(TimeRef.current);
          TimeRef.current = null;
        }

        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream)
            .getTracks()
            .forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleStartRecording = () => {
    if (mediaRecorderRef.current) {
      recordedChunksRef.current = [];
      setRecordedVideoURL(null);
      mediaRecorderRef.current.start();
      setIsRecording(true);

      setRecordingTime(120);
      TimeRef.current = setInterval(() => {
        setRecordingTime((prev) => prev - 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (recordingTime === 0) {
    handleStopRecording();
  }

  useEffect(() => {
    if (modalOpen) {
      startVideoStream();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [modalOpen]);
  const handleSubmitReview = async () => {
    if (!recordedVideoURL) return;
    setUploading(true);
    try {
      console.log(reviewerEmail);

      const checkResponse = await axios.post(
        `api/checkReviewer`,
        {
          email: reviewerEmail,
          SpaceId: id,
        }
      );

      if (checkResponse.status === 409) {
        toast({
          title: "Review already submitted.",
          description: "You have already submitted a review for this space.",
          className: "bg-red-500 text-white",
        });
        setUploading(false);
        return;
      }

      const blob = await fetch(recordedVideoURL).then((res) => res.blob());
      const filename = `review-videos/${id}-${Date.now()}.webm`;

      const { data, error } = await supabase.storage
        .from("test-bucket")
        .upload(filename, blob, {
          upsert: true,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload video.",
          className: "bg-red-500 text-white",
        });
        setUploading(false);
        return;
      }

      console.log(data);
      const url = supabase.storage.from("test-bucket").getPublicUrl(filename);

      if (!url) {
        console.error("Failed to get public URL from Supabase");
        toast({
          title: "Upload Error",
          description: "Failed to get public URL.",
          className: "bg-red-500 text-white",
        });
        setUploading(false);
        return;
      }
      console.log(url.data.publicUrl);

      const res = await axios.post(
        `api/createReview`,
        {
          rating,
          name: reviewerName,
          email: reviewerEmail,
          videoUrl: url.data.publicUrl,
          SpaceId: id,
        }
      );

      if (res.status === 201) {
        toast({
          title: "Review submitted.",
          description: "Thank you for your time.",
          className: "bg-green-500 border-none",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: "Review already submitted.",
          description: "Thank you for your time.",
          className: "bg-red-500 text-white",
        });
      } else {
        toast({
          title: "Submission Error",
          description: "An error occurred while submitting your review.",
          className: "bg-red-500 text-white",
        });
        console.error("Error submitting review:", error);
      }
    } finally {
      setUploading(false);
      setConfetti(true);
    }
  };

  return (
    <div className="text-black">
      <Button
        onClick={() => {
          setModalOpen(true);
        }}
        className="bg-gray-900 px-10 py-6 w-full flex items-center justify-center"
      >
        <Video className="mr-2" />
        Record a video
      </Button>

      {modalOpen && (
        <Modal
          onClose={() => {
            setModalOpen(false);
            if (isRecording) handleStopRecording();
          }}
        >
          {confetti && (
            <Confetti  className="h-full w-full" width={1000} height={1000} />
          )}
          <div className="flex flex-col space-y-4 justify-center text-center">
            <div className="text-xl font-bold">
              {!recordedVideoURL
                ? "Check Your Camera and Microphone"
                : "Review your video"}
            </div>
            <p className="text-gray-500">
              {!recordedVideoURL
                ? "You have up to 120 seconds to record your video. Don’t worry: You can review your video before submitting it, and you can re-record if needed."
                : "Please fill out all the required fields to proceed."}
            </p>
            <div className="relative">
              {isRecording && (
                <div className="absolute left-2 text-red-400 bg-white rounded-full px-4 top-2 text-lg z-50 font-semibold">
                  {formatTime(recordingTime)}
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isRecording}
                src={recordedVideoURL || undefined}
                className={`border w-full h-full transform ${recordedVideoURL ? "scale-x-[1]" : "scale-x-[-1]"} rounded-lg`}
                controls={!!recordedVideoURL}
              />
            </div>
            {recordedVideoURL && (
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    fill={star <= rating ? "#FFD700" : "none"}
                    stroke="#FFD700"
                    className="cursor-pointer"
                  />
                ))}
              </div>
            )}

            {recordedVideoURL && (
              <div className="grid text-left gap-2">
                <Label>Your Name</Label>
                <Input
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="border-[2px]"
                />
                <Label>Your Email</Label>
                <Input
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  className="border-[2px]"
                />
              </div>
            )}

            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className="bg-gray-900 px-10 py-6 w-full flex items-center justify-center"
            >
              <Video className="mr-2" />
              {isRecording ? "Stop Recording" : "Record My Video"}
            </Button>

            {recordedVideoURL && (
              <Button
                onClick={handleSubmitReview}
                className="bg-purple-600 px-10 py-6 w-full flex items-center justify-center"
              >
                {isUploading ? (
                  <span>
                    <div className="flex space-x-2 justify-center items-center dark:invert">
                      <span className="sr-only">Uploading...</span>
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                  </span>
                ) : (
                  <div>Submit Review</div>
                )}
              </Button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RecordVideo;
