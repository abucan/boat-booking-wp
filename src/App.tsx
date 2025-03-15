import React, { useState } from "react";
import { Ship, List } from "lucide-react";
import { BookingDialog } from "./components/BookingDialog";
import { AdminDashboard } from "./components/AdminDashboard";
import type { Language } from "./types/booking";
import { Toaster } from "react-hot-toast";

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  const isAdmin =
    import.meta.env.VITE_ADMIN_EMAIL === "ante.bucan.st@gmail.com";

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Ship className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Boat Tours</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <List className="h-5 w-5" />
                <span>Manage Bookings</span>
              </button>
            )}
            <button
              onClick={() => setLanguage(language === "en" ? "hr" : "en")}
              className="text-gray-600 hover:text-gray-900"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {language === "en" ? "Book Now" : "Rezerviraj"}
            </button>
          </div>
        </div>
      </header>

      <BookingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        language={language}
      />

      {isAdmin && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
}

export default App;
