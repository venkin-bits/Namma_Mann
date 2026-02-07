import { useState } from "react";
import SoilAnalysisForm from "./components/SoilAnalysisForm";
import LocationSelector from "./components/LocationSelector";
import ResourceList from "./components/ResourceList";
import { data } from "./data/mockData";

export default function App() {
  const [location, setLocation] = useState("");
  const [view, setView] = useState("soil"); // "soil" | "resources"

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold" style={{ color: "#059669" }}>
            Namma Mann
          </h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setView("soil")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === "soil"
                  ? "bg-green-600 text-white"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              பூச்சி கண்டறிதல்
            </button>
            <button
              onClick={() => setView("resources")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === "resources"
                  ? "bg-green-600 text-white"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              Resources
            </button>
          </nav>
        </div>
      </header>

      <main>
        {view === "soil" && <SoilAnalysisForm />}
        {view === "resources" && (
          <div className="flex flex-col items-center justify-center p-10">
            <p className="text-gray-600 mb-10 text-lg">
              Discover what your land provides.
            </p>
            <LocationSelector setLocation={setLocation} data={data} />
            {location && (
              <p className="mt-6 text-gray-700">
                Showing resources near{" "}
                <span className="font-semibold">{location}</span>
              </p>
            )}
            <ResourceList location={location} data={data} />
          </div>
        )}
      </main>
    </div>
  );
}
