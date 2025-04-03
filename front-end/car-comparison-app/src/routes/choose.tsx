import React, { useState } from "react";
// If you have a custom Button component, adjust this import accordingly
// e.g., import { Button } from "../components/ui/button";
// For now, we'll just use a simple HTML button as an example:
import { Button } from "@/components/ui/button"; // Adjust path if needed

function Choose() {
  // State for each filter
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCarType, setSelectedCarType] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");

  // Example options
  const countries: string[] = ["Japan", "Germany", "USA", "Korea", "Others"];
  const carTypes: string[] = ["Sedan", "SUV", "MPV", "EV"];
  const priceRanges: string[] = ["<20k", "20k-40k", "40k-60k", ">60k"];

  const handleCountryFilter = (country: string) => {
    setSelectedCountry(country);
    console.log("Selected Country:", country);
  };

  const handleCarTypeFilter = (type: string) => {
    setSelectedCarType(type);
    console.log("Selected Car Type:", type);
  };

  const handlePriceRangeFilter = (range: string) => {
    setSelectedPriceRange(range);
    console.log("Selected Price Range:", range);
  };

  const handleReset = () => {
    setSelectedCountry("");
    setSelectedCarType("");
    setSelectedPriceRange("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Choose Your Car</h1>
      <p className="text-white/90 mb-6">
        Filter by Country, Type, or Price Range to find your perfect match!
      </p>

      <div className="flex flex-col items-center gap-8 mb-8 w-full max-w-2xl">
        {/* Country Filter */}
        <div className="w-full">
          <h2 className="text-xl text-white mb-2">Filter by Country:</h2>
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <Button
                key={country}
                onClick={() => handleCountryFilter(country)}
                className={`bg-cyan-300 px-4 py-2 font-bold hover:bg-cyan-500 ${
                  selectedCountry === country ? "border-2 border-white" : ""
                }`}
              >
                {country}
              </Button>
            ))}
          </div>
        </div>

        {/* Car Type Filter */}
        <div className="w-full">
          <h2 className="text-xl text-white mb-2">Filter by Car Type:</h2>
          <div className="flex flex-wrap gap-2">
            {carTypes.map((type) => (
              <Button
                key={type}
                onClick={() => handleCarTypeFilter(type)}
                className={`bg-cyan-300 px-4 py-2 font-bold hover:bg-cyan-500 ${
                  selectedCarType === type ? "border-2 border-white" : ""
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="w-full">
          <h2 className="text-xl text-white mb-2">Filter by Price Range:</h2>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <Button
                key={range}
                onClick={() => handlePriceRangeFilter(range)}
                className={`bg-cyan-300 px-4 py-2 font-bold hover:bg-cyan-500 ${
                  selectedPriceRange === range ? "border-2 border-white" : ""
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Display the selected filters (optional) */}
      <div className="flex flex-col items-center mb-6 text-white">
        <p className="font-semibold">
          Country: <span className="font-normal">{selectedCountry || "-"}</span>
        </p>
        <p className="font-semibold">
          Car Type: <span className="font-normal">{selectedCarType || "-"}</span>
        </p>
        <p className="font-semibold">
          Price Range:{" "}
          <span className="font-normal">{selectedPriceRange || "-"}</span>
        </p>
      </div>

      {/* Reset Filters */}
      <Button
        onClick={handleReset}
        className="bg-red-600 text-white font-bold px-4 py-2 hover:bg-red-800"
      >
        Reset All Filters
      </Button>
    </div>
  );
}

export default Choose;
