import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // if needed for navigation
import {
  FileText,
  Home,
  Car,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

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
} from "@/components/ui/sidebar";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example user context (dummy). In a real app, you'd get the user from an auth context/JWT.
const mockCurrentUser = {
  id: 3,
  username: "testuser",
};

function Review() {
  // ---------------------------
  // 1) Car Detail (Dummy)
  // ---------------------------
  // In a real scenario, you might fetch this from `/api/cars/:id`
  const [car, setCar] = useState({
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2020,
    generation: "XV70",
    engine_size_cc: 2494,
    fuel_type: "Gasoline",
    transmission: "Automatic",
    drivetrain: "FWD",
    body_type: "Sedan",
    num_doors: 4,
    country: "Japan",
    mpg_city: 29,
    mpg_highway: 41,
    horsepower_hp: 203,
    torque_ftlb: 184,
    acceleration: 8.2,
    car_image_path: "https://via.placeholder.com/600x400?text=Toyota+Camry",
  });

  // ---------------------------
  // 2) Reviews (Dummy Data)
  // ---------------------------
  // userLiked / userDisliked track if our user has liked/disliked each review
  const [reviews, setReviews] = useState([
    {
      id: 1,
      grade: 4, // out of 5
      content: "Really smooth ride and great fuel efficiency.",
      car_id: 1,
      user_id: 42,
      created_at: "2025-04-01T10:30:00.000Z",
      num_likes: 2,
      num_dislikes: 0,
      userLiked: false,
      userDisliked: false,
    },
    {
      id: 2,
      grade: 5,
      content: "Love the interior design!",
      car_id: 1,
      user_id: 10,
      created_at: "2025-04-02T14:15:00.000Z",
      num_likes: 5,
      num_dislikes: 1,
      userLiked: true,
      userDisliked: false,
    },
  ]);

  // ---------------------------
  // 3) Pagination for Reviews (20 per page)
  // ---------------------------
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 20;
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);

  // Slicing reviews for the current page
  const startIndex = (reviewPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handleNextReviewPage = () => {
    if (reviewPage < totalReviewPages) {
      setReviewPage(reviewPage + 1);
    }
  };

  const handlePrevReviewPage = () => {
    if (reviewPage > 1) {
      setReviewPage(reviewPage - 1);
    }
  };

  // If we add a new review, put it at the top, reset page to 1
  const addReviewToTop = (newReview: any) => {
    setReviews((prev) => [newReview, ...prev]);
    setReviewPage(1);
  };

  // ---------------------------
  // 4) Add Review (5-Star) Logic
  // ---------------------------
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [starRating, setStarRating] = useState(0); // 1..5
  const [newContent, setNewContent] = useState("");

  const handleStarClick = (star: number) => {
    setStarRating(star);
  };

  const handleAddReview = async () => {
    // Example body for POST /api/reviews
    const bodyData = {
      car_id: car.id,
      grade: starRating, // from star rating
      content: newContent,
    };

    try {
      // If your server expects an Authorization token, retrieve it from local storage or context:
      // const token = localStorage.getItem("accessToken"); // Example
      const token = "<PUT_YOUR_JWT_TOKEN_IF_YOU_HAVE_IT>";

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If your server expects "Authorization: Token <JWT>"
          // or "Authorization: Bearer <JWT>", do something like:
          // "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) {
        throw new Error("Failed to create a new review.");
      }
      const createdReview = await response.json();

      // For demo, let's ensure we have userLiked fields
      const newReview = {
        ...createdReview,
        userLiked: false,
        userDisliked: false,
        created_at: new Date().toISOString(),
      };

      addReviewToTop(newReview);
      // Reset form
      setStarRating(0);
      setNewContent("");
      setShowReviewForm(false);
    } catch (error) {
      console.error(error);
      alert("Error adding review. Check console/logs.");
    }
  };

  // ---------------------------
  // 5) Like/Dislike
  // "Only one like" means the server enforces it; we track userLiked here for UI.
  // ---------------------------
  const handleLikeDislike = async (reviewId: number, action: "like" | "dislike") => {
    try {
      // const token = localStorage.getItem("accessToken"); // Example
      const token = "<PUT_YOUR_JWT_TOKEN_IF_YOU_HAVE_IT>";

      // PUT /api/reviews/:id with { action: "like" } or { action: "dislike" }
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Token ${token}`, // or Bearer
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action} the review.`);
      }
      const updatedReview = await response.json();
