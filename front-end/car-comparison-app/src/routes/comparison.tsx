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
  const [status, setStatus] = useState<"Idle" | "Saving" | "Saved">("Idle");

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

  const handleResetCart = () => {
    setTimeout(() => {
      setComparisonCart([]);
      navigate("/profile");
    }, 3000);
  };

  const handleSaveComparison = () => {
    setStatus("Saving");
    const token = localStorage.getItem("jwt");

    const cars = comparisonCart.map((car) => car.id);
    console.log(JSON.stringify(cars));

    fetch("/api/comparisons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ cars }),
    })
      .then((response) => {
        if (!response.ok) {
          setStatus("Idle");
          throw new Error("Save failed");
        } else {
          console.log(`Comparison is now saved.`);
          setStatus("Saved");
          handleResetCart();
        }
      })
      .catch((error) => {
        setStatus("Idle");
        console.error("Error when saving comparison:", error);
      });
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

          <Button
            onClick={handleSaveComparison}
            className="bg-emerald-500 text-white font-semibold rounded hover:bg-emerald-600 transition mt-4 px-4 py-2 !disabled:bg-grey-400 disabled:cursor-not-allowed"
            disabled={status !== "Idle"}
          >
            Save
          </Button>
          {status == "Saving" ? (
            <p className="text-gray-600 text-sm font-medium"> Saving... </p>
          ) : status == "Saved" ? (
            <p className="text-gray-600 text-sm font-medium">
              Comparison saved, redirecting to profile page
            </p>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}

export default Comparison;
