import React, { useContext, useState } from "react";
import { ComparisonCartContext, Car } from "../context/ComparisonCartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

function Comparison() {
  const navigate = useNavigate();

  // Context for Comparison Cart
  const context = useContext(ComparisonCartContext);
  if (!context) {
    return <p>Error: Comparison Cart Missing</p>;
  }

  const { comparisonCart, setComparisonCart } = context;

  const carAttributes: (keyof Car)[] = [
    "make",
    "model",
    "year",
    "generation",
    "engine_size_cc",
    "fuel_type",
    "transmission",
    "drivetrain",
    "body_type",
    "num_doors",
    "country",
    "mpg_city",
    "mpg_highway",
    "horsepower_hp",
    "torque_ftlb",
    "acceleration",
  ];

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/profile");
    }
  };

  // Return
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
      <Button
        onClick={handleBackNavigation}
        className="bg-black text-white font-semibold rounded hover:bg-gray-800 transition mb-4 px-4"
      >
        Go Back
      </Button>
      {comparisonCart.length == 0 ? (
        <>
          <p className="text-white">The Comparison Cart is empty.</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-4 text-white bg-white/10 backdrop-blue-md px-4 py-2 rounded-xl inline-block">
            Car Comparison
          </h1>
          <table className="w-full text-sm text-left rtl:text-right text-black">
            <thead className="text-xs uppercase">
              <tr>
                <th scope="col" className="px-4 py-2 bg-cyan-100/60"></th>
                {comparisonCart.map((car, i) => {
                  return (
                    <th
                      scope="col"
                      className={
                        i % 2 == 1
                          ? "px-4 py-2 text-gray-800 bg-cyan-100/60"
                          : "px-4 py-2 text-gray-800 bg-blue-100/60"
                      }
                    >
                      {car.make} {car.model}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {carAttributes.map((attribute, index) => {
                return (
                  <tr key={index}>
                    <td className="px-4 py-2 bg-cyan-100/60">{attribute}</td>
                    {comparisonCart.map((car, i) => (
                      <td
                        key={car.id}
                        className={
                          i % 2 == 1
                            ? "px-4 py-2 text-gray-800 bg-cyan-100/60"
                            : "px-4 py-2 text-gray-800 bg-blue-100/60"
                        }
                      >
                        {car[attribute]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
      <Button
        onClick={handleBackNavigation}
        className="bg-black text-white font-semibold rounded hover:bg-gray-800 transition mt-4 px-4 py-2"
      >
        Go Back
      </Button>
    </div>
  );
}

export default Comparison;
