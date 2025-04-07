import { createContext } from "react";

export type Car = {
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

export const ComparisonCartContext = createContext<{
  comparisonCart: Car[];
  setComparisonCart: React.Dispatch<React.SetStateAction<Car[]>>;
} | null>(null);
