import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // or your preferred navigation
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { loadImageFromBucket } from "@/utils";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  generation?: string;
  engine_size_cc?: number;
  fuel_type?: string;
  transmission?: string;
  drivetrain?: string;
  body_type: string;
  num_doors?: number;
  country: string;
  mpg_city?: number;
  mpg_highway?: number;
  horsepower_hp?: number;
  torque_ftlb?: number;
  acceleration?: number;
  car_image_path: string;
};

function Choose() {
  const navigate = useNavigate();

  // FILTER STATES
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCarType, setSelectedCarType] = useState<string>("");
  const [inputModel, setInputModel] = useState<string>("");


  // COMPARISON CART (max 4 cars)
  const [comparisonCart, setComparisonCart] = useState<Car[]>([]);

  // MODALS
  const [selectedCar, setSelectedCar] = useState<Car | null>(null); // For car-detail modal
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);     // For comparison modal

  // // Dropdown options
  const [options, setOptions] = useState<any>([]); // For car models
  const [brands, setBrands] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [carTypes, setCarTypes] = useState<string[]>([]);
  const [carModels, setCarModels] = useState<string[]>([]);
  const [carData, setCarData] = useState<Car[]>([]);

  useEffect(() => {
    // Fetch brands, countries, and car types from the API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch("/api/cars/options", {
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        const makes = new Set<string>();
        data.makes.forEach((make: any) => {
          makes.add(make.make);
        })
        setBrands(Array.from(makes));
        setCountries(data.countries);
        setCarTypes(data.types);
        setOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    handleFindCars();
  }, []);

  /********************************
   * FILTER / FIND HANDLERS
   *******************************/
  const handleFindCars = async () => {
    const fetchImageUrls = async (cars: Car[]) => {
      const updatedCars = await Promise.all(
        cars.map(async (car) => ({
          ...car,
          car_image_path: await loadImageFromBucket(car.car_image_path),
        }))
      );
      return updatedCars;
    };
    const queryParts: string[] = [];
    if (selectedCountry) queryParts.push(`country=${encodeURIComponent(selectedCountry)}`);
    if (selectedBrand) queryParts.push(`make=${encodeURIComponent(selectedBrand)}`);
    if (inputModel) queryParts.push(`model=${encodeURIComponent(inputModel)}`);
    if (selectedCarType) queryParts.push(`type=${encodeURIComponent(selectedCarType)}`);

    const queryString = queryParts.length > 0 ? "?" + queryParts.join("&") : "";
    const url = `/api/cars${queryString}`;
    console.log("Fetching cars from:", url);
    const token = localStorage.getItem("jwt");
    const response = await fetch(url, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const carsWithImageUrls = await fetchImageUrls(data.cars);
      setCarData(carsWithImageUrls);
    }
  };

  const selectBrand = (e: ChangeEvent) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value;
    setSelectedBrand(value);
    console.log(value, options);
    setCarModels(options.makes.filter((option: any) => option.make === value)[0].model);
  }

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
    navigate("/compare");
  };


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 p-4">

      {/* PAGE TITLE & DESCRIPTION */}
      <h1 className="text-4xl font-bold text-white mb-2">Choose Your Car</h1>
      <p className="text-white/90 mb-6">Filter and add cars to your comparison cart!</p>

      {/* BIG "COMPARISON" BUTTON */}
      <Button
        onClick={handleOpenCartModal}
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 mb-4 text-lg rounded"
      >
        Selected Cars ({comparisonCart.length})
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
            onChange={(e) => selectBrand(e)}
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


        {/* MODEL TEXT INPUT */}
        <div className="flex flex-col">
          <label htmlFor="model" className="mb-1 font-semibold">
            Model
          </label>
          <select
            id="model"
            className="text-black px-2 py-1 rounded"
            value={inputModel}
            onChange={(e) => setInputModel(e.target.value)}
          >
            <option value="">All Models</option>
            {carModels.map((model) => (
              <option value={model} key={model}>
                  {model}
              </option>
            ))}
          </select>
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
        {carData.length === 0 ? (
          <p className="text-white">No cars match your filters.</p>
        ) : (
          carData.map((car) => (
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
                className="bg-cyan-300 mt-4 text-sky-800 font-bold hover:bg-cyan-500 w-full"
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
            className="absolute inset-0 bg-white/60"
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
              <strong>MPG (City/Highway):</strong>{" "}
              {selectedCar.mpg_city ?? "-"} / {selectedCar.mpg_highway ?? "-"}
            </p>
            <p>
              <strong>Horsepower (HP):</strong> {selectedCar.horsepower_hp ?? "-"}
            </p>
            <p>
              <strong>Torque (ft-lb):</strong> {selectedCar.torque_ftlb ?? "-"}
            </p>
            <p>
              <strong>0-60 Accel (s):</strong> {selectedCar.acceleration ?? "-"}
            </p>
            <Button
                onClick={() => handleAddToComparison(selectedCar)}
                className="bg-cyan-300 text-sky-800 font-bold hover:bg-cyan-500 w-full"
              >
                Add to comparison
              </Button>
          </div>
        </div>
      )}

      {/* MODAL: COMPARISON */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-white/60"
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
              Selected Cars ({comparisonCart.length})
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
