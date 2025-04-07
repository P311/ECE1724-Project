import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadImageFromBucket } from "@/utils";
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

// This is just a placeholder for demonstration.
// In a real app, you'd get the user from auth context or decode the token on the server.
const mockCurrentUser = {
  id: 3,
  username: "testuser",
};

function Review() {
  const { carId } = useParams();
  const numericCarId = parseInt(carId || "0", 10);

  // ---------------------------
  // 1) Car Details (GET /api/cars/:id)
  // ---------------------------
  const [car, setCar] = useState<any | null>(null);
  const [loadingCar, setLoadingCar] = useState(true);

  const fetchCar = async () => {
    try {
      setLoadingCar(true);
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const res = await fetch(`/api/cars/${numericCarId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch car details");
      }
      const data = await res.json();

      const imageUrl = await loadImageFromBucket(data.car_image_path);

      // Then store the full image URL in `car` state
      setCar({
        ...data,
        car_image_path: imageUrl,
      });
    } catch (error) {
      console.error("Error fetching car details:", error);
      setCar(null);
    } finally {
      setLoadingCar(false);
    }
  };

  useEffect(() => {
    if (numericCarId) {
      fetchCar();
    }
  }, [numericCarId]);

  // ---------------------------
  // 2) Reviews (GET /api/reviews/by-car?car_id=<carId>&page=<page>)
  //    Each page has up to 10 reviews. The server's page starts at 1 by default.
  // ---------------------------
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewPage, setReviewPage] = useState(1); // The UI also starts at 1
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const fetchReviews = async (page: number) => {
    try {
      setLoadingReviews(true);
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const res = await fetch(
        `/api/reviews/by-car?car_id=${numericCarId}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await res.json();
      setReviews(data);

      // If exactly 10 returned, we assume there's a next page
      setHasNextPage(data.length === 10);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (numericCarId) {
      fetchReviews(reviewPage);
    }
  }, [reviewPage, numericCarId]);

  // Example: re-fetch page=1 after adding a new review
  const refetchFirstPage = () => {
    setReviewPage(1);
    fetchReviews(1);
  };

  // ---------------------------
  // 3) Add a New Review (POST /api/reviews)
  // ---------------------------
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [starRating, setStarRating] = useState(0); // 1..5
  const [newContent, setNewContent] = useState("");

  const handleStarClick = (star: number) => {
    setStarRating(star);
  };

  const handleAddReview = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No token found. Please log in.");

      const bodyData = {
        car_id: numericCarId,
        grade: starRating,
        content: newContent,
      };

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to create a new review.");
      }
      // The server returns { "message": "Review created successfully", "id": number }
      await response.json();

      // Re-fetch page=1 so we see the new review
      refetchFirstPage();

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
  // 4) Like/Dislike - Only front-end enforces "one click"
  //    after user clicks like => disable that like button
  //    after user clicks dislike => disable that dislike button
  //    do not affect the other button
  // ---------------------------
  // We'll track "has user clicked like" or "has user clicked dislike" in local maps
  const [likeClickedMap, setLikeClickedMap] = useState<{ [reviewId: number]: boolean }>({});
  const [dislikeClickedMap, setDislikeClickedMap] = useState<{ [reviewId: number]: boolean }>({});

  const handleLikeDislike = async (reviewId: number, action: "like" | "dislike") => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No token found. Please log in.");

      // We'll do a PUT /api/reviews/:id with {action: 'like' or 'dislike'}
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        throw new Error(`Failed to ${action} the review.`);
      }
      // The server returns the updated review
      const updatedReview = await res.json();

      // Merge new counts (num_likes, dislikes) into local reviews
      setReviews(prev => prev.map(r => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          num_likes: updatedReview.num_likes,
          dislikes: updatedReview.dislikes,
        };
      }));

      // Now we disable the button that was clicked. 
      // If user clicked "like", only the like button becomes disabled (and color changes). 
      // The other is unaffected.
      if (action === "like") {
        setLikeClickedMap(prev => ({ ...prev, [reviewId]: true }));
      } else {
        setDislikeClickedMap(prev => ({ ...prev, [reviewId]: true }));
      }
    } catch (error) {
      console.error(error);
      alert(`Error trying to ${action} review #${reviewId}.`);
    }
  };

  // ---------------------------
  // 5) Pagination
  // ---------------------------
  const handleNextReviewPage = () => {
    if (hasNextPage) {
      setReviewPage(prev => prev + 1);
    }
  };

  const handlePrevReviewPage = () => {
    if (reviewPage > 1) {
      setReviewPage(prev => prev - 1);
    }
  };

  // ---------------
  // Sidebar items
  // ---------------
  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Create A Comparison", url: "/create-comparison", icon: Car },
    { title: "View Comparisons", url: "/comparisonsList", icon: FileText },
  ];

  // Car loading states
  if (loadingCar) {
    return (
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen flex items-center justify-center">
        <p className="text-white">Loading car details...</p>
      </div>
    );
  }
  if (!car) {
    return (
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen flex items-center justify-center">
        <p className="text-white">Car not found or error fetching details.</p>
      </div>
    );
  }

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
                {car.car_image_path && (
                  <img
                    src={car.car_image_path}
                    alt={`${car.make} ${car.model}`}
                    className="object-cover rounded-lg w-full h-64 mb-4"
                  />
                )}
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p>
                      <strong>Generation:</strong> {car.generation ?? "-"}
                    </p>
                    <p>
                      <strong>Engine (cc):</strong>{" "}
                      {car.engine_size_cc ?? "-"}
                    </p>
                    <p>
                      <strong>Fuel Type:</strong> {car.fuel_type ?? "-"}
                    </p>
                    <p>
                      <strong>Transmission:</strong> {car.transmission ?? "-"}
                    </p>
                    <p>
                      <strong>Drivetrain:</strong> {car.drivetrain ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Doors:</strong> {car.num_doors ?? "-"}
                    </p>
                    <p>
                      <strong>MPG (City/Highway):</strong>{" "}
                      {car.mpg_city ?? "-"} / {car.mpg_highway ?? "-"}
                    </p>
                    <p>
                      <strong>Horsepower (HP):</strong>{" "}
                      {car.horsepower_hp ?? "-"}
                    </p>
                    <p>
                      <strong>Torque (ft-lb):</strong>{" "}
                      {car.torque_ftlb ?? "-"}
                    </p>
                    <p>
                      <strong>0-60 Accel (s):</strong> {car.acceleration ?? "-"}
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

            {/* REVIEWS */}
            <div className="max-w-4xl w-full">
              <h2 className="text-2xl text-white font-bold mb-4">
                Reviews for {car.make} {car.model}
              </h2>

              {loadingReviews ? (
                <p className="text-white">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-white">No reviews found.</p>
              ) : (
                reviews.map((review) => {
                  // We track whether user has clicked like or dislike 
                  // for each review in local maps:
                  const likeClicked = !!(likeClickedMap[review.id]);
                  const dislikeClicked = !!(dislikeClickedMap[review.id]);

                  // The like button is disabled once user clicks it
                  // The color changes to red if user clicked like
                  // The dislike button is unaffected, etc.
                  // We'll do the "like" button color red, 
                  // and "dislike" button color blue, per your request.
                  const likeButtonColor = likeClicked ? "red" : "gray";
                  const likeButtonFill = likeClicked ? "red" : "none";

                  const dislikeButtonColor = dislikeClicked ? "blue" : "gray";
                  const dislikeButtonFill = dislikeClicked ? "blue" : "none";

                  return (
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
                          Created at:{" "}
                          {new Date(review.created_at).toLocaleString()}
                        </span>

                        {/* Bottom-right: Like/Dislike */}
                        <div className="flex items-center gap-2">
                          {/* LIKE button */}
                          <button
                            onClick={() => handleLikeDislike(review.id, "like")}
                            disabled={likeClicked} // once clicked, we disable
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp
                              color={likeButtonColor}
                              fill={likeButtonFill}
                              className="w-5 h-5"
                            />
                            <span>{review.num_likes}</span>
                          </button>

                          {/* DISLIKE button */}
                          <button
                            onClick={() =>
                              handleLikeDislike(review.id, "dislike")
                            }
                            disabled={dislikeClicked}
                            className="flex items-center gap-1"
                          >
                            <ThumbsDown
                              color={dislikeButtonColor}
                              fill={dislikeButtonFill}
                              className="w-5 h-5"
                            />
                            <span>{review.dislikes}</span>
                          </button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })
              )}

              {/* PAGINATION CONTROLS */}
              <div className="flex justify-center items-center mt-4 gap-4">
                <Button
                  onClick={handlePrevReviewPage}
                  disabled={reviewPage === 1}
                >
                  Prev
                </Button>
                <span className="text-white">Page {reviewPage}</span>
                <Button onClick={handleNextReviewPage} disabled={!hasNextPage}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Review;
