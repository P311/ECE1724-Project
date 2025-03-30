import React, { useState } from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
    fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Registration successful");
          window.location.href = "/login";
        } else {
          return response.json().then((data) => {
            alert("An error occurred: " + data.errors);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      <span className="text-4xl font-bold mb-10 text-white">Sign Up</span>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  pattern="^[a-zA-Z0-9._-]{3,15}$"
                  placeholder="Username"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  non-empty string, 3-15 characters length, allows a-z, A-Z,
                  0-9, ".", "-" and "_".
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  placeholder="Email"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>must be a valid email format</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$"
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  8-20 characters length, includes 1+ uppercase, 1+ lowercase,
                  1+ number. All symbols are allowed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
