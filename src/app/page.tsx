

"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import ReactFlowCanvas from "@/components/ReactFlowCanvas";

export default function Page() {
  const [currentView, setCurrentView] = useState<"dashboard" | "canvas">("dashboard");
  
  console.log("Current view:", currentView); // Debug log

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Global Toggle */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`px-4 py-2 rounded-lg shadow ${
            currentView === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView("canvas")}
          className={`px-4 py-2 rounded-lg shadow ${
            currentView === "canvas"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Canvas
        </button>
      </div>

      {/* View Switcher */}
      <main className="flex-1 overflow-hidden">
        {currentView === "dashboard" ? (
          <div>
            <h1 className="text-2xl font-bold p-4">Dashboard View Active</h1>
            <Dashboard />
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold p-4">Canvas View Active</h1>
            <ReactFlowCanvas />
          </div>
        )}
      </main>
    </div>
  );
}
