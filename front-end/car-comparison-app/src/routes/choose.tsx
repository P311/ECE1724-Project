import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // or your preferred navigation
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { ComparisonCartContext, Car } from "../context/ComparisonCartContext";

function Choose() {
  const navigate = useNavigate();

  // FILTER STATES
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCarType, setSelectedCarType] = useState<string>("");
  const [inputModel, setInputModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // COMPARISON CART (max 4 cars)
  const context = useContext(ComparisonCartContext);
  if (!context) {
    throw new Error("This page must be used within a ComparisonCartProvider");
  }

  const { comparisonCart, setComparisonCart } = context;

  // MODALS
  const [selectedCar, setSelectedCar] = useState<Car | null>(null); // For car-detail modal
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false); // For comparison modal

  // Dropdown options
  const brands: string[] = [
    "Toyota",
    "Honda",
    "Ford",
    "BMW",
    "Tesla",
    "Hyundai",
  ];
  const countries: string[] = ["Japan", "Germany", "USA", "Korea", "China"];
  const carTypes: string[] = ["Sedan", "SUV", "MPV", "EV", "Truck"];

  // EXTENDED DUMMY DATA covering Sedans, SUVs, MPVs, EVs, Trucks
  // This data includes more fields (engine_size_cc, horsepower_hp, etc.) for the detail view
  const dummyCarData: Car[] = [
    {
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
    },
    {
      id: 2,
      make: "Honda",
      model: "CR-V",
      year: 2021,
      generation: "5th Gen",
      engine_size_cc: 1498,
      fuel_type: "Gasoline",
      transmission: "CVT",
      drivetrain: "AWD",
      body_type: "SUV",
      num_doors: 5,
      country: "Japan",
      mpg_city: 28,
      mpg_highway: 34,
      horsepower_hp: 190,
      torque_ftlb: 179,
      acceleration: 8.5,
      car_image_path: "https://via.placeholder.com/600x400?text=Honda+CR-V",
    },
    {
      id: 3,
      make: "Ford",
      model: "F-150",
      year: 2021,
      generation: "14th Gen",
      engine_size_cc: 2996,
      fuel_type: "Gasoline",
      transmission: "Automatic",
      drivetrain: "4WD",
      body_type: "Truck",
      num_doors: 4,
      country: "USA",
      mpg_city: 20,
      mpg_highway: 26,
      horsepower_hp: 290,
      torque_ftlb: 265,
      acceleration: 6.9,
      car_image_path: "https://via.placeholder.com/600x400?text=Ford+F150",
    },
    {
      id: 4,
      make: "BMW",
      model: "3 Series",
      year: 2020,
      generation: "G20",
      engine_size_cc: 1998,
      fuel_type: "Gasoline",
      transmission: "Automatic",
      drivetrain: "RWD",
      body_type: "Sedan",
      num_doors: 4,
      country: "Germany",
      mpg_city: 26,
      mpg_highway: 36,
      horsepower_hp: 255,
      torque_ftlb: 295,
      acceleration: 5.6,
      car_image_path: "https://via.placeholder.com/600x400?text=BMW+3+Series",
    },
    {
      id: 5,
      make: "Toyota",
      model: "Sienna",
      year: 2022,
      generation: "4th Gen",
      engine_size_cc: 2500,
      fuel_type: "Hybrid",
      transmission: "Automatic",
      drivetrain: "FWD",
      body_type: "MPV",
      num_doors: 5,
      country: "Japan",
      mpg_city: 36,
      mpg_highway: 36,
      horsepower_hp: 245,
      torque_ftlb: 176,
      acceleration: 8.7,
      car_image_path: "https://via.placeholder.com/600x400?text=Toyota+Sienna",
    },
    {
      id: 6,
      make: "Tesla",
      model: "Model S",
      year: 2022,
      generation: "Plaid",
      engine_size_cc: 0,
      fuel_type: "Electric",
      transmission: "Single Speed",
      drivetrain: "AWD",
      body_type: "EV",
      num_doors: 4,
      country: "USA",
      mpg_city: 0,
      mpg_highway: 0,
      horsepower_hp: 1020,
      torque_ftlb: 1050,
      acceleration: 1.99,
      car_image_path: "https://via.placeholder.com/600x400?text=Tesla+Model+S",
    },
    {
      id: 7,
      make: "Hyundai",
      model: "Staria",
      year: 2022,
      generation: "1st Gen",
      engine_size_cc: 2200,
      fuel_type: "Diesel",
      transmission: "Automatic",
      drivetrain: "FWD",
      body_type: "MPV",
      num_doors: 5,
      country: "Korea",
      mpg_city: 25,
      mpg_highway: 30,
      horsepower_hp: 177,
      torque_ftlb: 317,
      acceleration: 12.0,
      car_image_path: "https://via.placeholder.com/600x400?text=Hyundai+Staria",
    },
    {
      id: 8,
      make: "Kia",
      model: "Sportage",
      year: 2021,
      generation: "4th Gen",
      engine_size_cc: 2000,
      fuel_type: "Gasoline",
      transmission: "Automatic",
      drivetrain: "FWD",
      body_type: "SUV",
      num_doors: 5,
      country: "Korea",
      mpg_city: 23,
      mpg_highway: 30,
      horsepower_hp: 181,
      torque_ftlb: 175,
      acceleration: 9.0,
      car_image_path: "https://via.placeholder.com/600x400?text=Kia+Sportage",
    },
  ];

  /********************************
   * FILTER / FIND HANDLERS
   *******************************/
  const handleFindCars = () => {
    const queryParts: string[] = [];
    if (selectedCountry)
      queryParts.push(`country=${encodeURIComponent(selectedCountry)}`);
    if (selectedBrand)
      queryParts.push(`make=${encodeURIComponent(selectedBrand)}`);
    if (inputModel) queryParts.push(`model=${encodeURIComponent(inputModel)}`);
    if (selectedCarType)
      queryParts.push(`type=${encodeURIComponent(selectedCarType)}`);

    const queryString = queryParts.length > 0 ? "?" + queryParts.join("&") : "";
    const url = `/api/cars${queryString}`;
    console.log("Fetching cars from:", url);
    // In a real app, you'd do: fetch(url)...
  };

  const handleReset = () => {
    setSelectedBrand("");
    setSelectedCountry("");
    setSelectedCarType("");
    setInputModel("");
  };

  /********************************
   * COMPARISON CART
   *******************************/
  const handleAddToComparison = (car: Car) => {
    if (comparisonCart.some((item) => item.id === car.id)) {
      return;
    }
    if (comparisonCart.length >= 4) {
      alert("You can only compare up to 4 cars.");
      return;
    }
    setComparisonCart([...comparisonCart, car]);
  };

  const handleRemoveFromComparison = (carId: number) => {
    setComparisonCart((prevCart) => prevCart.filter((c) => c.id !== carId));
  };

  /********************************
   * CAR DETAILS MODAL
   *******************************/
  const handleOpenCarModal = (car: Car) => {
    setSelectedCar(car);
  };
  const handleCloseCarModal = () => {
    setSelectedCar(null);
  };

  /********************************
   * COMPARISON MODAL
   *******************************/
  const handleOpenCartModal = () => setIsCartOpen(true);
  const handleCloseCartModal = () => setIsCartOpen(false);

  // On "Compare" button click, navigate to /compare page
  const handleNavigateToCompare = () => {
    navigate("/comparison");
  };

  /********************************
   * LOCAL FILTERING FOR DISPLAY
   *******************************/
  const filteredCars = dummyCarData.filter((car) => {
    const matchesBrand = !selectedBrand || car.make === selectedBrand;
    const matchesCountry = !selectedCountry || car.country === selectedCountry;
    const matchesType = !selectedCarType || car.body_type === selectedCarType;
    const matchesYear = !selectedYear || car.year.toString() === selectedYear;
    const matchesModel =
      !inputModel || car.model.toLowerCase().includes(inputModel.toLowerCase());
    return (
      matchesBrand &&
      matchesCountry &&
      matchesType &&
      matchesModel &&
      matchesYear
    );
  });

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
      {/* OPTIONAL TOP-RIGHT CORNER CART ICON */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl">🛒</span>
          <span className="text-white font-bold">{comparisonCart.length}</span>
        </div>
      </div>

      {/* PAGE TITLE & DESCRIPTION */}
      <h1 className="text-4xl font-bold text-white mb-2">Choose Your Car</h1>
      <p className="text-white/90 mb-6">
        Filter and add cars to your comparison cart!
      </p>

      {/* BIG "COMPARISON" BUTTON */}
      <Button
        onClick={handleOpenCartModal}
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 mb-4 text-lg rounded"
      >
        Comparison ({comparisonCart.length})
      </Button>

      {/* FILTERS AS DROPDOWNS + MODEL INPUT */}
      <div className="flex flex-col items-start gap-4 mb-8 w-full max-w-2xl text-white">
        {/* BRAND */}
        <div className="flex flex-col">
          <label htmlFor="brand" className="mb-1 font-semibold">
            Brand
          </label>
          <select
            id="brand"
            className="text-black px-2 py-1 rounded"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option value={brand} key={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* COUNTRY */}
        <div className="flex flex-col">
          <label htmlFor="country" className="mb-1 font-semibold">
            Country
          </label>
          <select
            id="country"
            className="text-black px-2 py-1 rounded"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option value={country} key={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* CAR TYPE */}
        <div className="flex flex-col">
          <label htmlFor="cartype" className="mb-1 font-semibold">
            Car Type
          </label>
          <select
            id="cartype"
            className="text-black px-2 py-1 rounded"
            value={selectedCarType}
            onChange={(e) => setSelectedCarType(e.target.value)}
          >
            <option value="">All Types</option>
            {carTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* YEAR */}
        <div className="flex flex-col">
          <label htmlFor="year" className="mb-1 font-semibold">
            Year
          </label>
          <select
            id="year"
            className="text-black px-2 py-1 rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            {/* Add as many years as needed */}
          </select>
        </div>

        {/* MODEL TEXT INPUT */}
        <div className="flex flex-col">
          <label htmlFor="model" className="mb-1 font-semibold">
            Model
          </label>
          <input
            id="model"
            type="text"
            placeholder="Enter model..."
            className="text-black px-2 py-1 rounded"
            value={inputModel}
            onChange={(e) => setInputModel(e.target.value)}
          />
        </div>

        {/* FIND & RESET BUTTONS */}
        <div className="flex flex-row gap-4 mt-2">
          <Button
            onClick={handleFindCars}
            className="bg-cyan-300 hover:bg-cyan-500 text-sky-800 font-bold px-4 py-2"
          >
            Find
          </Button>
          <Button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-800 text-white font-bold px-4 py-2"
          >
            Reset All
          </Button>
        </div>
      </div>

      {/* FILTERED CARS AS CARDS */}
      {/* RESPONSIVE GRID: 1 col => 2 col => 3 col on large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {filteredCars.length === 0 ? (
          <p className="text-white">No cars match your filters.</p>
        ) : (
          filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white text-black rounded-md shadow p-4 flex flex-col items-center"
            >
              {/* Car Image (click for popup) */}
              <img
                src={car.car_image_path}
                alt={`${car.make} ${car.model}`}
                className="w-full h-48 object-cover mb-2 rounded cursor-pointer"
                onClick={() => handleOpenCarModal(car)}
              />
              {/* Car Info (click for popup) */}
              <h3
                className="text-xl font-bold mb-1 cursor-pointer"
                onClick={() => handleOpenCarModal(car)}
              >
                {car.make} {car.model} ({car.year})
              </h3>
              <p className="mb-1">Type: {car.body_type || "-"}</p>
              <p className="mb-2">Country: {car.country || "-"}</p>

              {/* ADD TO COMPARISON BUTTON */}
              <Button
                onClick={() => handleAddToComparison(car)}
                className="bg-cyan-300 text-sky-800 font-bold hover:bg-cyan-500 w-full"
              >
                Add to comparison
              </Button>
            </div>
          ))
        )}
      </div>

      {/* MODAL: CAR DETAILS (when clicking car image/title) */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={handleCloseCarModal}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white text-black p-6 rounded-md shadow-lg max-w-md w-full">
            <button
              onClick={handleCloseCarModal}
              className="absolute top-2 right-2 font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {selectedCar.make} {selectedCar.model} ({selectedCar.year})
            </h2>
            <img
              src={selectedCar.car_image_path}
              alt={`${selectedCar.make} ${selectedCar.model}`}
              className="mb-4 w-full h-48 object-cover rounded"
            />
            {/* Detailed Info */}
            <p>
              <strong>Generation:</strong> {selectedCar.generation || "-"}
            </p>
            <p>
              <strong>Engine (cc):</strong> {selectedCar.engine_size_cc ?? "-"}
            </p>
            <p>
              <strong>Fuel Type:</strong> {selectedCar.fuel_type || "-"}
            </p>
            <p>
              <strong>Transmission:</strong> {selectedCar.transmission || "-"}
            </p>
            <p>
              <strong>Drivetrain:</strong> {selectedCar.drivetrain || "-"}
            </p>
            <p>
              <strong>Doors:</strong> {selectedCar.num_doors ?? "-"}
            </p>
            <p>
              <strong>MPG (City/Highway):</strong> {selectedCar.mpg_city ?? "-"}{" "}
              / {selectedCar.mpg_highway ?? "-"}
            </p>
            <p>
              <strong>Horsepower (HP):</strong>{" "}
              {selectedCar.horsepower_hp ?? "-"}
            </p>
            <p>
              <strong>Torque (ft-lb):</strong> {selectedCar.torque_ftlb ?? "-"}
            </p>
            <p>
              <strong>0-60 Accel (s):</strong> {selectedCar.acceleration ?? "-"}
            </p>
          </div>
        </div>
      )}

      {/* MODAL: COMPARISON */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={handleCloseCartModal}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white text-black p-6 rounded-md shadow-lg max-w-md w-full">
            <button
              onClick={handleCloseCartModal}
              className="absolute top-2 right-2 font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              My Comparison ({comparisonCart.length})
            </h2>
            {comparisonCart.length === 0 ? (
              <p>No cars in your comparison list.</p>
            ) : (
              <ul>
                {comparisonCart.map((car) => (
                  <li key={car.id} className="flex items-center mb-3">
                    <img
                      src={car.car_image_path}
                      alt={`${car.make} ${car.model}`}
                      className="w-16 h-16 object-cover rounded mr-2"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">
                        {car.make} {car.model} ({car.year})
                      </p>
                      <p>{car.body_type}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromComparison(car.id)}
                      className="text-red-700 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* COMPARE BUTTON */}
            <Button
              onClick={handleNavigateToCompare}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 w-full"
            >
              Compare
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Choose;
