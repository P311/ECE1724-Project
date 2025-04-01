import React from "react";
import { Button } from "@/components/ui/button";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-r from-cyan-500 to-blue-500">
      <span className="text-7xl font-bold mb-10 text-white/85">
        Find Your Perfect Car Match
      </span>
      <span className="text-2xl text-white/85 mb-20 w-230 text-center">
        Compare specs, prices, and reviews from multiple sources to make the
        best informed decision for your next vehicle purchase.
      </span>
      <div className="flex flex-row gap-80">
        <Button
          className="bg-cyan-300 w-40 h-12 text-sky-800 font-bold text-lg hover:bg-cyan-500 hover:text-white"
          onClick={() => (location.href = "/register")}
        >
          Register
        </Button>
        <Button
          className="bg-cyan-300 w-40 h-12 text-sky-800 font-bold text-lg hover:bg-cyan-500 hover:text-white"
          onClick={() => (location.href = "/login")}
        >
          Login
        </Button>
      </div>
    </div>
  );
}

export default Home;
