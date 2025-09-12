"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import ReactFlowCanvas from "@/components/ReactFlowCanvas";
import { BarChart3, Network, Moon, Sun, HelpCircle, ChevronDown } from "lucide-react";

export default function Page() {
  const [currentView, setCurrentView] = useState<"dashboard" | "canvas">("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference and apply to document
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('[data-dropdown="how-to-use"]');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setShowHowToUse(false);
      }
    };

    if (showHowToUse) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHowToUse]);

  return (
    <div className={`h-screen w-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Enhanced Toggle Navigation */}
      <div className="absolute top-6 left-6 z-[60]">
        <div className={`backdrop-blur-sm shadow-lg rounded-full p-1 border ${
          isDarkMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <div className="flex">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                currentView === "dashboard"
                  ? "bg-blue-600 text-white shadow-md"
                  : isDarkMode 
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView("canvas")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                currentView === "canvas"
                  ? "bg-blue-600 text-white shadow-md"
                  : isDarkMode 
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Right Controls: How To Use + Dark Mode */}
      <div className="absolute top-6 right-6 z-50 flex items-center space-x-3">
        {/* How To Use Dropdown */}
        <div className="relative" data-dropdown="how-to-use">
          <button
            onClick={() => setShowHowToUse(!showHowToUse)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
            }`}
            title="How to use this application"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium">How to Use</span>
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showHowToUse ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Content */}
          {showHowToUse && (
            <div className={`absolute top-full right-0 mt-2 w-80 rounded-lg shadow-xl border p-4 z-50 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`font-bold mb-3 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>How to use this application:</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`font-semibold text-sm mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>📊 Dashboard View:</h4>
                  <ul className={`text-xs space-y-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• View trading analytics and market insights</li>
                    <li>• Monitor alerts and trading signals</li>
                    <li>• Interactive charts and data visualization</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className={`font-semibold text-sm mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>🎨 Canvas View:</h4>
                  <ul className={`text-xs space-y-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• <strong>Connect:</strong> Drag colored handles between nodes</li>
                    <li>• <strong>Edit titles:</strong> Double-click any node title</li>
                    <li>• <strong>Edit content:</strong> Click "Open" button on nodes</li>
                    <li>• <strong>Change types:</strong> Click ⋯ button for options</li>
                    <li>• <strong>AI actions:</strong> Available on AI nodes</li>
                    <li>• <strong>Add nodes:</strong> Use toolbar dropdown (bottom-right)</li>
                    <li>• <strong>Zoom/Pan:</strong> Use zoom controls (bottom-left)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className={`font-semibold text-sm mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>🎯 Handle Colors:</h4>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-600"></div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Input</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-green-600"></div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Output</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            isDarkMode
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* View Switcher */}
      <main className="flex-1">
        <div className={`h-full transition-opacity duration-300 ${
          currentView === "dashboard" 
            ? "opacity-100 overflow-y-auto" 
            : "opacity-0 pointer-events-none absolute inset-0"
        }`}>
          <Dashboard />
        </div>
        <div className={`h-full transition-opacity duration-300 ${
          currentView === "canvas" 
            ? "opacity-100 overflow-hidden" 
            : "opacity-0 pointer-events-none absolute inset-0"
        }`}>
          <ReactFlowCanvas />
        </div>
      </main>
    </div>
  );
}