import { useEffect, useState } from "react";
import { Car } from "../context/ComparisonCartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FileText, Home, Car as CarIcon, MessageCircle } from "lucide-react";
import { CardHeader, CardTitle } from "../components/ui/card";

function ComparisonsList() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [selectedComparison, setSelectedComparison] =
    useState<Comparison | null>(null);

  interface Comparison {
    id: number;
    user_id: number;
    cars: Car[];
    created_at: string;
  }

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Create A Comparison",
      url: "/choose",
      icon: CarIcon,
    },
    {
      title: "View Comparisons",
      url: "/comparisonsList",
      icon: FileText,
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: MessageCircle,
    },
  ];

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

  useEffect(() => {
    // load comparisons from /api/comparisons
    const fetchComparisons = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch("/api/comparisons", {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setComparisons(data);
        } else {
          console.error("Failed to fetch comparisons");
        }
      } catch (error) {
        console.error("Error fetching comparisons:", error);
      }
    };
    fetchComparisons();
  }, []);

  const generateComparisonName = (comparison: Comparison) => {
    return comparison.cars
      .map((car) => `${car.make} ${car.model} (${car.year})`)
      .join(" VS. ");
  };

  const handleOpenComparisonModal = (comparison: Comparison) => {
    setSelectedComparison(comparison);
  };

  const handleCloseComparisonModal = () => {
    setSelectedComparison(null);
  };

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xl mb-5">
                Application
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title} className="mb-3">
                      <SidebarMenuButton asChild className="text-lg">
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="w-full">
          <div className="flex flex-col items-center justify-center h-full">
            <Card className="w-7xl bg-white shadow-lg rounded-lg p-12 h-3/4">
              <CardHeader>
                <CardTitle className="text-4xl">My Comparisons:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                  {comparisons.length === 0 ? (
                    <p className="text-black">No comparisons in the record</p>
                  ) : (
                    comparisons.map((comparison) => (
                      <div
                        onClick={() => handleOpenComparisonModal(comparison)}
                        key={comparison.id}
                        className="bg-white text-black rounded-md shadow p-4 flex flex-col items-center"
                      >
                        <p>{generateComparisonName(comparison)}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        {/* MODAL: CAR DETAILS (when clicking car image/title) */}
        {selectedComparison && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-white/60"
              onClick={handleCloseComparisonModal}
            ></div>

            {/* Modal content */}
            <div className="relative bg-white text-black p-6 rounded-md shadow-lg max-w-3xl w-full">
              <button
                onClick={handleCloseComparisonModal}
                className="absolute top-2 right-2 font-bold"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">
                {generateComparisonName(selectedComparison)}
              </h2>
              {/* Detailed Info */}
              <table className="w-full text-sm text-left rtl:text-right text-black">
                <thead className="text-xs uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-2 bg-cyan-100/60"></th>
                    {selectedComparison.cars.map((car, i) => {
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
                        <td className="px-4 py-2 bg-cyan-100/60">
                          {attribute}
                        </td>
                        {selectedComparison.cars.map((car, i) => (
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
            </div>
          </div>
        )}
      </SidebarProvider>
    </div>
  );
}

export default ComparisonsList;
