"use client";

import { Heart, MessageSquare, Video } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

const items = [
  {
    title: "Video",
    type: "video",
    icon: Video,
  },
  {
    title: "Text",
    type: "text",
    icon: MessageSquare,
  },
  {
    title: "Wall of Love",
    type: "wall",
    icon: Heart,
  },
];

interface OptionType {
  selectedOption: (option: string) => void;
}

export function AppSidebar({ selectedOption }: OptionType) {
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-950 overflow-hidden text-white">
        <SidebarGroup >
          <SidebarGroupLabel
            className="flex text-md  justify-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            ReviewEasy
          </SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu className="pt-4">
              {items.map((item) => (
                <SidebarMenuItem
                  onClick={() => selectedOption(item.type)}
                  className="px-4 text-3xl cursor-pointer font-bold"
                  key={item.title}
                >
                  <SidebarMenuButton asChild>
                    <div className="flex  hover:bg-zinc-200  items-center space-x-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
