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
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    numberOfLikes: 0,
  });
  const [reviews, setReviews] = useState<Review[]>([]);

  interface Review {
    id: number;
    grade: number;
    content: string;
    car_id: number;
    user_id: number;
    created_at: string;
    num_likes: number;
    dislikes: number;
  }

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Create A Comparison",
      url: "/choose",
      icon: Car,
    },
    {
      title: "View Comparisons",
      url: "/comparisonsList",
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
        const token = localStorage.getItem("jwt");
        console.log(token);
        const response = await fetch("/api/users", {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            username: data.username,
            email: data.email,
            numberOfLikes: data.num_likes,
          });
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();

    // load review from /api/reviews/by-user
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch("/api/reviews/by-user", {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
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
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
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
                <p className="text-xl pt-4">
                  My Reviews:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-2">
                  {reviews.map((review) => (
                  <li key={review.id} className="text-lg">
                    <p>{review.content}</p>
                    <p className="text-sm text-gray-600">
                    Likes: {review.num_likes}, Dislikes: {review.dislikes}
                    </p>
                  </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Profile;
