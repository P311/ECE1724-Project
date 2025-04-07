import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import Home from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
import Profile from "./routes/profile";
import { Car, ComparisonCartContext } from "./context/ComparisonCartContext";
import Comparison from "./routes/comparison";
import Choose from "./routes/choose";
import { Navigate } from "react-router-dom";
import Review from "./routes/review";

const isAuthenticated = () => {
  const token = localStorage.getItem("jwt");
  const expirationTime = localStorage.getItem("jwt_expiration");
  if (!token || !expirationTime) {
    return false;
  }
  const currentTime = Date.now();
  return currentTime < parseInt(expirationTime);
};

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/profile",
    element: isAuthenticated() ? <Profile /> : <Navigate to="/login" />,
  },
  {
    path: "/choose",
    element: isAuthenticated() ? <Choose /> : <Navigate to="/login" />,
  },

  {
    path: "/review/:carId",
    element: isAuthenticated() ? <Review /> : <Navigate to="/login" />,
  },
  
  {
    path: "/comparison",
    element: isAuthenticated() ? <Comparison /> : <Navigate to="/login" />,
  },

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextWrapper />
  </React.StrictMode>
);

function ContextWrapper() {
  const [comparisonCart, setComparisonCart] = useState<Car[]>([]);

  return (
    <ComparisonCartContext.Provider
      value={{ comparisonCart, setComparisonCart }}
    >
      <RouterProvider router={router} />
    </ComparisonCartContext.Provider>
  );
}
