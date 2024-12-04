"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Pencil, Video } from "lucide-react";
import axios from "axios";
import { SpaceSchema } from "@/zod/spaceSchema";
import { ZodError } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Confetti from "react-confetti";

type PopupProps = {
  onSpaceCreated: () => void;
};

const Popup: React.FC<PopupProps> = ({ onSpaceCreated }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [image, setImgSrc] = useState<string | null>(null);
  const [spaceName, setSpaceName] = useState<string>("");
  const [headerName, setHeader] = useState<string>("Header goes here...");
  const [msg, setMsg] = useState<string>("Your custom message goes here...");
  const [confetti, setConfetti] = useState(false);

  const { toast } = useToast();

  // Type the event handler for file input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSpace = async () => {
    setLoading(true);

    try {
      const data = SpaceSchema.parse({
        spaceName,
        headerName,
        image,
        msg,
      });

      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/createSpace`, data);

      if (res.status === 201) {
        toast({
          title: "Space created successfully.",
          className: "bg-green-500",
        });
        setConfetti(true);
        onSpaceCreated();
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        toast({
          variant: "destructive",
          title: "You missed some details.",
          description: "Fill all the required details correctly.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Server Error",
          description: "Something went wrong.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-full   relative z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-purple-900 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-shadow">
            Create New Space
          </Button>
        </DialogTrigger>
        <DialogContent className="dialogContent text-black">
          {confetti && (
            <Confetti className="h-full w-full" width={1000} height={1000} />
          )}
          <div className="border-gray-400 flex border-[1px] space-y-4 h-screen flex-col items-center rounded-lg py-16 px-4 w-1/2">
            <div className="w-36">
              <Image
                src={image || "/logo.png"}
                width={1000}
                height={1000}
                alt="logo"
                className="rounded"
              />
            </div>
            <div className="text-4xl font-bold text-zinc-600">{headerName}</div>
            <div className="text-center text-zinc-600">{msg}</div>
            <Button className="bg-gray-900 my-6 w-full">
              <span>
                <Video className="z-50 -top-36" />
              </span>
              Record a video
            </Button>
            <Button className="bg-purple-900 my-6 w-full">
              <span>
                <Pencil />
              </span>
              Send in text
            </Button>
          </div>
          <div className="p-4 space-y-8">
            <DialogHeader>
              <DialogTitle className="flex justify-center pt-4 font-bold text-3xl">
                Create new Space
              </DialogTitle>
              <DialogDescription className="flex text-center pt-3">
                After the Space is created, it will generate a dedicated page
                for collecting testimonials.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 space-y-4">
              <div className="grid flex-1 gap-3">
                <Label>Space Name</Label>
                <Input onChange={(e) => setSpaceName(e.target.value)} />
                <Label>Space Logo</Label>
                <Input accept="image/*" onChange={handleChange} type="file" />
                <div className="image-wrapper">
                  {image && (
                    <Image
                      src={image}
                      height={60}
                      width={60}
                      className="logo"
                      alt="logo"
                    />
                  )}
                </div>
                <Label>Header Title</Label>
                <Input
                  onChange={(e) => setHeader(e.target.value)}
                  placeholder="Would you like to give a shoutout to xyz?"
                />
                <Label>Your custom message</Label>
                <Textarea
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Write a warm message to your customers, and give them simple directions on how to make the best testimonial."
                />
                <Button onClick={handleCreateSpace} className="bg-zinc-900 ">
                  {isLoading ? (
                    <span>
                      <div className="flex space-x-2 justify-center items-center dark:invert">
                        <span className="sr-only">Loading...</span>
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                      </div>
                    </span>
                  ) : (
                    <div>Create Space</div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Popup;
