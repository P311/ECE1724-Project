import React, { useContext, useState } from "react";
import { ComparisonCartContext, Car } from "../context/ComparisonCartContext";

function Comparison() {
  const context = useContext(ComparisonCartContext);
  if (!context) {
    return <p>Error: Comparison Cart Missing</p>;
  }

  const { comparisonCart, setComparisonCart } = context;

  return (
    <div>
      <ul>
        {comparisonCart.length > 0 ? (
          comparisonCart.map((car) => {
            return <li key={car.id}>{car.model}</li>;
          })
        ) : (
          <p>The Comparison Cart is empty.</p>
        )}
      </ul>
    </div>
  );
}

export default Comparison;