g
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id !== reviewId) return r;
          return {
            ...r,
            num_likes: updatedReview.num_likes,
            num_dislikes: updatedReview.num_dislikes,
            userLiked: updatedReview.userLiked,
            userDisliked: updatedReview.userDisliked,
          };
        })
      );
    } catch (error) {
      console.error(error);
      alert(`Error trying to ${action} review #${reviewId}.`);
    }
  };

  // Same sidebar items from Profile.tsx
  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Create A Comparison", url: "/create-comparison", icon: Car },
    { title: "View Comparisons", url: "/comparisons", icon: FileText },
    { title: "Reviews", url: "/reviews", icon: MessageCircle },
  ];

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen">
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
          <div className="flex flex-col items-center px-4 py-8 space-y-8">
            {/* CAR DETAILS */}
            <Card className="max-w-4xl w-full bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl">
                  {car.make} {car.model} ({car.year})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={car.car_image_path}
                  alt={`${car.make} ${car.model}`}
                  className="object-cover rounded-lg w-full h-64 mb-4"
                />
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p>
                      <strong>Generation:</strong> {car.generation}
                    </p>
                    <p>
                      <strong>Engine (cc):</strong> {car.engine_size_cc}
                    </p>
                    <p>
                      <strong>Fuel Type:</strong> {car.fuel_type}
                    </p>
                    <p>
                      <strong>Transmission:</strong> {car.transmission}
                    </p>
                    <p>
                      <strong>Drivetrain:</strong> {car.drivetrain}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Doors:</strong> {car.num_doors}
                    </p>
                    <p>
                      <strong>MPG (City/Highway):</strong>{" "}
                      {car.mpg_city} / {car.mpg_highway}
                    </p>
                    <p>
                      <strong>Horsepower (HP):</strong> {car.horsepower_hp}
                    </p>
                    <p>
                      <strong>Torque (ft-lb):</strong> {car.torque_ftlb}
                    </p>
                    <p>
                      <strong>0-60 Accel (s):</strong> {car.acceleration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ADD REVIEW BUTTON */}
            <div className="max-w-4xl w-full flex justify-end">
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                {showReviewForm ? "Cancel" : "Add a New Review"}
              </Button>
            </div>

            {/* REVIEW FORM (SHOW/HIDE) */}
            {showReviewForm && (
              <Card className="max-w-4xl w-full bg-white shadow-lg p-4">
                <CardHeader>
                  <CardTitle className="text-xl">Submit Your Review</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* 5-Star Rating */}
                  <label className="block mb-2">Rating (1-5)</label>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                      <svg
                        key={star}
                        onClick={() => handleStarClick(star)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={star <= starRating ? "gold" : "lightgray"}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 cursor-pointer transition-colors"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.75.75 0 011.04 0l2.123 2.147c.2.203.49.332.785.358l2.912.26c.79.071 1.109 1.04.513 1.571l-2.191 1.933a.75.75 0 00-.244.7l.636 2.84c.177.788-.667 1.42-1.35.983l-2.41-1.494a.75.75 0 00-.812 0l-2.41 1.494c-.683.437-1.527-.195-1.35-.983l.636-2.84a.75.75 0 00-.244-.7L5.16 7.835c-.596-.53-.277-1.5.513-1.57l2.912-.261c.295-.026.585-.155.785-.358L11.48 3.5z"
                        />
                      </svg>
                    ))}
                  </div>

                  {/* Review Content */}
                  <label className="block mb-2">Review Content</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={3}
                    className="block w-full rounded border border-gray-300 px-3 py-2 mt-1"
                    placeholder="What do you think about this car?"
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleAddReview}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    disabled={starRating === 0 || newContent.trim() === ""}
                  >
                    Submit
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* REVIEWS WITH PAGINATION */}
            <div className="max-w-4xl w-full">
              <h2 className="text-2xl text-white font-bold mb-4">
                Reviews for {car.make} {car.model}
              </h2>

              {currentReviews.length === 0 ? (
                <p className="text-white">No reviews found.</p>
              ) : (
                currentReviews.map((review) => (
                  <Card key={review.id} className="mb-4 bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Rating: {review.grade} / 5
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p>{review.content}</p>
                    </CardContent>

                    {/* DATE + THUMBS in CardFooter */}
                    <CardFooter className="flex justify-between items-center">
                      {/* Bottom-left: Created at */}
                      <span className="text-sm text-gray-500">
                        Created at: {new Date(review.created_at).toLocaleString()}
                      </span>

                      {/* Bottom-right: Like/Dislike */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLikeDislike(review.id, "like")}
                          className="flex items-center gap-1"
                        >
                          <ThumbsUp
                            color={review.userLiked ? "red" : "gray"}
                            fill={review.userLiked ? "red" : "none"}
                            className="w-5 h-5"
                          />
                          <span>{review.num_likes}</span>
                        </button>

                        <button
                          onClick={() => handleLikeDislike(review.id, "dislike")}
                          className="flex items-center gap-1"
                        >
                          <ThumbsDown
                            color={review.userDisliked ? "red" : "gray"}
                            fill={review.userDisliked ? "red" : "none"}
                            className="w-5 h-5"
                          />
                          <span>{review.num_dislikes}</span>
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}

              {/* PAGINATION CONTROLS FOR REVIEWS */}
              {totalReviewPages > 1 && (
                <div className="flex justify-center items-center mt-4">
                  <Button
                    onClick={handlePrevReviewPage}
                    disabled={reviewPage === 1}
                    className="mr-2"
                  >
                    Prev
                  </Button>
                  <span className="text-white">
                    Page {reviewPage} of {totalReviewPages}
                  </span>
                  <Button
                    onClick={handleNextReviewPage}
                    disabled={reviewPage === totalReviewPages}
                    className="ml-2"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Review;
