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

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/profile", element: <Profile /> },
  { path: "/choose", element: <Choose /> },
  { path: "/comparison", element: <Comparison /> },
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
