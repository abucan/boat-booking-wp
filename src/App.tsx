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

function App({ buttonText, language: rawLanguage = "en" }: AppProps) {
  const language = rawLanguage as Language;

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const isAdmin =
    import.meta.env.VITE_ADMIN_EMAIL === "ante.bucan.st@gmail.com";

  // Add this for debugging
  console.log("App is rendering");

  return (
    <div className="min-h-screen bg-white">
      {/* Add this to verify the component is mounting */}
      <h1>Booking Dialog Should Appear Below</h1>

      <BookingDialog
        isOpen={true}
        onClose={() => {
          console.log("Close attempted");
        }}
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
