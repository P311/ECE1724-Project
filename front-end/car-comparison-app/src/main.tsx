import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import Home from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
import Profile from "./routes/profile";
import Choose from "./routes/choose";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/profile", element: <Profile /> },
  { path: "/choose", element: <Choose />}
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
