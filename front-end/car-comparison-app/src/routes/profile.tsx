import React from "react";
import { FileText, Home, Car, Settings, MessageCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    numberOfLikes: 0,
  });

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Create A Comparison",
      url: "/create-comparison",
      icon: Car,
    },
    {
      title: "View Comparisons",
      url: "/comparisons",
      icon: FileText,
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: MessageCircle,
    },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUser({
            username: data.username,
            email: data.email,
            numberOfLikes: data.numberOfLikes,
          });
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xl mb-5">
                Application
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title} className="mb-3">
                      <SidebarMenuButton asChild className="text-lg">
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="w-full">
          <div className="flex flex-col items-center justify-center h-full">
            <Card className="w-7xl bg-white shadow-lg rounded-lg p-12 h-3/4">
              <CardHeader>
                <CardTitle className="text-4xl">{user.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl">User Email: {user.email}</p>
                <p className="text-xl pt-4">
                  Number of Likes: {user.numberOfLikes}
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Profile;
