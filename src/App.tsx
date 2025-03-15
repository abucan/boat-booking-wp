import React, { useState } from "react";
import { Ship, List } from "lucide-react";
import { BookingDialog } from "./components/BookingDialog";
import { AdminDashboard } from "./components/AdminDashboard";
import type { Language } from "./types/booking";
import { Toaster } from "react-hot-toast";

interface AppProps {
  buttonText?: string;
  language?: string;
}

function App({
  buttonText = "Book Now",
  language: rawLanguage = "en",
}: AppProps) {
  const language = rawLanguage as Language;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const isAdmin =
    import.meta.env.VITE_ADMIN_EMAIL === "ante.bucan.st@gmail.com";

  // Add this for debugging
  console.log("App is rendering");

  return (
    <div className="min-h-screen bg-transparent">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        {buttonText}
      </button>

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
